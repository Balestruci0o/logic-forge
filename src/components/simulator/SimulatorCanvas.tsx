import { useRef, useEffect, useCallback } from "react";
import { SimulatorComponent, Connection, SwitchComponent, ClockComponent, LatchComponent } from "./types";

interface SimulatorCanvasProps {
  components: SimulatorComponent[];
  connections: Connection[];
  connecting: {
    componentId: string;
    portIndex: number;
    portType: "input" | "output";
  } | null;
  selectedComponent: string | null;
  onComponentClick: (id: string, x: number, y: number) => void;
  onComponentDoubleClick: (id: string) => void;
  onPortClick: (componentId: string, portIndex: number, portType: "input" | "output") => void;
  onCanvasClick: () => void;
  onDragStart: (componentId: string, x: number, y: number) => void;
  onDragMove: (x: number, y: number) => void;
  onDragEnd: () => void;
  dragging: boolean;
}

const SimulatorCanvas: React.FC<SimulatorCanvasProps> = ({
  components,
  connections,
  connecting,
  selectedComponent,
  onComponentClick,
  onComponentDoubleClick,
  onPortClick,
  onCanvasClick,
  onDragStart,
  onDragMove,
  onDragEnd,
  dragging,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number>();
  const mousePos = useRef({ x: 0, y: 0 });

  const getCanvasCoords = useCallback((e: MouseEvent | React.MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  }, []);

  const drawGrid = useCallback((ctx: CanvasRenderingContext2D, width: number, height: number) => {
    ctx.fillStyle = "#2c323b";
    ctx.fillRect(0, 0, width, height);

    ctx.strokeStyle = "#3e454f";
    ctx.lineWidth = 1;

    const gridSize = 20;
    for (let x = 0; x <= width; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    for (let y = 0; y <= height; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }
  }, []);

  const drawComponent = useCallback(
    (ctx: CanvasRenderingContext2D, comp: SimulatorComponent, isSelected: boolean) => {
      const { x, y, width, height, type } = comp;

      // Component body
      ctx.fillStyle = isSelected ? "#1a2030" : "#151a24";
      ctx.strokeStyle = isSelected ? "#00ffff" : "#3e454f";
      ctx.lineWidth = isSelected ? 2 : 1;

      // Draw rounded rectangle
      const radius = 8;
      ctx.beginPath();
      ctx.moveTo(x + radius, y);
      ctx.lineTo(x + width - radius, y);
      ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
      ctx.lineTo(x + width, y + height - radius);
      ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
      ctx.lineTo(x + radius, y + height);
      ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
      ctx.lineTo(x, y + radius);
      ctx.quadraticCurveTo(x, y, x + radius, y);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Glow effect for selected
      if (isSelected) {
        ctx.shadowColor = "#00ffff";
        ctx.shadowBlur = 15;
        ctx.stroke();
        ctx.shadowBlur = 0;
      }

      // Component label
      ctx.fillStyle = "#e0f7fa";
      ctx.font = "bold 12px 'Orbitron', sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(type.replace("_", " "), x + width / 2, y + height / 2);

      // Draw specific states
      if (type === "SWITCH") {
        const state = (comp as SwitchComponent).state;
        ctx.fillStyle = state ? "#00ff88" : "#ff4444";
        ctx.beginPath();
        ctx.arc(x + width / 2, y + height - 10, 5, 0, Math.PI * 2);
        ctx.fill();
        if (state) {
          ctx.shadowColor = "#00ff88";
          ctx.shadowBlur = 10;
          ctx.fill();
          ctx.shadowBlur = 0;
        }
      } else if (type === "CLOCK") {
        const state = (comp as ClockComponent).state;
        ctx.fillStyle = state ? "#00ff88" : "#666";
        ctx.beginPath();
        ctx.arc(x + width / 2, y + height - 10, 5, 0, Math.PI * 2);
        ctx.fill();
        if (state) {
          ctx.shadowColor = "#00ff88";
          ctx.shadowBlur = 10;
          ctx.fill();
          ctx.shadowBlur = 0;
        }
      } else if (type === "LED") {
        const signal = comp.inputs[0]?.signal || false;
        ctx.fillStyle = signal ? "#00ff88" : "#333";
        ctx.beginPath();
        ctx.arc(x + width / 2, y + height / 2, 12, 0, Math.PI * 2);
        ctx.fill();
        if (signal) {
          ctx.shadowColor = "#00ff88";
          ctx.shadowBlur = 20;
          ctx.fill();
          ctx.shadowBlur = 0;
        }
        ctx.strokeStyle = "#3e454f";
        ctx.lineWidth = 2;
        ctx.stroke();
      } else if (type === "LATCH") {
        const state = (comp as LatchComponent).state;
        ctx.fillStyle = "#888";
        ctx.font = "10px 'JetBrains Mono', monospace";
        ctx.textAlign = "left";
        ctx.fillText("S", x + 5, y + 23);
        ctx.fillText("R", x + 5, y + 43);
        ctx.textAlign = "right";
        ctx.fillText("Q", x + width - 5, y + 23);
        ctx.fillText("Q'", x + width - 5, y + 43);
      }

      // Draw ports
      comp.inputs.forEach((port, i) => {
        const px = x + port.x;
        const py = y + port.y;
        ctx.fillStyle = port.signal ? "#00ff88" : "#ffcc00";
        ctx.beginPath();
        ctx.arc(px, py, 6, 0, Math.PI * 2);
        ctx.fill();
        if (port.signal) {
          ctx.shadowColor = "#00ff88";
          ctx.shadowBlur = 8;
          ctx.fill();
          ctx.shadowBlur = 0;
        }
        ctx.strokeStyle = "#fff";
        ctx.lineWidth = 1;
        ctx.stroke();
      });

      comp.outputs.forEach((port, i) => {
        const px = x + port.x;
        const py = y + port.y;
        ctx.fillStyle = port.signal ? "#00ff88" : "#ffcc00";
        ctx.beginPath();
        ctx.arc(px, py, 6, 0, Math.PI * 2);
        ctx.fill();
        if (port.signal) {
          ctx.shadowColor = "#00ff88";
          ctx.shadowBlur = 8;
          ctx.fill();
          ctx.shadowBlur = 0;
        }
        ctx.strokeStyle = "#fff";
        ctx.lineWidth = 1;
        ctx.stroke();
      });
    },
    []
  );

  const drawConnection = useCallback(
    (
      ctx: CanvasRenderingContext2D,
      conn: Connection,
      componentMap: Map<string, SimulatorComponent>,
      time: number
    ) => {
      const fromComp = componentMap.get(conn.fromComponent);
      const toComp = componentMap.get(conn.toComponent);

      if (!fromComp || !toComp) return;

      const fromPort = fromComp.outputs[conn.fromPort];
      const toPort = toComp.inputs[conn.toPort];

      if (!fromPort || !toPort) return;

      const x1 = fromComp.x + fromPort.x;
      const y1 = fromComp.y + fromPort.y;
      const x2 = toComp.x + toPort.x;
      const y2 = toComp.y + toPort.y;

      // Draw cable
      ctx.strokeStyle = conn.signal ? "#00ff88" : "#ffcc00";
      ctx.lineWidth = 3;

      // Bezier curve for nice cable look
      const midX = (x1 + x2) / 2;
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.bezierCurveTo(midX + 30, y1, midX - 30, y2, x2, y2);
      ctx.stroke();

      // Glow effect for active signal
      if (conn.signal) {
        ctx.strokeStyle = "rgba(0, 255, 136, 0.5)";
        ctx.lineWidth = 6;
        ctx.shadowColor = "#00ff88";
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.bezierCurveTo(midX + 30, y1, midX - 30, y2, x2, y2);
        ctx.stroke();
        ctx.shadowBlur = 0;

        // Animated flow particles
        const gradient = ctx.createLinearGradient(x1, y1, x2, y2);
        const offset = (time % 1000) / 1000;
        gradient.addColorStop(Math.max(0, offset - 0.1), "transparent");
        gradient.addColorStop(offset, "#00ff88");
        gradient.addColorStop(Math.min(1, offset + 0.1), "transparent");
        ctx.strokeStyle = gradient;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.bezierCurveTo(midX + 30, y1, midX - 30, y2, x2, y2);
        ctx.stroke();
      }
    },
    []
  );

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const time = Date.now();

    // Clear and draw grid
    drawGrid(ctx, width, height);

    // Create component map for quick lookup
    const componentMap = new Map(components.map((c) => [c.id, c]));

    // Draw connections
    connections.forEach((conn) => {
      drawConnection(ctx, conn, componentMap, time);
    });

    // Draw pending connection
    if (connecting) {
      const comp = componentMap.get(connecting.componentId);
      if (comp) {
        const port =
          connecting.portType === "output"
            ? comp.outputs[connecting.portIndex]
            : comp.inputs[connecting.portIndex];
        if (port) {
          const x1 = comp.x + port.x;
          const y1 = comp.y + port.y;

          ctx.strokeStyle = "#00ffff";
          ctx.lineWidth = 2;
          ctx.setLineDash([5, 5]);
          ctx.beginPath();
          ctx.moveTo(x1, y1);
          ctx.lineTo(mousePos.current.x, mousePos.current.y);
          ctx.stroke();
          ctx.setLineDash([]);
        }
      }
    }

    // Draw components
    components.forEach((comp) => {
      drawComponent(ctx, comp, comp.id === selectedComponent);
    });

    animationFrameRef.current = requestAnimationFrame(draw);
  }, [components, connections, connecting, selectedComponent, drawGrid, drawComponent, drawConnection]);

  useEffect(() => {
    draw();
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [draw]);

  const handleMouseDown = (e: React.MouseEvent) => {
    const coords = getCanvasCoords(e);
    mousePos.current = coords;

    // Check if clicking on a port
    for (const comp of components) {
      // Check outputs
      for (let i = 0; i < comp.outputs.length; i++) {
        const port = comp.outputs[i];
        const px = comp.x + port.x;
        const py = comp.y + port.y;
        const dist = Math.sqrt((coords.x - px) ** 2 + (coords.y - py) ** 2);
        if (dist <= 8) {
          onPortClick(comp.id, i, "output");
          return;
        }
      }
      // Check inputs
      for (let i = 0; i < comp.inputs.length; i++) {
        const port = comp.inputs[i];
        const px = comp.x + port.x;
        const py = comp.y + port.y;
        const dist = Math.sqrt((coords.x - px) ** 2 + (coords.y - py) ** 2);
        if (dist <= 8) {
          onPortClick(comp.id, i, "input");
          return;
        }
      }
    }

    // Check if clicking on a component
    for (const comp of components) {
      if (
        coords.x >= comp.x &&
        coords.x <= comp.x + comp.width &&
        coords.y >= comp.y &&
        coords.y <= comp.y + comp.height
      ) {
        onDragStart(comp.id, coords.x, coords.y);
        return;
      }
    }

    onCanvasClick();
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    const coords = getCanvasCoords(e);
    mousePos.current = coords;
    if (dragging) {
      onDragMove(coords.x, coords.y);
    }
  };

  const handleMouseUp = () => {
    onDragEnd();
  };

  const handleDoubleClick = (e: React.MouseEvent) => {
    const coords = getCanvasCoords(e);

    for (const comp of components) {
      if (
        coords.x >= comp.x &&
        coords.x <= comp.x + comp.width &&
        coords.y >= comp.y &&
        coords.y <= comp.y + comp.height
      ) {
        onComponentDoubleClick(comp.id);
        return;
      }
    }
  };

  return (
    <canvas
      ref={canvasRef}
      width={800}
      height={500}
      className="rounded-lg cursor-crosshair"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onDoubleClick={handleDoubleClick}
    />
  );
};

export default SimulatorCanvas;

import { useState, useCallback, useRef, useEffect } from "react";
import {
  SimulatorComponent,
  Connection,
  ComponentType,
  Point,
  SwitchComponent,
  ClockComponent,
} from "./types";

const createComponent = (
  type: ComponentType,
  x: number,
  y: number
): SimulatorComponent => {
  const id = `${type}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  const baseWidth = 80;
  const baseHeight = 60;

  const baseComponent = {
    id,
    x,
    y,
    selected: false,
  };

  switch (type) {
    case "SWITCH":
      return {
        ...baseComponent,
        type: "SWITCH",
        width: 60,
        height: 40,
        inputs: [],
        outputs: [{ x: 60, y: 20, type: "output", signal: false }],
        state: false,
      };
    case "CLOCK":
      return {
        ...baseComponent,
        type: "CLOCK",
        width: 60,
        height: 40,
        inputs: [],
        outputs: [{ x: 60, y: 20, type: "output", signal: false }],
        state: false,
        frequency: 1000,
      };
    case "LED":
      return {
        ...baseComponent,
        type: "LED",
        width: 40,
        height: 40,
        inputs: [{ x: 0, y: 20, type: "input", signal: false }],
        outputs: [],
      };
    case "NOT":
    case "BUFFER":
      return {
        ...baseComponent,
        type,
        width: baseWidth,
        height: baseHeight,
        inputs: [{ x: 0, y: 30, type: "input", signal: false }],
        outputs: [{ x: baseWidth, y: 30, type: "output", signal: false }],
      };
    case "AND":
    case "OR":
    case "NAND":
    case "NOR":
    case "XOR":
    case "XNOR":
      return {
        ...baseComponent,
        type,
        width: baseWidth,
        height: baseHeight,
        inputs: [
          { x: 0, y: 20, type: "input", signal: false },
          { x: 0, y: 40, type: "input", signal: false },
        ],
        outputs: [{ x: baseWidth, y: 30, type: "output", signal: false }],
      };
    case "LATCH":
      return {
        ...baseComponent,
        type: "LATCH",
        width: 80,
        height: 60,
        inputs: [
          { x: 0, y: 20, type: "input", signal: false },
          { x: 0, y: 40, type: "input", signal: false },
        ],
        outputs: [
          { x: 80, y: 20, type: "output", signal: false },
          { x: 80, y: 40, type: "output", signal: false },
        ],
        state: false,
      };
    case "FULL_ADDER":
      return {
        ...baseComponent,
        type: "FULL_ADDER",
        width: 100,
        height: 80,
        inputs: [
          { x: 0, y: 20, type: "input", signal: false },
          { x: 0, y: 40, type: "input", signal: false },
          { x: 0, y: 60, type: "input", signal: false },
        ],
        outputs: [
          { x: 100, y: 30, type: "output", signal: false },
          { x: 100, y: 50, type: "output", signal: false },
        ],
      };
    case "ALU":
      return {
        ...baseComponent,
        type: "ALU",
        width: 120,
        height: 100,
        inputs: [
          { x: 0, y: 25, type: "input", signal: false },
          { x: 0, y: 50, type: "input", signal: false },
          { x: 0, y: 75, type: "input", signal: false },
          { x: 60, y: 0, type: "input", signal: false },
        ],
        outputs: [
          { x: 120, y: 50, type: "output", signal: false },
          { x: 100, y: 100, type: "output", signal: false },
        ],
        operation: 0,
      };
    case "REGISTER":
      return {
        ...baseComponent,
        type: "REGISTER",
        width: 80,
        height: 60,
        inputs: [
          { x: 0, y: 20, type: "input", signal: false },
          { x: 0, y: 40, type: "input", signal: false },
        ],
        outputs: [{ x: 80, y: 30, type: "output", signal: false }],
        value: 0,
      };
    case "ENCODER":
      return {
        ...baseComponent,
        type: "ENCODER",
        width: 80,
        height: 80,
        inputs: [
          { x: 0, y: 20, type: "input", signal: false },
          { x: 0, y: 40, type: "input", signal: false },
          { x: 0, y: 60, type: "input", signal: false },
        ],
        outputs: [
          { x: 80, y: 30, type: "output", signal: false },
          { x: 80, y: 50, type: "output", signal: false },
        ],
      };
    case "DECODER":
      return {
        ...baseComponent,
        type: "DECODER",
        width: 80,
        height: 80,
        inputs: [
          { x: 0, y: 30, type: "input", signal: false },
          { x: 0, y: 50, type: "input", signal: false },
        ],
        outputs: [
          { x: 80, y: 20, type: "output", signal: false },
          { x: 80, y: 40, type: "output", signal: false },
          { x: 80, y: 60, type: "output", signal: false },
        ],
      };
    case "MUX":
      return {
        ...baseComponent,
        type: "MUX",
        width: 60,
        height: 80,
        inputs: [
          { x: 0, y: 20, type: "input", signal: false },
          { x: 0, y: 40, type: "input", signal: false },
          { x: 30, y: 80, type: "input", signal: false },
        ],
        outputs: [{ x: 60, y: 40, type: "output", signal: false }],
      };
    case "DEMUX":
      return {
        ...baseComponent,
        type: "DEMUX",
        width: 60,
        height: 80,
        inputs: [
          { x: 0, y: 40, type: "input", signal: false },
          { x: 30, y: 80, type: "input", signal: false },
        ],
        outputs: [
          { x: 60, y: 20, type: "output", signal: false },
          { x: 60, y: 60, type: "output", signal: false },
        ],
      };
    default:
      return {
        ...baseComponent,
        type: "AND",
        width: baseWidth,
        height: baseHeight,
        inputs: [
          { x: 0, y: 20, type: "input", signal: false },
          { x: 0, y: 40, type: "input", signal: false },
        ],
        outputs: [{ x: baseWidth, y: 30, type: "output", signal: false }],
      };
  }
};

const calculateGateOutput = (type: string, inputs: boolean[]): boolean[] => {
  switch (type) {
    case "AND":
      return [inputs.every((i) => i)];
    case "OR":
      return [inputs.some((i) => i)];
    case "NOT":
      return [!inputs[0]];
    case "NAND":
      return [!inputs.every((i) => i)];
    case "NOR":
      return [!inputs.some((i) => i)];
    case "XOR":
      return [inputs.filter((i) => i).length % 2 === 1];
    case "XNOR":
      return [inputs.filter((i) => i).length % 2 === 0];
    case "BUFFER":
      return [inputs[0]];
    case "FULL_ADDER": {
      const a = inputs[0] ? 1 : 0;
      const b = inputs[1] ? 1 : 0;
      const cin = inputs[2] ? 1 : 0;
      const sum = a ^ b ^ cin;
      const cout = (a & b) | (cin & (a ^ b));
      return [sum === 1, cout === 1];
    }
    case "ENCODER": {
      const idx = inputs.findIndex((i) => i);
      if (idx === -1) return [false, false];
      return [(idx & 1) === 1, (idx & 2) === 2];
    }
    case "DECODER": {
      const val = (inputs[0] ? 1 : 0) + (inputs[1] ? 2 : 0);
      return [val === 0, val === 1, val === 2, val === 3].slice(0, 3);
    }
    case "MUX": {
      const sel = inputs[2];
      return [sel ? inputs[1] : inputs[0]];
    }
    case "DEMUX": {
      const input = inputs[0];
      const sel = inputs[1];
      return sel ? [false, input] : [input, false];
    }
    default:
      return [false];
  }
};

export const useSimulator = () => {
  const [components, setComponents] = useState<SimulatorComponent[]>([]);
  const [connections, setConnections] = useState<Connection[]>([]);
  const [selectedComponent, setSelectedComponent] = useState<string | null>(null);
  const [connecting, setConnecting] = useState<{
    componentId: string;
    portIndex: number;
    portType: "input" | "output";
  } | null>(null);
  const [dragging, setDragging] = useState<{
    componentId: string;
    offsetX: number;
    offsetY: number;
  } | null>(null);
  const clockIntervalsRef = useRef<Map<string, NodeJS.Timeout>>(new Map());

  // Clean up clock intervals on unmount
  useEffect(() => {
    return () => {
      clockIntervalsRef.current.forEach((interval) => clearInterval(interval));
    };
  }, []);

  const addComponent = useCallback((type: ComponentType, x: number, y: number) => {
    const component = createComponent(type, x, y);
    setComponents((prev) => [...prev, component]);

    // Start clock if it's a clock component
    if (type === "CLOCK") {
      const interval = setInterval(() => {
        setComponents((prev) =>
          prev.map((c) =>
            c.id === component.id && c.type === "CLOCK"
              ? { ...c, state: !(c as ClockComponent).state }
              : c
          )
        );
      }, (component as ClockComponent).frequency);
      clockIntervalsRef.current.set(component.id, interval);
    }

    return component.id;
  }, []);

  const removeComponent = useCallback((id: string) => {
    // Clear clock interval if exists
    const interval = clockIntervalsRef.current.get(id);
    if (interval) {
      clearInterval(interval);
      clockIntervalsRef.current.delete(id);
    }

    setComponents((prev) => prev.filter((c) => c.id !== id));
    setConnections((prev) =>
      prev.filter((c) => c.fromComponent !== id && c.toComponent !== id)
    );
    if (selectedComponent === id) {
      setSelectedComponent(null);
    }
  }, [selectedComponent]);

  const moveComponent = useCallback((id: string, x: number, y: number) => {
    setComponents((prev) =>
      prev.map((c) => (c.id === id ? { ...c, x, y } : c))
    );
  }, []);

  const toggleSwitch = useCallback((id: string) => {
    setComponents((prev) =>
      prev.map((c) =>
        c.id === id && c.type === "SWITCH"
          ? { ...c, state: !(c as SwitchComponent).state }
          : c
      )
    );
  }, []);

  const startConnection = useCallback(
    (componentId: string, portIndex: number, portType: "input" | "output") => {
      if (connecting) {
        // Complete connection
        if (
          connecting.portType !== portType &&
          connecting.componentId !== componentId
        ) {
          const newConnection: Connection =
            portType === "input"
              ? {
                  fromComponent: connecting.componentId,
                  fromPort: connecting.portIndex,
                  toComponent: componentId,
                  toPort: portIndex,
                  signal: false,
                }
              : {
                  fromComponent: componentId,
                  fromPort: portIndex,
                  toComponent: connecting.componentId,
                  toPort: connecting.portIndex,
                  signal: false,
                };

          // Check if connection already exists
          const exists = connections.some(
            (c) =>
              c.fromComponent === newConnection.fromComponent &&
              c.fromPort === newConnection.fromPort &&
              c.toComponent === newConnection.toComponent &&
              c.toPort === newConnection.toPort
          );

          if (!exists) {
            setConnections((prev) => [...prev, newConnection]);
          }
        }
        setConnecting(null);
      } else {
        setConnecting({ componentId, portIndex, portType });
      }
    },
    [connecting, connections]
  );

  const cancelConnection = useCallback(() => {
    setConnecting(null);
  }, []);

  const removeConnection = useCallback(
    (fromComponent: string, fromPort: number, toComponent: string, toPort: number) => {
      setConnections((prev) =>
        prev.filter(
          (c) =>
            !(
              c.fromComponent === fromComponent &&
              c.fromPort === fromPort &&
              c.toComponent === toComponent &&
              c.toPort === toPort
            )
        )
      );
    },
    []
  );

  const startDragging = useCallback(
    (componentId: string, mouseX: number, mouseY: number) => {
      const component = components.find((c) => c.id === componentId);
      if (component) {
        setDragging({
          componentId,
          offsetX: mouseX - component.x,
          offsetY: mouseY - component.y,
        });
        setSelectedComponent(componentId);
      }
    },
    [components]
  );

  const updateDragging = useCallback(
    (mouseX: number, mouseY: number) => {
      if (dragging) {
        const newX = Math.max(0, mouseX - dragging.offsetX);
        const newY = Math.max(0, mouseY - dragging.offsetY);
        moveComponent(dragging.componentId, newX, newY);
      }
    },
    [dragging, moveComponent]
  );

  const stopDragging = useCallback(() => {
    setDragging(null);
  }, []);

  // Simulation update
  const simulate = useCallback(() => {
    setComponents((prev) => {
      const newComponents = [...prev];
      const componentMap = new Map(newComponents.map((c) => [c.id, c]));

      // Reset all input signals
      newComponents.forEach((c) => {
        c.inputs.forEach((input) => {
          input.signal = false;
        });
      });

      // Propagate signals through connections
      connections.forEach((conn) => {
        const fromComp = componentMap.get(conn.fromComponent);
        const toComp = componentMap.get(conn.toComponent);

        if (fromComp && toComp) {
          let signal = false;

          if (fromComp.type === "SWITCH") {
            signal = (fromComp as SwitchComponent).state;
          } else if (fromComp.type === "CLOCK") {
            signal = (fromComp as ClockComponent).state;
          } else if (fromComp.outputs[conn.fromPort]) {
            signal = fromComp.outputs[conn.fromPort].signal;
          }

          if (toComp.inputs[conn.toPort]) {
            toComp.inputs[conn.toPort].signal = signal;
          }
        }
      });

      // Update connection signals
      setConnections((prevConns) =>
        prevConns.map((conn) => {
          const fromComp = componentMap.get(conn.fromComponent);
          if (!fromComp) return conn;

          let signal = false;
          if (fromComp.type === "SWITCH") {
            signal = (fromComp as SwitchComponent).state;
          } else if (fromComp.type === "CLOCK") {
            signal = (fromComp as ClockComponent).state;
          } else if (fromComp.outputs[conn.fromPort]) {
            signal = fromComp.outputs[conn.fromPort].signal;
          }

          return { ...conn, signal };
        })
      );

      // Calculate outputs for each component
      newComponents.forEach((comp) => {
        if (comp.type === "SWITCH" || comp.type === "CLOCK") {
          const state = comp.type === "SWITCH" 
            ? (comp as SwitchComponent).state 
            : (comp as ClockComponent).state;
          comp.outputs[0].signal = state;
        } else if (comp.type === "LED") {
          // LED just displays input
        } else if (comp.type === "LATCH") {
          const s = comp.inputs[0]?.signal || false;
          const r = comp.inputs[1]?.signal || false;
          const latch = comp as any;
          if (s && !r) latch.state = true;
          if (r && !s) latch.state = false;
          comp.outputs[0].signal = latch.state;
          comp.outputs[1].signal = !latch.state;
        } else if (comp.type === "REGISTER") {
          const data = comp.inputs[0]?.signal || false;
          const clock = comp.inputs[1]?.signal || false;
          const reg = comp as any;
          if (clock) reg.value = data ? 1 : 0;
          comp.outputs[0].signal = reg.value === 1;
        } else if (comp.type === "ALU") {
          const a = comp.inputs[0]?.signal || false;
          const b = comp.inputs[1]?.signal || false;
          const op = comp.inputs[3]?.signal || false;
          if (op) {
            comp.outputs[0].signal = a && b;
          } else {
            comp.outputs[0].signal = a !== b;
          }
          comp.outputs[1].signal = false;
        } else {
          const inputSignals = comp.inputs.map((i) => i.signal);
          const outputs = calculateGateOutput(comp.type, inputSignals);
          outputs.forEach((out, i) => {
            if (comp.outputs[i]) {
              comp.outputs[i].signal = out;
            }
          });
        }
      });

      return newComponents;
    });
  }, [connections]);

  // Run simulation continuously
  useEffect(() => {
    const interval = setInterval(simulate, 50);
    return () => clearInterval(interval);
  }, [simulate]);

  const clearAll = useCallback(() => {
    clockIntervalsRef.current.forEach((interval) => clearInterval(interval));
    clockIntervalsRef.current.clear();
    setComponents([]);
    setConnections([]);
    setSelectedComponent(null);
    setConnecting(null);
    setDragging(null);
  }, []);

  return {
    components,
    connections,
    selectedComponent,
    connecting,
    dragging,
    addComponent,
    removeComponent,
    moveComponent,
    toggleSwitch,
    startConnection,
    cancelConnection,
    removeConnection,
    startDragging,
    updateDragging,
    stopDragging,
    setSelectedComponent,
    clearAll,
  };
};

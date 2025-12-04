import { useEffect, useCallback } from "react";
import { useSimulator } from "./useSimulator";
import SimulatorCanvas from "./SimulatorCanvas";
import ComponentPalette from "./ComponentPalette";
import { ComponentType } from "./types";

const LogicSimulator = () => {
  const {
    components,
    connections,
    selectedComponent,
    connecting,
    dragging,
    addComponent,
    removeComponent,
    toggleSwitch,
    startConnection,
    cancelConnection,
    startDragging,
    updateDragging,
    stopDragging,
    setSelectedComponent,
    clearAll,
  } = useSimulator();

  const handleAddComponent = useCallback(
    (type: ComponentType) => {
      // Add at random position in canvas area
      const x = 100 + Math.random() * 500;
      const y = 50 + Math.random() * 350;
      addComponent(type, x, y);
    },
    [addComponent]
  );

  const handleComponentClick = useCallback(
    (id: string, x: number, y: number) => {
      setSelectedComponent(id);
    },
    [setSelectedComponent]
  );

  const handleComponentDoubleClick = useCallback(
    (id: string) => {
      const comp = components.find((c) => c.id === id);
      if (comp?.type === "SWITCH") {
        toggleSwitch(id);
      }
    },
    [components, toggleSwitch]
  );

  const handlePortClick = useCallback(
    (componentId: string, portIndex: number, portType: "input" | "output") => {
      startConnection(componentId, portIndex, portType);
    },
    [startConnection]
  );

  const handleCanvasClick = useCallback(() => {
    if (connecting) {
      cancelConnection();
    } else {
      setSelectedComponent(null);
    }
  }, [connecting, cancelConnection, setSelectedComponent]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Delete" || e.key === "Backspace") {
        if (selectedComponent) {
          removeComponent(selectedComponent);
        }
      }
      if (e.key === "Escape") {
        cancelConnection();
        setSelectedComponent(null);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedComponent, removeComponent, cancelConnection, setSelectedComponent]);

  return (
    <div className="flex gap-4">
      <ComponentPalette onAddComponent={handleAddComponent} onClear={clearAll} />

      <div className="flex-1">
        <div className="relative rounded-lg overflow-hidden border border-border/50 neon-border">
          <SimulatorCanvas
            components={components}
            connections={connections}
            connecting={connecting}
            selectedComponent={selectedComponent}
            onComponentClick={handleComponentClick}
            onComponentDoubleClick={handleComponentDoubleClick}
            onPortClick={handlePortClick}
            onCanvasClick={handleCanvasClick}
            onDragStart={startDragging}
            onDragMove={updateDragging}
            onDragEnd={stopDragging}
            dragging={!!dragging}
          />

          {/* Status bar */}
          <div className="absolute bottom-0 left-0 right-0 bg-card/90 backdrop-blur-sm border-t border-border/50 px-4 py-2 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="text-xs font-mono text-muted-foreground">
                Components: <span className="text-primary">{components.length}</span>
              </span>
              <span className="text-xs font-mono text-muted-foreground">
                Connections: <span className="text-secondary">{connections.length}</span>
              </span>
            </div>
            <div className="flex items-center gap-2">
              {connecting && (
                <span className="text-xs font-mono text-accent animate-pulse">
                  Click a port to connect...
                </span>
              )}
              {selectedComponent && (
                <span className="text-xs font-mono text-primary">
                  Selected: {components.find((c) => c.id === selectedComponent)?.type}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LogicSimulator;

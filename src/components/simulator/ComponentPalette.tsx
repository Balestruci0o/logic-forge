import { ComponentType } from "./types";

interface ComponentPaletteProps {
  onAddComponent: (type: ComponentType) => void;
  onClear: () => void;
}

const ComponentPalette: React.FC<ComponentPaletteProps> = ({
  onAddComponent,
  onClear,
}) => {
  const categories = [
    {
      name: "Input/Output",
      components: [
        { type: "SWITCH" as ComponentType, label: "Switch", icon: "⚡" },
        { type: "CLOCK" as ComponentType, label: "Clock", icon: "⏰" },
        { type: "LED" as ComponentType, label: "LED", icon: "💡" },
      ],
    },
    {
      name: "Basic Gates",
      components: [
        { type: "AND" as ComponentType, label: "AND", icon: "∧" },
        { type: "OR" as ComponentType, label: "OR", icon: "∨" },
        { type: "NOT" as ComponentType, label: "NOT", icon: "¬" },
        { type: "BUFFER" as ComponentType, label: "Buffer", icon: "▷" },
      ],
    },
    {
      name: "Advanced Gates",
      components: [
        { type: "NAND" as ComponentType, label: "NAND", icon: "⊼" },
        { type: "NOR" as ComponentType, label: "NOR", icon: "⊽" },
        { type: "XOR" as ComponentType, label: "XOR", icon: "⊕" },
        { type: "XNOR" as ComponentType, label: "XNOR", icon: "⊙" },
      ],
    },
    {
      name: "Memory",
      components: [
        { type: "LATCH" as ComponentType, label: "Latch", icon: "🔒" },
        { type: "REGISTER" as ComponentType, label: "Register", icon: "📋" },
      ],
    },
    {
      name: "Arithmetic",
      components: [
        { type: "FULL_ADDER" as ComponentType, label: "Full Adder", icon: "➕" },
        { type: "ALU" as ComponentType, label: "ALU", icon: "🧮" },
      ],
    },
    {
      name: "Routing",
      components: [
        { type: "ENCODER" as ComponentType, label: "Encoder", icon: "🔢" },
        { type: "DECODER" as ComponentType, label: "Decoder", icon: "🔓" },
        { type: "MUX" as ComponentType, label: "MUX", icon: "🔀" },
        { type: "DEMUX" as ComponentType, label: "DEMUX", icon: "🔁" },
      ],
    },
  ];

  return (
    <div className="w-64 bg-card/80 backdrop-blur-xl border border-border/50 rounded-lg p-4 overflow-y-auto max-h-[500px]">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-display text-sm font-bold text-primary">Components</h3>
        <button
          onClick={onClear}
          className="px-3 py-1 text-xs font-mono bg-destructive/20 text-destructive rounded hover:bg-destructive/30 transition-colors"
        >
          Clear All
        </button>
      </div>

      <div className="space-y-4">
        {categories.map((category) => (
          <div key={category.name}>
            <h4 className="text-xs font-mono text-muted-foreground mb-2 uppercase tracking-wider">
              {category.name}
            </h4>
            <div className="grid grid-cols-2 gap-2">
              {category.components.map((comp) => (
                <button
                  key={comp.type}
                  onClick={() => onAddComponent(comp.type)}
                  className="flex flex-col items-center gap-1 p-2 rounded-lg bg-muted/50 hover:bg-primary/20 hover:border-primary/50 border border-transparent transition-all duration-200 group"
                >
                  <span className="text-lg group-hover:scale-110 transition-transform">
                    {comp.icon}
                  </span>
                  <span className="text-[10px] font-mono text-muted-foreground group-hover:text-primary">
                    {comp.label}
                  </span>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 pt-4 border-t border-border/50">
        <h4 className="text-xs font-mono text-muted-foreground mb-2">INSTRUCTIONS</h4>
        <ul className="text-[10px] text-muted-foreground space-y-1">
          <li>• Click component to add</li>
          <li>• Drag to move</li>
          <li>• Click ports to connect</li>
          <li>• Double-click switch to toggle</li>
          <li>• Press DEL to remove selected</li>
        </ul>
      </div>
    </div>
  );
};

export default ComponentPalette;

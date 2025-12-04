export interface Point {
  x: number;
  y: number;
}

export interface Connection {
  fromComponent: string;
  fromPort: number;
  toComponent: string;
  toPort: number;
  signal: boolean;
}

export interface Port {
  x: number;
  y: number;
  type: "input" | "output";
  signal: boolean;
}

export interface BaseComponent {
  id: string;
  type: string;
  x: number;
  y: number;
  width: number;
  height: number;
  inputs: Port[];
  outputs: Port[];
  selected: boolean;
}

export interface SwitchComponent extends BaseComponent {
  type: "SWITCH";
  state: boolean;
}

export interface ClockComponent extends BaseComponent {
  type: "CLOCK";
  state: boolean;
  frequency: number;
}

export interface LedComponent extends BaseComponent {
  type: "LED";
}

export interface GateComponent extends BaseComponent {
  type: "AND" | "OR" | "NOT" | "NAND" | "NOR" | "XOR" | "XNOR" | "BUFFER";
}

export interface LatchComponent extends BaseComponent {
  type: "LATCH";
  state: boolean;
}

export interface FullAdderComponent extends BaseComponent {
  type: "FULL_ADDER";
}

export interface AluComponent extends BaseComponent {
  type: "ALU";
  operation: number;
}

export interface RegisterComponent extends BaseComponent {
  type: "REGISTER";
  value: number;
}

export interface EncoderComponent extends BaseComponent {
  type: "ENCODER";
}

export interface DecoderComponent extends BaseComponent {
  type: "DECODER";
}

export interface MuxComponent extends BaseComponent {
  type: "MUX";
}

export interface DemuxComponent extends BaseComponent {
  type: "DEMUX";
}

export type SimulatorComponent =
  | SwitchComponent
  | ClockComponent
  | LedComponent
  | GateComponent
  | LatchComponent
  | FullAdderComponent
  | AluComponent
  | RegisterComponent
  | EncoderComponent
  | DecoderComponent
  | MuxComponent
  | DemuxComponent;

export type ComponentType = SimulatorComponent["type"];

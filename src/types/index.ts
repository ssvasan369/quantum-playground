export interface Complex {
  real: number;
  imag: number;
}

export interface QuantumState {
  amplitudes: Complex[];
  numQubits: number;
}

export interface MeasurementResult {
  state: string;
  probability: number;
  counts?: number;
}

export interface GateMatrix {
  matrix: Complex[][];
  name: string;
}
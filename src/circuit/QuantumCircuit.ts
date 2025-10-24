import { QuantumGates } from "../Gates/QuantumGates";
import { QuantumRegister } from "../register/QuantumRegiter";
import { Complex } from "../types";

export interface CircuitOperation {
  gate: Complex[][];
  targets: number[];
  name: string;
  parameters?: number[];
}

export class QuantumCircuit {
  private numQubits: number;
  private operations: CircuitOperation[] = [];
  private register?: QuantumRegister;

  constructor(numQubits: number) {
    this.numQubits = numQubits;
  }

  // Single-qubit gates
  h(qubit: number): this {
    this.addOperation(QuantumGates.H, [qubit], 'H');
    return this;
  }

  x(qubit: number): this {
    this.addOperation(QuantumGates.X, [qubit], 'X');
    return this;
  }

  y(qubit: number): this {
    this.addOperation(QuantumGates.Y, [qubit], 'Y');
    return this;
  }

  z(qubit: number): this {
    this.addOperation(QuantumGates.Z, [qubit], 'Z');
    return this;
  }

  s(qubit: number): this {
    this.addOperation(QuantumGates.S, [qubit], 'S');
    return this;
  }

  t(qubit: number): this {
    this.addOperation(QuantumGates.T, [qubit], 'T');
    return this;
  }

  sdg(qubit: number): this {
    this.addOperation(QuantumGates.SDG, [qubit], 'SDG');
    return this;
  }

  tdg(qubit: number): this {
    this.addOperation(QuantumGates.TDG, [qubit], 'TDG');
    return this;
  }

  rx(qubit: number, theta: number): this {
    this.addOperation(QuantumGates.RX(theta), [qubit], 'RX', [theta]);
    return this;
  }

  ry(qubit: number, theta: number): this {
    this.addOperation(QuantumGates.RY(theta), [qubit], 'RY', [theta]);
    return this;
  }

  rz(qubit: number, theta: number): this {
    this.addOperation(QuantumGates.RZ(theta), [qubit], 'RZ', [theta]);
    return this;
  }

  phase(qubit: number, theta: number): this {
    this.addOperation(QuantumGates.Phase(theta), [qubit], 'Phase', [theta]);
    return this;
  }

  // Two-qubit gates
  cnot(control: number, target: number): this {
    this.addOperation(QuantumGates.CNOT, [control, target], 'CNOT');
    return this;
  }

  cx(control: number, target: number): this {
    return this.cnot(control, target);
  }

  cz(control: number, target: number): this {
    this.addOperation(QuantumGates.CZ, [control, target], 'CZ');
    return this;
  }

  swap(qubit1: number, qubit2: number): this {
    this.addOperation(QuantumGates.SWAP, [qubit1, qubit2], 'SWAP');
    return this;
  }

  iswap(qubit1: number, qubit2: number): this {
    this.addOperation(QuantumGates.ISWAP, [qubit1, qubit2], 'ISWAP');
    return this;
  }

  // Three-qubit gates
  toffoli(control1: number, control2: number, target: number): this {
    this.addOperation(QuantumGates.TOFFOLI, [control1, control2, target], 'TOFFOLI');
    return this;
  }

  ccx(control1: number, control2: number, target: number): this {
    return this.toffoli(control1, control2, target);
  }

  fredkin(control: number, target1: number, target2: number): this {
    this.addOperation(QuantumGates.FREDKIN, [control, target1, target2], 'FREDKIN');
    return this;
  }

  private addOperation(gate: Complex[][], targets: number[], name: string, parameters?: number[]): void {
    for (const target of targets) {
      if (target < 0 || target >= this.numQubits) {
        throw new Error(`Invalid qubit index: ${target}`);
      }
    }
    this.operations.push({ gate, targets, name, parameters });
  }

  execute(initialState: number = 0): QuantumRegister {
    this.register = new QuantumRegister(this.numQubits, initialState);
    
    for (const op of this.operations) {
      this.register.applyGate(op.gate, op.targets);
    }
    
    return this.register;
  }

  getOperations(): CircuitOperation[] {
    return [...this.operations];
  }

  getNumQubits(): number {
    return this.numQubits;
  }

  clear(): void {
    this.operations = [];
    this.register = undefined;
  }

  toString(): string {
    let result = `Quantum Circuit (${this.numQubits} qubits)\n`;
    result += '='.repeat(40) + '\n';
    
    for (let i = 0; i < this.operations.length; i++) {
      const op = this.operations[i];
      result += `${i + 1}. ${op.name}`;
      if (op.parameters && op.parameters.length > 0) {
        result += `(${op.parameters.map(p => p.toFixed(4)).join(', ')})`;
      }
      result += ` on qubit(s): ${op.targets.join(', ')}\n`;
    }
    
    return result;
  }
}

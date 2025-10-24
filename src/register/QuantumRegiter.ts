import { MatrixOps } from "../matrix_operations/MatrixOps";
import { QuantumGates } from "../Gates/QuantumGates";
import { Complex, MeasurementResult, QuantumState } from "../types";
import { ComplexMath } from "../utilities";

export class QuantumRegister {
  private state: QuantumState;
  private measurementHistory: MeasurementResult[] = [];

  constructor(numQubits: number, initialState?: number) {
    this.state = this.initializeState(numQubits, initialState);
  }

  private initializeState(numQubits: number, initialState: number = 0): QuantumState {
    const size = Math.pow(2, numQubits);
    const amplitudes: Complex[] = Array(size).fill(ComplexMath.create(0));
    amplitudes[initialState] = ComplexMath.create(1);
    return { amplitudes, numQubits };
  }

  getNumQubits(): number {
    return this.state.numQubits;
  }

  getState(): QuantumState {
    return { ...this.state, amplitudes: [...this.state.amplitudes] };
  }

  getAmplitudes(): Complex[] {
    return [...this.state.amplitudes];
  }

  setState(amplitudes: Complex[]): void {
    if (amplitudes.length !== Math.pow(2, this.state.numQubits)) {
      throw new Error('Invalid state vector size');
    }
    this.state.amplitudes = [...amplitudes];
    this.normalize();
  }

  private normalize(): void {
    let norm = 0;
    for (const amp of this.state.amplitudes) {
      norm += ComplexMath.magnitudeSquared(amp);
    }
    norm = Math.sqrt(norm);
    
    if (norm > 0) {
      this.state.amplitudes = this.state.amplitudes.map(amp => 
        ComplexMath.scale(amp, 1 / norm)
      );
    }
  }

  applyGate(gate: Complex[][], targetQubits: number[]): void {
    const fullGate = this.expandGate(gate, targetQubits);
    this.state.amplitudes = MatrixOps.applyToVector(fullGate, this.state.amplitudes);
  }

  private expandGate(gate: Complex[][], targetQubits: number[]): Complex[][] {
    const n = this.state.numQubits;
    const gateSize = Math.log2(gate.length);
    
    if (targetQubits.length !== gateSize) {
      throw new Error('Gate size does not match target qubits');
    }

    let result = MatrixOps.identity(1);
    
    for (let i = 0; i < n; i++) {
      const idx = targetQubits.indexOf(i);
      if (idx !== -1) {
        if (targetQubits.length === 1) {
          result = MatrixOps.tensorProduct(result, gate);
        } else {
          // For multi-qubit gates, more complex logic needed
          result = MatrixOps.tensorProduct(result, QuantumGates.I);
        }
      } else {
        result = MatrixOps.tensorProduct(result, QuantumGates.I);
      }
    }

    // For proper controlled gates, we need permutation logic
    if (targetQubits.length > 1) {
      return this.permuteGate(gate, targetQubits);
    }
    
    return result;
  }

  private permuteGate(gate: Complex[][], targetQubits: number[]): Complex[][] {
    const n = this.state.numQubits;
    const size = Math.pow(2, n);
    const result = MatrixOps.identity(size);
    
    const gateSize = gate.length;
    const numTargets = targetQubits.length;
    
    for (let i = 0; i < size; i++) {
      for (let j = 0; j < size; j++) {
        let iTarget = 0, jTarget = 0;
        let iOther = i, jOther = j;
        
        for (let k = 0; k < numTargets; k++) {
          const qubit = targetQubits[k];
          const mask = 1 << qubit;
          
          if (i & mask) iTarget |= (1 << k);
          if (j & mask) jTarget |= (1 << k);
          
          iOther &= ~mask;
          jOther &= ~mask;
        }
        
        if (iOther === jOther && iTarget < gateSize && jTarget < gateSize) {
          result[i][j] = gate[iTarget][jTarget];
        } else if (i === j) {
          result[i][j] = ComplexMath.create(1);
        } else {
          result[i][j] = ComplexMath.create(0);
        }
      }
    }
    
    return result;
  }

  measure(qubit?: number): MeasurementResult {
    if (qubit !== undefined) {
      return this.measureSingleQubit(qubit);
    }
    return this.measureAll();
  }

  private measureSingleQubit(qubit: number): MeasurementResult {
    if (qubit < 0 || qubit >= this.state.numQubits) {
      throw new Error('Invalid qubit index');
    }

    const mask = 1 << qubit;
    let prob0 = 0;

    for (let i = 0; i < this.state.amplitudes.length; i++) {
      if ((i & mask) === 0) {
        prob0 += ComplexMath.magnitudeSquared(this.state.amplitudes[i]);
      }
    }

    const result = Math.random() < prob0 ? 0 : 1;
    
    // Collapse the state
    const newAmplitudes = [...this.state.amplitudes];
    const norm = Math.sqrt(result === 0 ? prob0 : 1 - prob0);
    
    for (let i = 0; i < newAmplitudes.length; i++) {
      if (((i & mask) === 0 && result === 1) || ((i & mask) !== 0 && result === 0)) {
        newAmplitudes[i] = ComplexMath.create(0);
      } else {
        newAmplitudes[i] = ComplexMath.scale(newAmplitudes[i], 1 / norm);
      }
    }
    
    this.state.amplitudes = newAmplitudes;

    const measurementResult: MeasurementResult = {
      state: result.toString(),
      probability: result === 0 ? prob0 : 1 - prob0
    };

    this.measurementHistory.push(measurementResult);
    return measurementResult;
  }

  private measureAll(): MeasurementResult {
    const probabilities: number[] = this.state.amplitudes.map(amp =>
      ComplexMath.magnitudeSquared(amp)
    );

    const rand = Math.random();
    let cumulative = 0;
    let resultIndex = 0;

    for (let i = 0; i < probabilities.length; i++) {
      cumulative += probabilities[i];
      if (rand < cumulative) {
        resultIndex = i;
        break;
      }
    }

    const state = resultIndex.toString(2).padStart(this.state.numQubits, '0');
    const probability = probabilities[resultIndex];

    // Collapse to measured state
    this.state.amplitudes = this.state.amplitudes.map((_, i) =>
      i === resultIndex ? ComplexMath.create(1) : ComplexMath.create(0)
    );

    const measurementResult: MeasurementResult = { state, probability };
    this.measurementHistory.push(measurementResult);
    return measurementResult;
  }

  getProbabilities(): Map<string, number> {
    const probs = new Map<string, number>();
    for (let i = 0; i < this.state.amplitudes.length; i++) {
      const state = i.toString(2).padStart(this.state.numQubits, '0');
      const prob = ComplexMath.magnitudeSquared(this.state.amplitudes[i]);
      if (prob > 1e-10) {
        probs.set(state, prob);
      }
    }
    return probs;
  }

  getMeasurementHistory(): MeasurementResult[] {
    return [...this.measurementHistory];
  }

  reset(initialState: number = 0): void {
    this.state = this.initializeState(this.state.numQubits, initialState);
    this.measurementHistory = [];
  }
}
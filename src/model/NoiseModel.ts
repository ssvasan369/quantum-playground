import { Complex } from "../types";
import { ComplexMath } from "../utilities";

export class NoiseModel {
  static depolarizingChannel(state: Complex[], probability: number): Complex[] {
    const noisy = [...state];
    
    if (Math.random() < probability) {
      const choice = Math.random();
      const n = Math.log2(state.length);
      const qubit = Math.floor(Math.random() * n);
      
      // Apply random Pauli operator
      if (choice < 0.33) {
        // X error
        this.applyPauliX(noisy, qubit, n);
      } else if (choice < 0.66) {
        // Z error
        this.applyPauliZ(noisy, qubit, n);
      } else {
        // Y error
        this.applyPauliY(noisy, qubit, n);
      }
    }
    
    return noisy;
  }

  static amplitudeDamping(state: Complex[], gamma: number): Complex[] {
    const noisy = [...state];
    
    for (let i = 0; i < state.length; i++) {
      if (i & 1) { // If qubit is in |1> state
        const decay = Math.sqrt(gamma);
        noisy[i] = ComplexMath.scale(state[i], Math.sqrt(1 - gamma));
        noisy[i - 1] = ComplexMath.add(
          noisy[i - 1],
          ComplexMath.scale(state[i], decay)
        );
      }
    }
    
    return noisy;
  }

  static phaseDamping(state: Complex[], lambda: number): Complex[] {
    const noisy = [...state];
    
    for (let i = 0; i < state.length; i++) {
      const factor = Math.exp(-lambda / 2);
      noisy[i] = ComplexMath.scale(state[i], factor);
    }
    
    return noisy;
  }

  private static applyPauliX(state: Complex[], qubit: number, numQubits: number): void {
    const mask = 1 << qubit;
    for (let i = 0; i < state.length; i += 2) {
      if ((i & mask) === 0) {
        const temp = state[i];
        state[i] = state[i | mask];
        state[i | mask] = temp;
      }
    }
  }

  private static applyPauliZ(state: Complex[], qubit: number, numQubits: number): void {
    const mask = 1 << qubit;
    for (let i = 0; i < state.length; i++) {
      if (i & mask) {
        state[i] = ComplexMath.scale(state[i], -1);
      }
    }
  }

  private static applyPauliY(state: Complex[], qubit: number, numQubits: number): void {
    this.applyPauliX(state, qubit, numQubits);
    this.applyPauliZ(state, qubit, numQubits);
    for (let i = 0; i < state.length; i++) {
      state[i] = ComplexMath.multiply(state[i], ComplexMath.create(0, 1));
    }
  }
}
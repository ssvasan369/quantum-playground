import { QuantumCircuit } from "../circuit/QuantumCircuit";
import { Complex } from "../types";
import { ComplexMath } from "../utilities";

export class QuantumVisualizer {
  static printState(state: Complex[], precision: number = 4): string {
    let output = 'Quantum State:\n';
    const numQubits = Math.log2(state.length);
    
    for (let i = 0; i < state.length; i++) {
      const basisState = i.toString(2).padStart(numQubits, '0');
      const amplitude = ComplexMath.toString(state[i], precision);
      const probability = ComplexMath.magnitudeSquared(state[i]);
      
      if (probability > 1e-10) {
        output += `|${basisState}⟩: ${amplitude} (P: ${probability.toFixed(precision)})\n`;
      }
    }
    
    return output;
  }

  static printProbabilities(probs: Map<string, number>, precision: number = 4): string {
    let output = 'Measurement Probabilities:\n';
    
    const sorted = Array.from(probs.entries()).sort((a, b) => b[1] - a[1]);
    
    for (const [state, prob] of sorted) {
      const percentage = (prob * 100).toFixed(precision);
      const bar = '█'.repeat(Math.floor(prob * 50));
      output += `|${state}⟩: ${percentage}% ${bar}\n`;
    }
    
    return output;
  }

  static printCircuit(circuit: QuantumCircuit): string {
    return circuit.toString();
  }

  static blochSphere(state: Complex[]): { x: number; y: number; z: number } {
    if (state.length !== 2) {
      throw new Error('Bloch sphere representation only for single qubit');
    }
    
    const alpha = state[0];
    const beta = state[1];
    
    const theta = 2 * Math.acos(ComplexMath.magnitude(alpha));
    const phi = ComplexMath.phase(beta) - ComplexMath.phase(alpha);
    
    return {
      x: Math.sin(theta) * Math.cos(phi),
      y: Math.sin(theta) * Math.sin(phi),
      z: Math.cos(theta)
    };
  }
}
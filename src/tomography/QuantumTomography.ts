import { Complex } from "../types";
import { ComplexMath } from "../utilities";

export class QuantumTomography {
  static stateFidelity(state1: Complex[], state2: Complex[]): number {
    if (state1.length !== state2.length) {
      throw new Error('States must have the same dimension');
    }
    
    let innerProduct = ComplexMath.create(0);
    for (let i = 0; i < state1.length; i++) {
      innerProduct = ComplexMath.add(
        innerProduct,
        ComplexMath.multiply(ComplexMath.conjugate(state1[i]), state2[i])
      );
    }
    
    return ComplexMath.magnitudeSquared(innerProduct);
  }

  static traceDistance(state1: Complex[], state2: Complex[]): number {
    let sum = 0;
    for (let i = 0; i < state1.length; i++) {
      const diff = ComplexMath.subtract(state1[i], state2[i]);
      sum += ComplexMath.magnitudeSquared(diff);
    }
    return Math.sqrt(sum) / Math.sqrt(2);
  }

  static entropy(state: Complex[]): number {
    let entropy = 0;
    for (const amplitude of state) {
      const prob = ComplexMath.magnitudeSquared(amplitude);
      if (prob > 1e-10) {
        entropy -= prob * Math.log2(prob);
      }
    }
    return entropy;
  }

  static purity(state: Complex[]): number {
    let sum = 0;
    for (const amplitude of state) {
      sum += Math.pow(ComplexMath.magnitudeSquared(amplitude), 2);
    }
    return sum;
  }

  static concurrence(state: Complex[]): number {
    if (state.length !== 4) {
      throw new Error('Concurrence only defined for 2-qubit states');
    }
    
    // Simplified concurrence calculation for pure states
    const a00 = state[0];
    const a01 = state[1];
    const a10 = state[2];
    const a11 = state[3];
    
    const term1 = ComplexMath.multiply(a00, a11);
    const term2 = ComplexMath.multiply(a01, a10);
    const diff = ComplexMath.subtract(term1, term2);
    
    return 2 * Math.abs(ComplexMath.magnitude(diff));
  }
}
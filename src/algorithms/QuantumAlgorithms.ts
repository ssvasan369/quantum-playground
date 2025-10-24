import { QuantumCircuit } from "../circuit/QuantumCircuit";
import { QuantumRegister } from "../register/QuantumRegiter";
import { MeasurementResult, QuantumState } from "../types";

export class QuantumAlgorithms {
  static bellState(): QuantumCircuit {
    const circuit = new QuantumCircuit(2);
    circuit.h(0).cnot(0, 1);
    return circuit;
  }

  static ghzState(numQubits: number): QuantumCircuit {
    const circuit = new QuantumCircuit(numQubits);
    circuit.h(0);
    for (let i = 1; i < numQubits; i++) {
      circuit.cnot(0, i);
    }
    return circuit;
  }

  static quantumFourierTransform(numQubits: number): QuantumCircuit {
    const circuit = new QuantumCircuit(numQubits);
    
    for (let i = 0; i < numQubits; i++) {
      circuit.h(i);
      for (let j = i + 1; j < numQubits; j++) {
        const angle = Math.PI / Math.pow(2, j - i);
        circuit.phase(j, angle);
        circuit.cnot(j, i);
        circuit.phase(j, -angle);
        circuit.cnot(j, i);
      }
    }
    
    // Swap qubits
    for (let i = 0; i < Math.floor(numQubits / 2); i++) {
      circuit.swap(i, numQubits - 1 - i);
    }
    
    return circuit;
  }

  static inverseQFT(numQubits: number): QuantumCircuit {
    const circuit = new QuantumCircuit(numQubits);
    
    // Reverse swaps
    for (let i = Math.floor(numQubits / 2) - 1; i >= 0; i--) {
      circuit.swap(i, numQubits - 1 - i);
    }
    
    // Reverse QFT operations
    for (let i = numQubits - 1; i >= 0; i--) {
      for (let j = numQubits - 1; j > i; j--) {
        const angle = -Math.PI / Math.pow(2, j - i);
        circuit.cnot(j, i);
        circuit.phase(j, -angle);
        circuit.cnot(j, i);
        circuit.phase(j, angle);
      }
      circuit.h(i);
    }
    
    return circuit;
  }

  static deutschJozsa(oracle: (circuit: QuantumCircuit) => void, numQubits: number): QuantumCircuit {
    const circuit = new QuantumCircuit(numQubits + 1);
    
    // Initialize
    circuit.x(numQubits); // Ancilla qubit
    for (let i = 0; i <= numQubits; i++) {
      circuit.h(i);
    }
    
    // Apply oracle
    oracle(circuit);
    
    // Apply Hadamard to input qubits
    for (let i = 0; i < numQubits; i++) {
      circuit.h(i);
    }
    
    return circuit;
  }

  static groverSearch(markedStates: number[], numQubits: number): QuantumCircuit {
    const circuit = new QuantumCircuit(numQubits);
    const iterations = Math.floor(Math.PI / 4 * Math.sqrt(Math.pow(2, numQubits)));
    
    // Initialize superposition
    for (let i = 0; i < numQubits; i++) {
      circuit.h(i);
    }
    
    // Grover iterations
    for (let iter = 0; iter < iterations; iter++) {
      // Oracle (mark states)
      for (const state of markedStates) {
        this.applyOracleForState(circuit, state, numQubits);
      }
      
      // Diffusion operator
      this.applyDiffusion(circuit, numQubits);
    }
    
    return circuit;
  }

  private static applyOracleForState(circuit: QuantumCircuit, state: number, numQubits: number): void {
    // Flip qubits that should be 0
    for (let i = 0; i < numQubits; i++) {
      if ((state & (1 << i)) === 0) {
        circuit.x(i);
      }
    }
    
    // Multi-controlled Z
    if (numQubits === 2) {
      circuit.cz(0, 1);
    } else if (numQubits >= 3) {
      circuit.h(numQubits - 1);
      this.multiControlledX(circuit, numQubits);
      circuit.h(numQubits - 1);
    }
    
    // Flip back
    for (let i = 0; i < numQubits; i++) {
      if ((state & (1 << i)) === 0) {
        circuit.x(i);
      }
    }
  }

  private static multiControlledX(circuit: QuantumCircuit, numQubits: number): void {
    if (numQubits === 3) {
      circuit.toffoli(0, 1, 2);
    } else {
      // Simplified multi-controlled NOT for demonstration
      for (let i = 0; i < numQubits - 1; i++) {
        circuit.cnot(i, numQubits - 1);
      }
    }
  }

  private static applyDiffusion(circuit: QuantumCircuit, numQubits: number): void {
    // Apply H gates
    for (let i = 0; i < numQubits; i++) {
      circuit.h(i);
    }
    
    // Apply X gates
    for (let i = 0; i < numQubits; i++) {
      circuit.x(i);
    }
    
    // Multi-controlled Z
    if (numQubits === 2) {
      circuit.cz(0, 1);
    } else if (numQubits >= 3) {
      circuit.h(numQubits - 1);
      this.multiControlledX(circuit, numQubits);
      circuit.h(numQubits - 1);
    }
    
    // Apply X gates
    for (let i = 0; i < numQubits; i++) {
      circuit.x(i);
    }
    
    // Apply H gates
    for (let i = 0; i < numQubits; i++) {
      circuit.h(i);
    }
  }

  static quantumTeleportation(): QuantumCircuit {
    const circuit = new QuantumCircuit(3);
    
    // Create Bell pair between qubits 1 and 2
    circuit.h(1);
    circuit.cnot(1, 2);
    
    // Alice's operations
    circuit.cnot(0, 1);
    circuit.h(0);
    
    // Bob's corrections (conditional on measurement)
    circuit.cnot(1, 2);
    circuit.cz(0, 2);
    
    return circuit;
  }

  static superdenseCoding(): QuantumCircuit {
    const circuit = new QuantumCircuit(2);
    
    // Create Bell pair
    circuit.h(0);
    circuit.cnot(0, 1);
    
    // Alice encodes (example: encode 11)
    circuit.z(0);
    circuit.x(0);
    
    // Bob decodes
    circuit.cnot(0, 1);
    circuit.h(0);
    
    return circuit;
  }
}

// ============================================================================
// QUANTUM SIMULATOR
// ============================================================================

export interface SimulationResult {
  circuit: QuantumCircuit;
  finalState: QuantumState;
  measurements: MeasurementResult[];
  probabilities: Map<string, number>;
  executionTime: number;
}

export class QuantumSimulator {
  private shots: number;
  private seed?: number;

  constructor(shots: number = 1000, seed?: number) {
    this.shots = shots;
    this.seed = seed;
  }

  simulate(circuit: QuantumCircuit, initialState: number = 0): SimulationResult {
    const startTime = Date.now();
    
    const register = circuit.execute(initialState);
    const finalState = register.getState();
    const probabilities = register.getProbabilities();
    
    // Run multiple shots
    const measurements: MeasurementResult[] = [];
    const counts = new Map<string, number>();
    
    for (let i = 0; i < this.shots; i++) {
      const tempRegister = new QuantumRegister(register.getNumQubits(), initialState);
      
      // Re-execute circuit
      for (const op of circuit.getOperations()) {
        tempRegister.applyGate(op.gate, op.targets);
      }
      
      const measurement = tempRegister.measure();
      
      counts.set(measurement.state, (counts.get(measurement.state) || 0) + 1);
    }
    
    // Convert counts to probabilities
    for (const [state, count] of counts) {
      const idx = measurements.findIndex(m => m.state === state);
      if (idx >= 0) {
        measurements[idx].counts = count;
      } else {
        measurements.push({
          state,
          probability: count / this.shots,
          counts: count
        });
      }
    }
    
    const executionTime = Date.now() - startTime;
    
    return {
      circuit,
      finalState,
      measurements,
      probabilities,
      executionTime
    };
  }

  runMultipleExperiments(circuit: QuantumCircuit, experiments: number, initialState: number = 0): Map<string, number[]> {
    const results = new Map<string, number[]>();
    
    for (let i = 0; i < experiments; i++) {
      const result = this.simulate(circuit, initialState);
      
      for (const measurement of result.measurements) {
        if (!results.has(measurement.state)) {
          results.set(measurement.state, []);
        }
        results.get(measurement.state)!.push(measurement.counts || 0);
      }
    }
    
    return results;
  }

  setShots(shots: number): void {
    this.shots = shots;
  }

  getShots(): number {
    return this.shots;
  }
}
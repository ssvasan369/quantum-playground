import { QuantumCircuit } from "../circuit/QuantumCircuit";
import { QuantumRegister } from "../register/QuantumRegiter";
import { MeasurementResult, QuantumState } from "../types";

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
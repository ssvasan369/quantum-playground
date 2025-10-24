import { QuantumAlgorithms } from "../algorithms/QuantumAlgorithms";
import { QuantumCircuit } from "../circuit/QuantumCircuit";
import { QuantumSimulator } from "../simulator/QuantumSimulator";
import { QuantumVisualizer } from "../visualizer/QuantumVisualizer";

export class QuantumExamples {
  static bellStateExample(): void {
    console.log('=== Bell State Example ===');
    const circuit = QuantumAlgorithms.bellState();
    console.log(circuit.toString());
    
    const register = circuit.execute();
    console.log(QuantumVisualizer.printState(register.getAmplitudes()));
    console.log(QuantumVisualizer.printProbabilities(register.getProbabilities()));
  }

  static groverExample(): void {
    console.log('=== Grover Search Example ===');
    const circuit = QuantumAlgorithms.groverSearch([3], 2);
    console.log(circuit.toString());
    
    const simulator = new QuantumSimulator(1000);
    const result = simulator.simulate(circuit);
    console.log(QuantumVisualizer.printProbabilities(result.probabilities));
  }

  static qftExample(): void {
    console.log('=== Quantum Fourier Transform Example ===');
    const circuit = QuantumAlgorithms.quantumFourierTransform(3);
    console.log(circuit.toString());
    
    const register = circuit.execute();
    console.log(QuantumVisualizer.printState(register.getAmplitudes()));
  }

  static customCircuitExample(): void {
    console.log('=== Custom Circuit Example ===');
    const circuit = new QuantumCircuit(3);
    circuit
      .h(0)
      .cnot(0, 1)
      .cnot(1, 2)
      .rz(2, Math.PI / 4)
      .h(2);
    
    console.log(circuit.toString());
    
    const simulator = new QuantumSimulator(1000);
    const result = simulator.simulate(circuit);
    
    console.log(`Execution time: ${result.executionTime}ms`);
    console.log(QuantumVisualizer.printProbabilities(result.probabilities));
  }
}
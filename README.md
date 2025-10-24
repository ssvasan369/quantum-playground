# Quantum Simulation Library

A comprehensive, professional quantum computing simulation library built with **Node.js** and **TypeScript**.

---

## 📦 Installation

```bash
npm install
npm run build
```

---

## 🚀 Features

* **Complete Quantum Gates Library**: Single, two, and three-qubit gates
* **Quantum Circuit Builder**: Fluent API for building quantum circuits
* **State Vector Simulation**: Full state vector simulation with configurable shots
* **Quantum Algorithms**: Pre-built implementations of famous quantum algorithms
* **Noise Models**: Realistic quantum noise simulation
* **State Tomography**: Fidelity, entropy, purity, and entanglement measures
* **Visualization Tools**: State visualization and probability distribution tools
* **Type Safety**: Full TypeScript support with comprehensive type definitions

---

## 📚 Core Modules

### 1. Complex Number Operations (`ComplexMath`)

```ts
import { ComplexMath } from './quantum-simulator';

const c1 = ComplexMath.create(1, 2); // 1 + 2i
const c2 = ComplexMath.create(3, 4); // 3 + 4i

const sum = ComplexMath.add(c1, c2);
const product = ComplexMath.multiply(c1, c2);
const magnitude = ComplexMath.magnitude(c1);
const phase = ComplexMath.phase(c1);
```

### 2. Quantum Gates (`QuantumGates`)

**Available Gates:**

* Pauli: X, Y, Z
* Hadamard: H
* Phase: S, T, SDG, TDG, Phase(θ)
* Rotation: RX(θ), RY(θ), RZ(θ)
* Two-Qubit: CNOT, CZ, SWAP, ISWAP
* Three-Qubit: TOFFOLI (CCX), FREDKIN (CSWAP)

### 3. Quantum Register (`QuantumRegister`)

```ts
import { QuantumRegister, QuantumGates } from './quantum-simulator';

const register = new QuantumRegister(3); // 3 qubits
register.applyGate(QuantumGates.H, [0]);
register.applyGate(QuantumGates.CNOT, [0, 1]);

const result = register.measure();
console.log(result.state, result.probability);

const probs = register.getProbabilities();
```

### 4. Quantum Circuit (`QuantumCircuit`)

```ts
import { QuantumCircuit } from './quantum-simulator';

const circuit = new QuantumCircuit(3);
circuit.h(0).cnot(0, 1).rx(2, Math.PI / 4).toffoli(0, 1, 2);

const register = circuit.execute();
console.log(register.getAmplitudes());
```

### 5. Quantum Algorithms (`QuantumAlgorithms`)

* **Bell State**: `QuantumAlgorithms.bellState()`
* **GHZ State**: `QuantumAlgorithms.ghzState(4)`
* **Quantum Fourier Transform**: `QuantumAlgorithms.quantumFourierTransform(3)`
* **Grover's Search**: `QuantumAlgorithms.groverSearch([3], 2)`
* **Quantum Teleportation**: `QuantumAlgorithms.quantumTeleportation()`
* **Deutsch-Jozsa Algorithm**: Custom oracle support

### 6. Quantum Simulator (`QuantumSimulator`)

```ts
import { QuantumSimulator, QuantumCircuit } from './quantum-simulator';

const circuit = new QuantumCircuit(3).h(0).cnot(0, 1).cnot(1, 2);

const simulator = new QuantumSimulator(1000);
const result = simulator.simulate(circuit);

console.log('Final state:', result.finalState);
console.log('Measurements:', result.measurements);
console.log('Execution time:', result.executionTime, 'ms');
```

### 7. Quantum Tomography (`QuantumTomography`)

```ts
import { QuantumTomography } from './quantum-simulator';

const fidelity = QuantumTomography.stateFidelity(state1, state2);
const entropy = QuantumTomography.entropy(state1);
const purity = QuantumTomography.purity(state1);
const concurrence = QuantumTomography.concurrence(state1);
```

### 8. Noise Models (`NoiseModel`)

```ts
import { NoiseModel } from './quantum-simulator';

const noisyState = NoiseModel.depolarizingChannel(state, 0.1);
const dampedState = NoiseModel.amplitudeDamping(state, 0.05);
const phaseDamped = NoiseModel.phaseDamping(state, 0.02);
```

### 9. Visualization (`QuantumVisualizer`)

```ts
import { QuantumVisualizer } from './quantum-simulator';

console.log(QuantumVisualizer.printState(register.getAmplitudes()));
console.log(QuantumVisualizer.printProbabilities(register.getProbabilities()));
console.log(QuantumVisualizer.printCircuit(circuit));

const bloch = QuantumVisualizer.blochSphere(singleQubitState);
console.log('Bloch coordinates:', bloch.x, bloch.y, bloch.z);
```

---

## 💡 Complete Examples

### Bell State

```ts
const circuit = new QuantumCircuit(2).h(0).cnot(0, 1);
const register = circuit.execute();
console.log(QuantumVisualizer.printState(register.getAmplitudes()));
```

### Quantum Fourier Transform

```ts
const circuit = QuantumAlgorithms.quantumFourierTransform(3);
const register = circuit.execute(5);
console.log(QuantumVisualizer.printState(register.getAmplitudes()));
```

### Grover's Algorithm

```ts
const circuit = QuantumAlgorithms.groverSearch([3], 2);
const simulator = new QuantumSimulator(1000);
const result = simulator.simulate(circuit);
console.log(QuantumVisualizer.printProbabilities(result.probabilities));
```

---

## 💜 Advanced Features

* **Custom Gate Creation**
* **Multi-Shot Analysis**
* **Noise Simulation**
* **State Fidelity Analysis**

---

## 🧨 Testing

```ts
import { QuantumCircuit, QuantumAlgorithms, QuantumSimulator } from './quantum-simulator';

const circuit = new QuantumCircuit(1).h(0);
const amplitudes = circuit.execute().getAmplitudes();
console.assert(Math.abs(amplitudes[0].real - 1/Math.sqrt(2)) < 1e-10, 'Hadamard test failed');
```

---

## 📋 API Reference

* `Complex`, `QuantumState`, `MeasurementResult`, `SimulationResult`, `CircuitOperation`

---

## 🎯 Performance Considerations

* State vector grows exponentially: `2^n` for `n` qubits
* Practical limit: ~20–25 qubits on standard hardware
* Tips: reuse registers, clear circuits, and adjust shots

---


## 🧽 Contributing

* Add new quantum algorithms (Shor, VQE, QAOA)
* Optimized gate decompositions
* Advanced noise models
* GPU acceleration and circuit optimization
* Visualization improvements

---

## 📜 License

MIT License

---

**Built with ❤️ for quantum computing education and research**

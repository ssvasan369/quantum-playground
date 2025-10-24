import { Complex } from "../types";
import { ComplexMath } from "../utilities";

export class QuantumGates {
  // Single-qubit gates
  static readonly I: Complex[][] = [
    [ComplexMath.create(1), ComplexMath.create(0)],
    [ComplexMath.create(0), ComplexMath.create(1)]
  ];

  static readonly X: Complex[][] = [
    [ComplexMath.create(0), ComplexMath.create(1)],
    [ComplexMath.create(1), ComplexMath.create(0)]
  ];

  static readonly Y: Complex[][] = [
    [ComplexMath.create(0), ComplexMath.create(0, -1)],
    [ComplexMath.create(0, 1), ComplexMath.create(0)]
  ];

  static readonly Z: Complex[][] = [
    [ComplexMath.create(1), ComplexMath.create(0)],
    [ComplexMath.create(0), ComplexMath.create(-1)]
  ];

  static readonly H: Complex[][] = [
    [ComplexMath.create(1/Math.sqrt(2)), ComplexMath.create(1/Math.sqrt(2))],
    [ComplexMath.create(1/Math.sqrt(2)), ComplexMath.create(-1/Math.sqrt(2))]
  ];

  static readonly S: Complex[][] = [
    [ComplexMath.create(1), ComplexMath.create(0)],
    [ComplexMath.create(0), ComplexMath.create(0, 1)]
  ];

  static readonly T: Complex[][] = [
    [ComplexMath.create(1), ComplexMath.create(0)],
    [ComplexMath.create(0), ComplexMath.fromPolar(1, Math.PI/4)]
  ];

  static readonly SDG: Complex[][] = [
    [ComplexMath.create(1), ComplexMath.create(0)],
    [ComplexMath.create(0), ComplexMath.create(0, -1)]
  ];

  static readonly TDG: Complex[][] = [
    [ComplexMath.create(1), ComplexMath.create(0)],
    [ComplexMath.create(0), ComplexMath.fromPolar(1, -Math.PI/4)]
  ];

  static RX(theta: number): Complex[][] {
    const cos = Math.cos(theta / 2);
    const sin = Math.sin(theta / 2);
    return [
      [ComplexMath.create(cos), ComplexMath.create(0, -sin)],
      [ComplexMath.create(0, -sin), ComplexMath.create(cos)]
    ];
  }

  static RY(theta: number): Complex[][] {
    const cos = Math.cos(theta / 2);
    const sin = Math.sin(theta / 2);
    return [
      [ComplexMath.create(cos), ComplexMath.create(-sin)],
      [ComplexMath.create(sin), ComplexMath.create(cos)]
    ];
  }

  static RZ(theta: number): Complex[][] {
    return [
      [ComplexMath.fromPolar(1, -theta/2), ComplexMath.create(0)],
      [ComplexMath.create(0), ComplexMath.fromPolar(1, theta/2)]
    ];
  }

  static Phase(theta: number): Complex[][] {
    return [
      [ComplexMath.create(1), ComplexMath.create(0)],
      [ComplexMath.create(0), ComplexMath.fromPolar(1, theta)]
    ];
  }

  // Two-qubit gates
  static readonly CNOT: Complex[][] = [
    [ComplexMath.create(1), ComplexMath.create(0), ComplexMath.create(0), ComplexMath.create(0)],
    [ComplexMath.create(0), ComplexMath.create(1), ComplexMath.create(0), ComplexMath.create(0)],
    [ComplexMath.create(0), ComplexMath.create(0), ComplexMath.create(0), ComplexMath.create(1)],
    [ComplexMath.create(0), ComplexMath.create(0), ComplexMath.create(1), ComplexMath.create(0)]
  ];

  static readonly CZ: Complex[][] = [
    [ComplexMath.create(1), ComplexMath.create(0), ComplexMath.create(0), ComplexMath.create(0)],
    [ComplexMath.create(0), ComplexMath.create(1), ComplexMath.create(0), ComplexMath.create(0)],
    [ComplexMath.create(0), ComplexMath.create(0), ComplexMath.create(1), ComplexMath.create(0)],
    [ComplexMath.create(0), ComplexMath.create(0), ComplexMath.create(0), ComplexMath.create(-1)]
  ];

  static readonly SWAP: Complex[][] = [
    [ComplexMath.create(1), ComplexMath.create(0), ComplexMath.create(0), ComplexMath.create(0)],
    [ComplexMath.create(0), ComplexMath.create(0), ComplexMath.create(1), ComplexMath.create(0)],
    [ComplexMath.create(0), ComplexMath.create(1), ComplexMath.create(0), ComplexMath.create(0)],
    [ComplexMath.create(0), ComplexMath.create(0), ComplexMath.create(0), ComplexMath.create(1)]
  ];

  static readonly ISWAP: Complex[][] = [
    [ComplexMath.create(1), ComplexMath.create(0), ComplexMath.create(0), ComplexMath.create(0)],
    [ComplexMath.create(0), ComplexMath.create(0), ComplexMath.create(0, 1), ComplexMath.create(0)],
    [ComplexMath.create(0), ComplexMath.create(0, 1), ComplexMath.create(0), ComplexMath.create(0)],
    [ComplexMath.create(0), ComplexMath.create(0), ComplexMath.create(0), ComplexMath.create(1)]
  ];

  // Three-qubit gates
  static readonly TOFFOLI: Complex[][] = (() => {
    const matrix: Complex[][] = Array(8).fill(0).map(() =>
      Array(8).fill(ComplexMath.create(0))
    );
    for (let i = 0; i < 6; i++) {
      matrix[i][i] = ComplexMath.create(1);
    }
    matrix[6][7] = ComplexMath.create(1);
    matrix[7][6] = ComplexMath.create(1);
    return matrix;
  })();

  static readonly FREDKIN: Complex[][] = (() => {
    const matrix: Complex[][] = Array(8).fill(0).map(() =>
      Array(8).fill(ComplexMath.create(0))
    );
    for (let i = 0; i < 5; i++) {
      matrix[i][i] = ComplexMath.create(1);
    }
    matrix[5][6] = ComplexMath.create(1);
    matrix[6][5] = ComplexMath.create(1);
    matrix[7][7] = ComplexMath.create(1);
    return matrix;
  })();
}

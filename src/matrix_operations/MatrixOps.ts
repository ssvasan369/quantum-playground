// ============================================================================
// MATRIX OPERATIONS
// ============================================================================

import { Complex } from "../types";
import { ComplexMath } from "../utilities";

export class MatrixOps {
  static multiply(a: Complex[][], b: Complex[][]): Complex[][] {
    const rows = a.length;
    const cols = b[0].length;
    const inner = b.length;
    const result: Complex[][] = Array(rows).fill(0).map(() => 
      Array(cols).fill(ComplexMath.create(0))
    );

    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        let sum = ComplexMath.create(0);
        for (let k = 0; k < inner; k++) {
          sum = ComplexMath.add(sum, ComplexMath.multiply(a[i][k], b[k][j]));
        }
        result[i][j] = sum;
      }
    }
    return result;
  }

  static tensorProduct(a: Complex[][], b: Complex[][]): Complex[][] {
    const rowsA = a.length;
    const colsA = a[0].length;
    const rowsB = b.length;
    const colsB = b[0].length;
    
    const result: Complex[][] = Array(rowsA * rowsB).fill(0).map(() =>
      Array(colsA * colsB).fill(ComplexMath.create(0))
    );

    for (let i = 0; i < rowsA; i++) {
      for (let j = 0; j < colsA; j++) {
        for (let k = 0; k < rowsB; k++) {
          for (let l = 0; l < colsB; l++) {
            result[i * rowsB + k][j * colsB + l] = 
              ComplexMath.multiply(a[i][j], b[k][l]);
          }
        }
      }
    }
    return result;
  }

  static identity(size: number): Complex[][] {
    const matrix: Complex[][] = Array(size).fill(0).map(() =>
      Array(size).fill(ComplexMath.create(0))
    );
    for (let i = 0; i < size; i++) {
      matrix[i][i] = ComplexMath.create(1);
    }
    return matrix;
  }

  static applyToVector(matrix: Complex[][], vector: Complex[]): Complex[] {
    const result: Complex[] = Array(vector.length).fill(ComplexMath.create(0));
    for (let i = 0; i < matrix.length; i++) {
      let sum = ComplexMath.create(0);
      for (let j = 0; j < vector.length; j++) {
        sum = ComplexMath.add(sum, ComplexMath.multiply(matrix[i][j], vector[j]));
      }
      result[i] = sum;
    }
    return result;
  }

  static conjugateTranspose(matrix: Complex[][]): Complex[][] {
    const rows = matrix.length;
    const cols = matrix[0].length;
    const result: Complex[][] = Array(cols).fill(0).map(() =>
      Array(rows).fill(ComplexMath.create(0))
    );
    
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        result[j][i] = ComplexMath.conjugate(matrix[i][j]);
      }
    }
    return result;
  }
}
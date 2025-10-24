// src/test/matrixOps.test.ts
import { MatrixOps } from '../matrix_operations/MatrixOps';
import { Complex } from '../types';
import { ComplexMath } from '../utilities';

// Helper to compare matrices ignoring -0 vs 0
function expectMatrixClose(a: Complex[][], b: Complex[][]) {
  expect(a.length).toBe(b.length);
  expect(a[0].length).toBe(b[0].length);
  for (let i = 0; i < a.length; i++) {
    for (let j = 0; j < a[0].length; j++) {
      const aRe = Object.is(a[i][j].real, -0) ? 0 : a[i][j].real;
      const aIm = Object.is(a[i][j].imag, -0) ? 0 : a[i][j].imag;
      const bRe = Object.is(b[i][j].real, -0) ? 0 : b[i][j].real;
      const bIm = Object.is(b[i][j].imag, -0) ? 0 : b[i][j].imag;
      expect(aRe).toBeCloseTo(bRe);
      expect(aIm).toBeCloseTo(bIm);
    }
  }
}

describe('MatrixOps', () => {

  describe('multiply', () => {
    it('multiplies 2x2 matrices', () => {
      const a: Complex[][] = [
        [ComplexMath.create(1), ComplexMath.create(2)],
        [ComplexMath.create(3), ComplexMath.create(4)]
      ];
      const b: Complex[][] = [
        [ComplexMath.create(5), ComplexMath.create(6)],
        [ComplexMath.create(7), ComplexMath.create(8)]
      ];
      const result = MatrixOps.multiply(a, b);
      expectMatrixClose(result, [
        [ComplexMath.create(19), ComplexMath.create(22)],
        [ComplexMath.create(43), ComplexMath.create(50)]
      ]);
    });
  });

  describe('tensorProduct', () => {
    it('computes tensor product of 2x2 matrices', () => {
      const a: Complex[][] = [
        [ComplexMath.create(1), ComplexMath.create(2)],
        [ComplexMath.create(3), ComplexMath.create(4)]
      ];
      const b: Complex[][] = [
        [ComplexMath.create(0), ComplexMath.create(5)],
        [ComplexMath.create(6), ComplexMath.create(7)]
      ];
      const result = MatrixOps.tensorProduct(a, b);
      expectMatrixClose(result, [
        [ComplexMath.create(0), ComplexMath.create(5), ComplexMath.create(0), ComplexMath.create(10)],
        [ComplexMath.create(6), ComplexMath.create(7), ComplexMath.create(12), ComplexMath.create(14)],
        [ComplexMath.create(0), ComplexMath.create(15), ComplexMath.create(0), ComplexMath.create(20)],
        [ComplexMath.create(18), ComplexMath.create(21), ComplexMath.create(24), ComplexMath.create(28)]
      ]);
    });
  });

  describe('identity', () => {
    it('creates 3x3 identity matrix', () => {
      const result = MatrixOps.identity(3);
      expectMatrixClose(result, [
        [ComplexMath.create(1), ComplexMath.create(0), ComplexMath.create(0)],
        [ComplexMath.create(0), ComplexMath.create(1), ComplexMath.create(0)],
        [ComplexMath.create(0), ComplexMath.create(0), ComplexMath.create(1)]
      ]);
    });
  });

  describe('applyToVector', () => {
    it('applies 2x2 matrix to 2-element vector', () => {
      const matrix: Complex[][] = [
        [ComplexMath.create(1), ComplexMath.create(2)],
        [ComplexMath.create(3), ComplexMath.create(4)]
      ];
      const vector: Complex[] = [ComplexMath.create(5), ComplexMath.create(6)];
      const result = MatrixOps.applyToVector(matrix, vector);
      expect(result).toEqual([
        ComplexMath.create(17), // 1*5 + 2*6
        ComplexMath.create(39)  // 3*5 + 4*6
      ]);
    });
  });

  describe('conjugateTranspose', () => {
    it('computes conjugate transpose of a 2x2 matrix', () => {
      const matrix: Complex[][] = [
        [ComplexMath.create(1, 1), ComplexMath.create(2, -1)],
        [ComplexMath.create(3, 0), ComplexMath.create(4, 4)]
      ];
      const result = MatrixOps.conjugateTranspose(matrix);
      expectMatrixClose(result, [
        [ComplexMath.create(1, -1), ComplexMath.create(3, 0)],
        [ComplexMath.create(2, 1), ComplexMath.create(4, -4)]
      ]);
    });
  });

});

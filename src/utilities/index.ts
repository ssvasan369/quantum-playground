import { Complex } from "../types";

export class ComplexMath {
  static create(real: number, imag: number = 0): Complex {
    return { real, imag };
  }

  static add(a: Complex, b: Complex): Complex {
    return { real: a.real + b.real, imag: a.imag + b.imag };
  }

  static subtract(a: Complex, b: Complex): Complex {
    return { real: a.real - b.real, imag: a.imag - b.imag };
  }

  static multiply(a: Complex, b: Complex): Complex {
    return {
      real: a.real * b.real - a.imag * b.imag,
      imag: a.real * b.imag + a.imag * b.real
    };
  }

  static conjugate(c: Complex): Complex {
    return { real: c.real, imag: -c.imag };
  }

  static magnitude(c: Complex): number {
    return Math.sqrt(c.real * c.real + c.imag * c.imag);
  }

  static magnitudeSquared(c: Complex): number {
    return c.real * c.real + c.imag * c.imag;
  }

  static scale(c: Complex, scalar: number): Complex {
    return { real: c.real * scalar, imag: c.imag * scalar };
  }

  static phase(c: Complex): number {
    return Math.atan2(c.imag, c.real);
  }

  static fromPolar(magnitude: number, phase: number): Complex {
    return {
      real: magnitude * Math.cos(phase),
      imag: magnitude * Math.sin(phase)
    };
  }

  static toString(c: Complex, precision: number = 4): string {
    const r = c.real.toFixed(precision);
    const i = Math.abs(c.imag).toFixed(precision);
    const sign = c.imag >= 0 ? '+' : '-';
    return `${r} ${sign} ${i}i`;
  }
}
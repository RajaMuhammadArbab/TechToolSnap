/**
 * Compact, zero-dependency QR Code generator in TypeScript.
 * Generates an exact 2D boolean matrix of QR modules.
 */

// Error correction levels
export type QrErrorCorrection = 'L' | 'M' | 'Q' | 'H';

// QR Code version constants & polynomial tables
const GF256_EXP: number[] = new Array(512);
const GF256_LOG: number[] = new Array(256);

(function initGaloisField() {
  let x = 1;
  for (let i = 0; i < 255; i++) {
    GF256_EXP[i] = x;
    GF256_LOG[x] = i;
    x = (x << 1) ^ (x >= 128 ? 0x11d : 0);
  }
  for (let i = 255; i < 512; i++) {
    GF256_EXP[i] = GF256_EXP[i - 255];
  }
})();

function gfMultiply(x: number, y: number): number {
  if (x === 0 || y === 0) return 0;
  return GF256_EXP[GF256_LOG[x] + GF256_LOG[y]];
}

function polyMultiply(p1: number[], p2: number[]): number[] {
  const result = new Array(p1.length + p2.length - 1).fill(0);
  for (let i = 0; i < p1.length; i++) {
    for (let j = 0; j < p2.length; j++) {
      result[i + j] ^= gfMultiply(p1[i], p2[j]);
    }
  }
  return result;
}

function getGeneratorPolynomial(degree: number): number[] {
  let g = [1];
  for (let i = 0; i < degree; i++) {
    g = polyMultiply(g, [1, GF256_EXP[i]]);
  }
  return g;
}

function calculateErrorCorrection(data: number[], eccCount: number): number[] {
  const gen = getGeneratorPolynomial(eccCount);
  const remainder = new Array(eccCount).fill(0);
  for (const byte of data) {
    const factor = byte ^ remainder[0];
    remainder.shift();
    remainder.push(0);
    for (let i = 0; i < eccCount; i++) {
      remainder[i] ^= gfMultiply(gen[i + 1], factor);
    }
  }
  return remainder;
}

// Table of capacities and ECC codewords for standard versions (1 to 10)
interface VersionSpec {
  version: number;
  dataBytes: number;
  eccBytes: number;
  size: number;
}

const SPECS_M: VersionSpec[] = [
  { version: 1, dataBytes: 16, eccBytes: 10, size: 21 },
  { version: 2, dataBytes: 28, eccBytes: 16, size: 25 },
  { version: 3, dataBytes: 44, eccBytes: 26, size: 29 },
  { version: 4, dataBytes: 64, eccBytes: 36, size: 33 },
  { version: 5, dataBytes: 86, eccBytes: 48, size: 37 },
  { version: 6, dataBytes: 108, eccBytes: 64, size: 41 },
  { version: 7, dataBytes: 124, eccBytes: 72, size: 45 },
  { version: 8, dataBytes: 154, eccBytes: 88, size: 49 },
  { version: 9, dataBytes: 182, eccBytes: 110, size: 53 },
  { version: 10, dataBytes: 216, eccBytes: 130, size: 57 }
];

export function createQrMatrix(text: string): boolean[][] {
  const utf8Bytes = new TextEncoder().encode(text);
  
  // Find smallest version that fits
  let spec = SPECS_M.find(s => s.dataBytes >= utf8Bytes.length + 3);
  if (!spec) {
    spec = SPECS_M[SPECS_M.length - 1]; // Fallback to max version
  }

  const { size, dataBytes, eccBytes } = spec;

  // Build byte data stream (Byte Mode: 0100 + char count + data + terminator)
  const bitArray: number[] = [];
  function pushBits(val: number, len: number) {
    for (let i = len - 1; i >= 0; i--) {
      bitArray.push((val >> i) & 1);
    }
  }

  pushBits(0b0100, 4); // Byte mode indicator
  pushBits(Math.min(utf8Bytes.length, 255), 8); // Character count indicator

  for (const b of utf8Bytes) {
    pushBits(b, 8);
  }

  // Terminator
  pushBits(0, Math.min(4, dataBytes * 8 - bitArray.length));
  while (bitArray.length % 8 !== 0) {
    bitArray.push(0);
  }

  // Pad bytes
  const padBytes = [0xec, 0x11];
  let padIdx = 0;
  while (bitArray.length < dataBytes * 8) {
    pushBits(padBytes[padIdx % 2], 8);
    padIdx++;
  }

  // Convert bits to bytes
  const data: number[] = [];
  for (let i = 0; i < bitArray.length; i += 8) {
    let byte = 0;
    for (let j = 0; j < 8; j++) {
      byte = (byte << 1) | bitArray[i + j];
    }
    data.push(byte);
  }

  // Compute ECC
  const ecc = calculateErrorCorrection(data, eccBytes);
  const fullCodewords = [...data, ...ecc];

  // Initialize Matrix with unassigned state
  // null = unset, true = black, false = white
  const matrix: (boolean | null)[][] = Array.from({ length: size }, () => Array(size).fill(null));

  // Function to place finder pattern
  function placeFinder(row: number, col: number) {
    for (let r = -1; r <= 7; r++) {
      for (let c = -1; c <= 7; c++) {
        const tr = row + r;
        const tc = col + c;
        if (tr >= 0 && tr < size && tc >= 0 && tc < size) {
          if (r >= 0 && r <= 6 && c >= 0 && c <= 6) {
            if (r === 0 || r === 6 || c === 0 || c === 6 || (r >= 2 && r <= 4 && c >= 2 && c <= 4)) {
              matrix[tr][tc] = true;
            } else {
              matrix[tr][tc] = false;
            }
          } else {
            matrix[tr][tc] = false; // separator
          }
        }
      }
    }
  }

  // Place 3 finder patterns
  placeFinder(0, 0);
  placeFinder(0, size - 7);
  placeFinder(size - 7, 0);

  // Timing patterns
  for (let i = 8; i < size - 8; i++) {
    matrix[6][i] = i % 2 === 0;
    matrix[i][6] = i % 2 === 0;
  }

  // Dark module
  matrix[size - 8][8] = true;

  // Alignment patterns for version > 1
  if (spec.version >= 2) {
    const alignPos = size - 7;
    for (let r = -2; r <= 2; r++) {
      for (let c = -2; c <= 2; c++) {
        const tr = alignPos + r;
        const tc = alignPos + c;
        if (matrix[tr][tc] === null) {
          matrix[tr][tc] = Math.max(Math.abs(r), Math.abs(c)) !== 1;
        }
      }
    }
  }

  // Reserve format info area
  for (let i = 0; i < 9; i++) {
    if (matrix[8][i] === null) matrix[8][i] = false;
    if (matrix[i][8] === null) matrix[i][8] = false;
  }
  for (let i = 0; i < 8; i++) {
    if (matrix[size - 1 - i][8] === null) matrix[size - 1 - i][8] = false;
    if (matrix[8][size - 1 - i] === null) matrix[8][size - 1 - i] = false;
  }

  // Place codewords in zigzag
  let bitIdx = 0;
  const totalBits = fullCodewords.length * 8;
  const getBit = (idx: number) => {
    if (idx >= totalBits) return false;
    const b = fullCodewords[Math.floor(idx / 8)];
    return ((b >> (7 - (idx % 8))) & 1) === 1;
  };

  let upwards = true;
  for (let right = size - 1; right > 0; right -= 2) {
    if (right === 6) right--; // skip timing column
    const rows = upwards
      ? Array.from({ length: size }, (_, i) => size - 1 - i)
      : Array.from({ length: size }, (_, i) => i);

    for (const r of rows) {
      for (const col of [right, right - 1]) {
        if (matrix[r][col] === null) {
          const bit = getBit(bitIdx++);
          // Apply standard mask (row + col) % 2 === 0
          const mask = (r + col) % 2 === 0;
          matrix[r][col] = mask ? !bit : bit;
        }
      }
    }
    upwards = !upwards;
  }

  // Format bits (standard mask 0, level M = 00)
  const formatBits = [1, 0, 1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0];
  for (let i = 0; i < 6; i++) matrix[8][i] = formatBits[i] === 1;
  matrix[8][7] = formatBits[6] === 1;
  matrix[8][8] = formatBits[7] === 1;
  matrix[7][8] = formatBits[8] === 1;
  for (let i = 9; i < 15; i++) matrix[14 - i][8] = formatBits[i] === 1;

  for (let i = 0; i < 8; i++) matrix[size - 1 - i][8] = formatBits[i] === 1;
  for (let i = 8; i < 15; i++) matrix[8][size - 15 + i] = formatBits[i] === 1;

  // Replace remaining nulls with false
  return matrix.map(row => row.map(cell => cell === true));
}

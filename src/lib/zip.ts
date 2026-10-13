/**
 * Zero-dependency client-side ZIP archive generator.
 * Creates standard PKZIP archives compatible with Windows, macOS, Linux, and mobile.
 */

// CRC32 table calculation
const CRC_TABLE = new Uint32Array(256);
for (let i = 0; i < 256; i++) {
  let c = i;
  for (let k = 0; k < 8; k++) {
    c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  }
  CRC_TABLE[i] = c >>> 0;
}

function calculateCrc32(data: Uint8Array): number {
  let crc = 0xffffffff;
  for (let i = 0; i < data.length; i++) {
    crc = CRC_TABLE[(crc ^ data[i]) & 0xff] ^ (crc >>> 8);
  }
  return (crc ^ 0xffffffff) >>> 0;
}

export interface ZipFileInput {
  name: string;
  data: Uint8Array;
}

export async function createZipArchive(files: ZipFileInput[]): Promise<Blob> {
  const parts: Uint8Array[] = [];
  const centralDirectoryHeaders: Uint8Array[] = [];
  let currentOffset = 0;

  const now = new Date();
  const dosTime = (now.getHours() << 11) | (now.getMinutes() << 5) | (now.getSeconds() >> 1);
  const dosDate = ((now.getFullYear() - 1980) << 9) | ((now.getMonth() + 1) << 5) | now.getDate();

  for (const file of files) {
    const nameBytes = new TextEncoder().encode(file.name);
    const crc = calculateCrc32(file.data);
    const size = file.data.length;

    // --- Local File Header (30 bytes + name length) ---
    const localHeader = new Uint8Array(30 + nameBytes.length);
    const localView = new DataView(localHeader.buffer);

    localView.setUint32(0, 0x04034b50, true); // signature
    localView.setUint16(4, 20, true);         // version needed (2.0)
    localView.setUint16(6, 0, true);          // flags
    localView.setUint16(8, 0, true);          // compression method (0 = store)
    localView.setUint16(10, dosTime, true);   // mod time
    localView.setUint16(12, dosDate, true);   // mod date
    localView.setUint32(14, crc, true);       // crc-32
    localView.setUint32(18, size, true);      // compressed size
    localView.setUint32(22, size, true);      // uncompressed size
    localView.setUint16(26, nameBytes.length, true); // filename length
    localView.setUint16(28, 0, true);         // extra length
    localHeader.set(nameBytes, 30);

    parts.push(localHeader);
    parts.push(file.data);

    // --- Central Directory Header (46 bytes + name length) ---
    const cdHeader = new Uint8Array(46 + nameBytes.length);
    const cdView = new DataView(cdHeader.buffer);

    cdView.setUint32(0, 0x02014b50, true);     // signature
    cdView.setUint16(4, 20, true);             // version made by
    cdView.setUint16(6, 20, true);             // version needed
    cdView.setUint16(8, 0, true);              // flags
    cdView.setUint16(10, 0, true);             // compression method (0 = store)
    cdView.setUint16(12, dosTime, true);       // mod time
    cdView.setUint16(14, dosDate, true);       // mod date
    cdView.setUint32(16, crc, true);           // crc-32
    cdView.setUint32(20, size, true);          // compressed size
    cdView.setUint32(24, size, true);          // uncompressed size
    cdView.setUint16(28, nameBytes.length, true); // filename length
    cdView.setUint16(30, 0, true);             // extra length
    cdView.setUint16(32, 0, true);             // comment length
    cdView.setUint16(34, 0, true);             // disk start
    cdView.setUint16(36, 0, true);             // internal attrs
    cdView.setUint32(38, 0, true);             // external attrs
    cdView.setUint32(42, currentOffset, true); // relative offset of local header
    cdHeader.set(nameBytes, 46);

    centralDirectoryHeaders.push(cdHeader);
    currentOffset += localHeader.length + file.data.length;
  }

  const cdOffset = currentOffset;
  let cdSize = 0;
  for (const h of centralDirectoryHeaders) {
    parts.push(h);
    cdSize += h.length;
  }

  // --- End of Central Directory Record (22 bytes) ---
  const eocd = new Uint8Array(22);
  const eocdView = new DataView(eocd.buffer);

  eocdView.setUint32(0, 0x06054b50, true); // signature
  eocdView.setUint16(4, 0, true);          // disk number
  eocdView.setUint16(6, 0, true);          // disk with CD
  eocdView.setUint16(8, files.length, true); // total entries on disk
  eocdView.setUint16(10, files.length, true); // total entries
  eocdView.setUint32(12, cdSize, true);    // size of CD
  eocdView.setUint32(16, cdOffset, true);  // offset of CD
  eocdView.setUint16(20, 0, true);         // comment length

  parts.push(eocd);

  return new Blob(parts as unknown as BlobPart[], { type: 'application/zip' });
}

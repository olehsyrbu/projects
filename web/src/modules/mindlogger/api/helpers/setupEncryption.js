import BN from 'bn.js';

let crypto = window.crypto.subtle;
let encoder = new TextEncoder();
let decoder = new TextDecoder();

export async function setupEncryption(options) {
  let modulus = BN.mont(new BN(options.prime));
  let base = new BN(options.generator);

  let privateKey = new BN(window.crypto.getRandomValues(new Uint8Array(128)));
  let publicKey = base.toRed(modulus).redPow(privateKey).fromRed().toArray();
  let sharedSecretKey = new Uint8Array(
    new BN(options.publicKey).toRed(modulus).redPow(privateKey).fromRed().toArray(),
  );

  let key = await crypto.importKey(
    'raw',
    await crypto.digest('SHA-256', sharedSecretKey),
    { name: 'AES-CBC' },
    false,
    ['encrypt', 'decrypt'],
  );

  return {
    publicKey,
    async encrypt(message) {
      let buffer = encoder.encode(message);
      let iv = window.crypto.getRandomValues(new Uint8Array(16));
      let encrypted = await crypto.encrypt({ name: 'AES-CBC', iv }, key, buffer);
      return bufferToHex(iv) + ':' + bufferToHex(encrypted);
    },
    async decrypt(payload) {
      let [iv, encrypted] = payload.split(':').map(hexToBuffer);
      let buffer = await crypto.decrypt({ name: 'AES-CBC', iv }, key, encrypted);
      return decoder.decode(buffer);
    },
  };
}

export function bufferToHex(buffer) {
  let bytes = new Uint8Array(buffer);
  return Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('');
}

export function hexToBuffer(hex) {
  return new Uint8Array(hex.match(/../g).map((s) => parseInt(s, 16)));
}

// eslint-disable-next-line @typescript-eslint/no-var-requires
const crypto = require("crypto");
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { Buffer } = require("buffer");
const algorithm = "aes-256-cbc";

export function generateKey(leng = 16) {
  const iv = crypto.randomBytes(leng);
  return iv.toString("hex");
}

export function encrypt(text: string, key: string) {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv("aes-256-cbc", Buffer.from(key), iv);
  let encrypted = cipher.update(text);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return `${algorithm}:${encrypted.toString("hex")}:${iv.toString("hex")}`;
}

export function decrypt(value: string, key: string) {
  let [algo, data, iv] = value.split(":");
  algo = algo += "";
  iv = Buffer.from(iv, "hex");
  data = Buffer.from(data, "hex");
  const decipher = crypto.createDecipheriv(algo, Buffer.from(key), iv);
  let decrypted = decipher.update(data);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted.toString();
}

export const useCrypto = () => ({ encrypt, decrypt, generateKey });

// eslint-disable-next-line @typescript-eslint/no-var-requires
const crypto = require("crypto");
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { Buffer } = require("buffer");

export function generateKey(leng = 16) {
  const iv = crypto.randomBytes(leng);
  return iv.toString("hex");
}

const algos = ["aes-256-cbc", "aes256"];
const defaultAlgo = "aes-256-cbc";

interface Cryptr {
  encryptIv(value: string, key: string, algo?: string): string;
  encrypt(value: string, key: string, algo?: string): string;
  decrypt(value: string, key: string): string;
}

const cryptr: Cryptr = {
  encryptIv(value: string, key: string, algo = defaultAlgo): string {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(algo, Buffer.from(key), iv);
    let encrypted = cipher.update(value);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return `${algo}:${encrypted.toString("hex")}:${iv.toString("hex")}`;
  },
  encrypt(value: string, key: string, algo = defaultAlgo): string {
    const cipher = crypto.createCipher("aes256", key);
    const encrypted = cipher.update(value, "utf8", "hex") + cipher.final("hex");
    return `${algo}:${encrypted.toString("hex")}`;
  },
  decrypt(value: string, key: string): string {
    const [algo, data, iv] = value.split(":");
    if (iv) {
      const decipher = crypto.createDecipheriv(
        algo,
        Buffer.from(key),
        Buffer.from(iv, "hex")
      );
      let decrypted = decipher.update(Buffer.from(data, "hex"));
      decrypted = Buffer.concat([decrypted, decipher.final()]);
      return decrypted.toString();
    } else {
      const decipher = crypto.createDecipher(algo, key);
      const decrypted =
        decipher.update(data, "hex", "utf8") + decipher.final("utf8");
      return decrypted;
    }
  }
};

export const useCrypto = () => ({ generateKey, cryptr, defaultAlgo, algos });

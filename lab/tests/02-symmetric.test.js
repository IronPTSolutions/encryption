import { describe, it, expect } from "vitest";
import request from "supertest";
import app from "../app.js";

describe("Iteración 2: Cifrado simétrico (AES-256-GCM)", () => {
  // ============================================
  // POST /api/crypto/symmetric/encrypt
  // ============================================
  describe("POST /api/crypto/symmetric/encrypt", () => {
    it("debería cifrar un texto y devolver encrypted, iv, salt y authTag en hex", async () => {
      const response = await request(app)
        .post("/api/crypto/symmetric/encrypt")
        .send({ text: "mensaje secreto", password: "mi-password" })
        .expect(200);

      expect(response.body.encrypted).toBeDefined();
      expect(response.body.iv).toBeDefined();
      expect(response.body.salt).toBeDefined();
      expect(response.body.authTag).toBeDefined();

      // Verificar que los valores son hex válidos
      expect(response.body.encrypted).toMatch(/^[0-9a-f]+$/);
      expect(response.body.iv).toMatch(/^[0-9a-f]+$/);
      expect(response.body.salt).toMatch(/^[0-9a-f]+$/);
      expect(response.body.authTag).toMatch(/^[0-9a-f]+$/);

      // Verificar longitudes esperadas (en hex: 2 chars por byte)
      expect(response.body.iv).toHaveLength(24); // 12 bytes = 24 hex chars
      expect(response.body.salt).toHaveLength(32); // 16 bytes = 32 hex chars
      expect(response.body.authTag).toHaveLength(32); // 16 bytes = 32 hex chars
    });

    it("debería devolver 400 si no se envía text", async () => {
      await request(app)
        .post("/api/crypto/symmetric/encrypt")
        .send({ password: "mi-password" })
        .expect(400);
    });

    it("debería devolver 400 si no se envía password", async () => {
      await request(app)
        .post("/api/crypto/symmetric/encrypt")
        .send({ text: "hola" })
        .expect(400);
    });
  });

  // ============================================
  // POST /api/crypto/symmetric/decrypt
  // ============================================
  describe("POST /api/crypto/symmetric/decrypt", () => {
    it("debería descifrar correctamente un texto previamente cifrado", async () => {
      const originalText = "mensaje secreto para descifrar";

      // Primero ciframos
      const encryptRes = await request(app)
        .post("/api/crypto/symmetric/encrypt")
        .send({ text: originalText, password: "clave-segura" })
        .expect(200);

      // Luego desciframos con los mismos datos
      const decryptRes = await request(app)
        .post("/api/crypto/symmetric/decrypt")
        .send({
          encrypted: encryptRes.body.encrypted,
          iv: encryptRes.body.iv,
          salt: encryptRes.body.salt,
          authTag: encryptRes.body.authTag,
          password: "clave-segura",
        })
        .expect(200);

      expect(decryptRes.body.decrypted).toBe(originalText);
    });

    it("debería devolver 400 si el password es incorrecto", async () => {
      const encryptRes = await request(app)
        .post("/api/crypto/symmetric/encrypt")
        .send({ text: "secreto", password: "clave-correcta" })
        .expect(200);

      const response = await request(app)
        .post("/api/crypto/symmetric/decrypt")
        .send({
          encrypted: encryptRes.body.encrypted,
          iv: encryptRes.body.iv,
          salt: encryptRes.body.salt,
          authTag: encryptRes.body.authTag,
          password: "clave-incorrecta",
        })
        .expect(400);

      expect(response.body.message).toBe("Decryption failed");
    });

    it("debería devolver 400 si faltan campos", async () => {
      await request(app)
        .post("/api/crypto/symmetric/decrypt")
        .send({ encrypted: "abc", password: "clave" })
        .expect(400);
    });
  });
});

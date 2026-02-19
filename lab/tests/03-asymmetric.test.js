import { describe, it, expect } from "vitest";
import request from "supertest";
import crypto from "node:crypto";
import app from "../app.js";

// Generamos un par de claves para reutilizar en los tests (evitar regenerar cada vez)
const { publicKey, privateKey } = crypto.generateKeyPairSync("rsa", {
  modulusLength: 2048,
  publicKeyEncoding: { type: "spki", format: "pem" },
  privateKeyEncoding: { type: "pkcs8", format: "pem" },
});

describe("Iteración 3: Cifrado asimétrico (RSA)", () => {
  // ============================================
  // POST /api/crypto/asymmetric/keypair
  // ============================================
  describe("POST /api/crypto/asymmetric/keypair", () => {
    it("debería generar un par de claves RSA en formato PEM", async () => {
      const response = await request(app)
        .post("/api/crypto/asymmetric/keypair")
        .send({})
        .expect(200);

      expect(response.body.publicKey).toMatch(/^-----BEGIN PUBLIC KEY-----/);
      expect(response.body.privateKey).toMatch(/^-----BEGIN PRIVATE KEY-----/);
    });
  });

  // ============================================
  // POST /api/crypto/asymmetric/encrypt
  // ============================================
  describe("POST /api/crypto/asymmetric/encrypt", () => {
    it("debería cifrar un texto con la clave pública y devolver base64", async () => {
      const response = await request(app)
        .post("/api/crypto/asymmetric/encrypt")
        .send({ text: "secreto", publicKey })
        .expect(200);

      expect(response.body.encrypted).toBeDefined();
      // Verificar que es base64 válido
      expect(() => Buffer.from(response.body.encrypted, "base64")).not.toThrow();
    });

    it("debería devolver 400 si no se envía text", async () => {
      await request(app)
        .post("/api/crypto/asymmetric/encrypt")
        .send({ publicKey })
        .expect(400);
    });

    it("debería devolver 400 si no se envía publicKey", async () => {
      await request(app)
        .post("/api/crypto/asymmetric/encrypt")
        .send({ text: "hola" })
        .expect(400);
    });
  });

  // ============================================
  // POST /api/crypto/asymmetric/decrypt
  // ============================================
  describe("POST /api/crypto/asymmetric/decrypt", () => {
    it("debería descifrar un texto previamente cifrado", async () => {
      const originalText = "mensaje RSA secreto";

      // Ciframos
      const encryptRes = await request(app)
        .post("/api/crypto/asymmetric/encrypt")
        .send({ text: originalText, publicKey })
        .expect(200);

      // Desciframos
      const decryptRes = await request(app)
        .post("/api/crypto/asymmetric/decrypt")
        .send({ encrypted: encryptRes.body.encrypted, privateKey })
        .expect(200);

      expect(decryptRes.body.decrypted).toBe(originalText);
    });

    it("debería devolver 400 si la clave privada no corresponde", async () => {
      // Ciframos con una clave
      const encryptRes = await request(app)
        .post("/api/crypto/asymmetric/encrypt")
        .send({ text: "test", publicKey })
        .expect(200);

      // Generamos otra clave privada distinta
      const { privateKey: otherKey } = crypto.generateKeyPairSync("rsa", {
        modulusLength: 2048,
        publicKeyEncoding: { type: "spki", format: "pem" },
        privateKeyEncoding: { type: "pkcs8", format: "pem" },
      });

      await request(app)
        .post("/api/crypto/asymmetric/decrypt")
        .send({ encrypted: encryptRes.body.encrypted, privateKey: otherKey })
        .expect(400);
    });

    it("debería devolver 400 si faltan campos", async () => {
      await request(app)
        .post("/api/crypto/asymmetric/decrypt")
        .send({ encrypted: "abc" })
        .expect(400);
    });
  });
});

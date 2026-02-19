import { describe, it, expect } from "vitest";
import request from "supertest";
import crypto from "node:crypto";
import app from "../app.js";

const { publicKey, privateKey } = crypto.generateKeyPairSync("rsa", {
  modulusLength: 2048,
  publicKeyEncoding: { type: "spki", format: "pem" },
  privateKeyEncoding: { type: "pkcs8", format: "pem" },
});

describe("Iteración 4: Firma digital", () => {
  // ============================================
  // POST /api/crypto/sign
  // ============================================
  describe("POST /api/crypto/sign", () => {
    it("debería firmar datos y devolver la firma en base64", async () => {
      const response = await request(app)
        .post("/api/crypto/sign")
        .send({ data: "documento importante", privateKey })
        .expect(200);

      expect(response.body.signature).toBeDefined();
      expect(() => Buffer.from(response.body.signature, "base64")).not.toThrow();
    });

    it("debería devolver 400 si no se envía data", async () => {
      await request(app)
        .post("/api/crypto/sign")
        .send({ privateKey })
        .expect(400);
    });

    it("debería devolver 400 si no se envía privateKey", async () => {
      await request(app)
        .post("/api/crypto/sign")
        .send({ data: "algo" })
        .expect(400);
    });
  });

  // ============================================
  // POST /api/crypto/verify
  // ============================================
  describe("POST /api/crypto/verify", () => {
    it("debería verificar una firma válida y devolver { valid: true }", async () => {
      // Firmar
      const signRes = await request(app)
        .post("/api/crypto/sign")
        .send({ data: "documento importante", privateKey })
        .expect(200);

      // Verificar
      const verifyRes = await request(app)
        .post("/api/crypto/verify")
        .send({
          data: "documento importante",
          signature: signRes.body.signature,
          publicKey,
        })
        .expect(200);

      expect(verifyRes.body.valid).toBe(true);
    });

    it("debería devolver { valid: false } si los datos fueron alterados", async () => {
      const signRes = await request(app)
        .post("/api/crypto/sign")
        .send({ data: "documento original", privateKey })
        .expect(200);

      const verifyRes = await request(app)
        .post("/api/crypto/verify")
        .send({
          data: "documento ALTERADO",
          signature: signRes.body.signature,
          publicKey,
        })
        .expect(200);

      expect(verifyRes.body.valid).toBe(false);
    });

    it("debería devolver { valid: false } si la firma no corresponde a la clave", async () => {
      const { privateKey: otherPrivateKey } = crypto.generateKeyPairSync("rsa", {
        modulusLength: 2048,
        publicKeyEncoding: { type: "spki", format: "pem" },
        privateKeyEncoding: { type: "pkcs8", format: "pem" },
      });

      // Firmar con una clave distinta
      const signRes = await request(app)
        .post("/api/crypto/sign")
        .send({ data: "test", privateKey: otherPrivateKey })
        .expect(200);

      // Verificar con la clave pública original
      const verifyRes = await request(app)
        .post("/api/crypto/verify")
        .send({
          data: "test",
          signature: signRes.body.signature,
          publicKey,
        })
        .expect(200);

      expect(verifyRes.body.valid).toBe(false);
    });

    it("debería devolver 400 si faltan campos", async () => {
      await request(app)
        .post("/api/crypto/verify")
        .send({ data: "algo" })
        .expect(400);
    });
  });
});

import { describe, it, expect } from "vitest";
import request from "supertest";
import crypto from "node:crypto";
import app from "../app.js";

describe("Iteración 1: Hashing", () => {
  // ============================================
  // POST /api/crypto/hash
  // ============================================
  describe("POST /api/crypto/hash", () => {
    it("debería generar un hash SHA-256 del texto", async () => {
      const response = await request(app)
        .post("/api/crypto/hash")
        .send({ text: "hello world" })
        .expect(200);

      const expected = crypto
        .createHash("sha256")
        .update("hello world")
        .digest("hex");

      expect(response.body.hash).toBe(expected);
    });

    it("debería usar sha256 por defecto si no se envía algorithm", async () => {
      const response = await request(app)
        .post("/api/crypto/hash")
        .send({ text: "test" })
        .expect(200);

      const expected = crypto
        .createHash("sha256")
        .update("test")
        .digest("hex");

      expect(response.body.hash).toBe(expected);
    });

    it("debería aceptar un algoritmo diferente (md5)", async () => {
      const response = await request(app)
        .post("/api/crypto/hash")
        .send({ text: "hello", algorithm: "md5" })
        .expect(200);

      const expected = crypto
        .createHash("md5")
        .update("hello")
        .digest("hex");

      expect(response.body.hash).toBe(expected);
    });

    it("debería devolver 400 si no se envía text", async () => {
      const response = await request(app)
        .post("/api/crypto/hash")
        .send({ algorithm: "sha256" })
        .expect(400);

      expect(response.body.message).toBe("Text is required");
    });
  });

  // ============================================
  // POST /api/crypto/hmac
  // ============================================
  describe("POST /api/crypto/hmac", () => {
    it("debería generar un HMAC del texto con el secret", async () => {
      const response = await request(app)
        .post("/api/crypto/hmac")
        .send({ text: "hello world", secret: "mi-clave" })
        .expect(200);

      const expected = crypto
        .createHmac("sha256", "mi-clave")
        .update("hello world")
        .digest("hex");

      expect(response.body.hmac).toBe(expected);
    });

    it("debería devolver 400 si no se envía text", async () => {
      const response = await request(app)
        .post("/api/crypto/hmac")
        .send({ secret: "clave" })
        .expect(400);

      expect(response.body.message).toBeDefined();
    });

    it("debería devolver 400 si no se envía secret", async () => {
      const response = await request(app)
        .post("/api/crypto/hmac")
        .send({ text: "hello" })
        .expect(400);

      expect(response.body.message).toBeDefined();
    });
  });
});

import { describe, it, expect } from "vitest";
import request from "supertest";
import crypto from "node:crypto";
import app from "../app.js";

describe("Iteración 5: JWT", () => {
  // ============================================
  // POST /api/crypto/jwt/create
  // ============================================
  describe("POST /api/crypto/jwt/create", () => {
    it("debería crear un JWT con 3 partes separadas por puntos", async () => {
      const response = await request(app)
        .post("/api/crypto/jwt/create")
        .send({
          payload: { sub: "user123", name: "Ana" },
          secret: "mi-secreto",
        })
        .expect(200);

      expect(response.body.token).toBeDefined();
      const parts = response.body.token.split(".");
      expect(parts).toHaveLength(3);
    });

    it("debería generar un header correcto con alg HS256", async () => {
      const response = await request(app)
        .post("/api/crypto/jwt/create")
        .send({
          payload: { sub: "user123" },
          secret: "secreto",
        })
        .expect(200);

      const headerJson = Buffer.from(
        response.body.token.split(".")[0],
        "base64url"
      ).toString();
      const header = JSON.parse(headerJson);

      expect(header.alg).toBe("HS256");
      expect(header.typ).toBe("JWT");
    });

    it("debería incluir iat en el payload", async () => {
      const before = Math.floor(Date.now() / 1000);

      const response = await request(app)
        .post("/api/crypto/jwt/create")
        .send({
          payload: { sub: "user123" },
          secret: "secreto",
        })
        .expect(200);

      const after = Math.floor(Date.now() / 1000);

      const payloadJson = Buffer.from(
        response.body.token.split(".")[1],
        "base64url"
      ).toString();
      const payload = JSON.parse(payloadJson);

      expect(payload.iat).toBeGreaterThanOrEqual(before);
      expect(payload.iat).toBeLessThanOrEqual(after);
      expect(payload.sub).toBe("user123");
    });

    it("debería incluir exp si se envía expiresInSeconds", async () => {
      const before = Math.floor(Date.now() / 1000);

      const response = await request(app)
        .post("/api/crypto/jwt/create")
        .send({
          payload: { sub: "user123" },
          secret: "secreto",
          expiresInSeconds: 3600,
        })
        .expect(200);

      const payloadJson = Buffer.from(
        response.body.token.split(".")[1],
        "base64url"
      ).toString();
      const payload = JSON.parse(payloadJson);

      expect(payload.exp).toBeGreaterThanOrEqual(before + 3600);
      expect(payload.exp).toBeLessThanOrEqual(before + 3601);
    });

    it("debería firmar correctamente con HMAC SHA-256", async () => {
      const response = await request(app)
        .post("/api/crypto/jwt/create")
        .send({
          payload: { sub: "user123" },
          secret: "mi-secreto",
        })
        .expect(200);

      const parts = response.body.token.split(".");
      const signatureInput = `${parts[0]}.${parts[1]}`;

      const expectedSignature = crypto
        .createHmac("sha256", "mi-secreto")
        .update(signatureInput)
        .digest("base64url");

      expect(parts[2]).toBe(expectedSignature);
    });

    it("debería devolver 400 si no se envía payload", async () => {
      await request(app)
        .post("/api/crypto/jwt/create")
        .send({ secret: "secreto" })
        .expect(400);
    });

    it("debería devolver 400 si no se envía secret", async () => {
      await request(app)
        .post("/api/crypto/jwt/create")
        .send({ payload: { sub: "user123" } })
        .expect(400);
    });
  });

  // ============================================
  // POST /api/crypto/jwt/verify
  // ============================================
  describe("POST /api/crypto/jwt/verify", () => {
    it("debería verificar un token válido y devolver el payload", async () => {
      // Crear token
      const createRes = await request(app)
        .post("/api/crypto/jwt/create")
        .send({
          payload: { sub: "user123", name: "Ana" },
          secret: "mi-secreto",
          expiresInSeconds: 3600,
        })
        .expect(200);

      // Verificar token
      const verifyRes = await request(app)
        .post("/api/crypto/jwt/verify")
        .send({
          token: createRes.body.token,
          secret: "mi-secreto",
        })
        .expect(200);

      expect(verifyRes.body.valid).toBe(true);
      expect(verifyRes.body.payload.sub).toBe("user123");
      expect(verifyRes.body.payload.name).toBe("Ana");
      expect(verifyRes.body.payload.iat).toBeDefined();
      expect(verifyRes.body.payload.exp).toBeDefined();
    });

    it("debería devolver valid: false si el secret es incorrecto", async () => {
      const createRes = await request(app)
        .post("/api/crypto/jwt/create")
        .send({
          payload: { sub: "user123" },
          secret: "secreto-correcto",
        })
        .expect(200);

      const verifyRes = await request(app)
        .post("/api/crypto/jwt/verify")
        .send({
          token: createRes.body.token,
          secret: "secreto-incorrecto",
        })
        .expect(200);

      expect(verifyRes.body.valid).toBe(false);
      expect(verifyRes.body.error).toBe("Invalid signature");
    });

    it("debería devolver valid: false si el token ha expirado", async () => {
      // Crear un token manualmente que ya haya expirado
      const header = Buffer.from(
        JSON.stringify({ alg: "HS256", typ: "JWT" })
      ).toString("base64url");

      const payload = Buffer.from(
        JSON.stringify({
          sub: "user123",
          iat: Math.floor(Date.now() / 1000) - 7200, // hace 2 horas
          exp: Math.floor(Date.now() / 1000) - 3600, // expiró hace 1 hora
        })
      ).toString("base64url");

      const signature = crypto
        .createHmac("sha256", "secreto")
        .update(`${header}.${payload}`)
        .digest("base64url");

      const expiredToken = `${header}.${payload}.${signature}`;

      const verifyRes = await request(app)
        .post("/api/crypto/jwt/verify")
        .send({ token: expiredToken, secret: "secreto" })
        .expect(200);

      expect(verifyRes.body.valid).toBe(false);
      expect(verifyRes.body.error).toBe("Token expired");
    });

    it("debería devolver 400 si no se envía token", async () => {
      await request(app)
        .post("/api/crypto/jwt/verify")
        .send({ secret: "secreto" })
        .expect(400);
    });

    it("debería devolver 400 si no se envía secret", async () => {
      await request(app)
        .post("/api/crypto/jwt/verify")
        .send({ token: "abc.def.ghi" })
        .expect(400);
    });
  });
});

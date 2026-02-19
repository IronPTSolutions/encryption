// ============================================
// Controladores de operaciones criptográficas
//
// 🚀 ¡Tu trabajo es implementar cada función!
//    Usa el módulo nativo "node:crypto" de Node.js
//    Consulta los ejemplos en los directorios 01-04 del monorepo
// ============================================

import crypto from "node:crypto";
import createError from "http-errors";

// ============================================
// ITERACIÓN 1: Hashing
// ============================================

/**
 * Generar hash de un texto
 * POST /api/crypto/hash
 *
 * Body esperado:
 *   { "text": "hello world", "algorithm": "sha256" }
 *
 * Respuesta esperada:
 *   { "hash": "b94d27b9934d3e08a52e52d7da7dabfac484efe37a5380ee9088f7ace2efcde9" }
 *
 * Requisitos:
 *   - Si no se envía "text", lanzar error 400 con mensaje "Text is required"
 *   - Si no se envía "algorithm", usar "sha256" por defecto
 *   - Devolver el hash en formato hexadecimal
 */
export const hash = async (req, res) => {
  // TODO: Implementar
};

/**
 * Generar HMAC de un texto
 * POST /api/crypto/hmac
 *
 * Body esperado:
 *   { "text": "hello world", "secret": "mi-clave-secreta" }
 *
 * Respuesta esperada:
 *   { "hmac": "..." }
 *
 * Requisitos:
 *   - Si no se envía "text" o "secret", lanzar error 400
 *   - Usar algoritmo SHA-256
 *   - Devolver el HMAC en formato hexadecimal
 */
export const hmac = async (req, res) => {
  // TODO: Implementar
};

// ============================================
// ITERACIÓN 2: Cifrado simétrico (AES-256-GCM)
// ============================================

/**
 * Cifrar texto con AES-256-GCM
 * POST /api/crypto/symmetric/encrypt
 *
 * Body esperado:
 *   { "text": "mensaje secreto", "password": "mi-password" }
 *
 * Respuesta esperada:
 *   {
 *     "encrypted": "<hex>",
 *     "iv": "<hex>",
 *     "salt": "<hex>",
 *     "authTag": "<hex>"
 *   }
 *
 * Requisitos:
 *   - Si no se envía "text" o "password", lanzar error 400
 *   - Derivar la clave con crypto.scryptSync(password, salt, 32)
 *   - Generar un salt aleatorio de 16 bytes
 *   - Generar un iv aleatorio de 12 bytes (recomendado para GCM)
 *   - Devolver todos los valores en formato hexadecimal
 */
export const symmetricEncrypt = async (req, res) => {
  // TODO: Implementar
};

/**
 * Descifrar texto con AES-256-GCM
 * POST /api/crypto/symmetric/decrypt
 *
 * Body esperado:
 *   {
 *     "encrypted": "<hex>",
 *     "iv": "<hex>",
 *     "salt": "<hex>",
 *     "authTag": "<hex>",
 *     "password": "mi-password"
 *   }
 *
 * Respuesta esperada:
 *   { "decrypted": "mensaje secreto" }
 *
 * Requisitos:
 *   - Si falta algún campo, lanzar error 400
 *   - Derivar la clave con crypto.scryptSync(password, salt, 32) usando el mismo salt
 *   - Si el descifrado falla (password incorrecto, datos corruptos), lanzar error 400
 *     con mensaje "Decryption failed"
 */
export const symmetricDecrypt = async (req, res) => {
  // TODO: Implementar
};

// ============================================
// ITERACIÓN 3: Cifrado asimétrico (RSA)
// ============================================

/**
 * Generar un par de claves RSA
 * POST /api/crypto/asymmetric/keypair
 *
 * Body esperado: (vacío o {})
 *
 * Respuesta esperada:
 *   {
 *     "publicKey": "-----BEGIN PUBLIC KEY-----\n...",
 *     "privateKey": "-----BEGIN PRIVATE KEY-----\n..."
 *   }
 *
 * Requisitos:
 *   - Generar claves RSA de 2048 bits
 *   - Devolver en formato PEM (PKCS#1 para pública, PKCS#8 para privada)
 */
export const generateKeyPair = async (req, res) => {
  // TODO: Implementar
  // Pista: crypto.generateKeyPairSync("rsa", { ... })
};

/**
 * Cifrar texto con clave pública RSA
 * POST /api/crypto/asymmetric/encrypt
 *
 * Body esperado:
 *   { "text": "mensaje secreto", "publicKey": "-----BEGIN PUBLIC KEY-----\n..." }
 *
 * Respuesta esperada:
 *   { "encrypted": "<base64>" }
 *
 * Requisitos:
 *   - Si no se envía "text" o "publicKey", lanzar error 400
 *   - Usar padding OAEP con SHA-256
 *   - Devolver el resultado en formato base64
 */
export const asymmetricEncrypt = async (req, res) => {
  // TODO: Implementar
};

/**
 * Descifrar texto con clave privada RSA
 * POST /api/crypto/asymmetric/decrypt
 *
 * Body esperado:
 *   { "encrypted": "<base64>", "privateKey": "-----BEGIN PRIVATE KEY-----\n..." }
 *
 * Respuesta esperada:
 *   { "decrypted": "mensaje secreto" }
 *
 * Requisitos:
 *   - Si no se envía "encrypted" o "privateKey", lanzar error 400
 *   - Usar padding OAEP con SHA-256
 *   - Si el descifrado falla, lanzar error 400 con mensaje "Decryption failed"
 */
export const asymmetricDecrypt = async (req, res) => {
  // TODO: Implementar
};

// ============================================
// ITERACIÓN 4: Firma digital
// ============================================

/**
 * Firmar datos con clave privada RSA
 * POST /api/crypto/sign
 *
 * Body esperado:
 *   { "data": "datos a firmar", "privateKey": "-----BEGIN PRIVATE KEY-----\n..." }
 *
 * Respuesta esperada:
 *   { "signature": "<base64>" }
 *
 * Requisitos:
 *   - Si no se envía "data" o "privateKey", lanzar error 400
 *   - Usar algoritmo SHA-256
 *   - Devolver la firma en formato base64
 */
export const sign = async (req, res) => {
  // TODO: Implementar
};

/**
 * Verificar firma digital con clave pública RSA
 * POST /api/crypto/verify
 *
 * Body esperado:
 *   {
 *     "data": "datos a firmar",
 *     "signature": "<base64>",
 *     "publicKey": "-----BEGIN PUBLIC KEY-----\n..."
 *   }
 *
 * Respuesta esperada:
 *   { "valid": true }   o   { "valid": false }
 *
 * Requisitos:
 *   - Si no se envía "data", "signature" o "publicKey", lanzar error 400
 *   - Usar algoritmo SHA-256
 *   - Devolver { valid: true/false } según el resultado de la verificación
 */
export const verify = async (req, res) => {
  // TODO: Implementar
};

// ============================================
// ITERACIÓN 5: JWT (JSON Web Tokens)
// ============================================

/**
 * Crear un JWT firmado con HMAC SHA-256
 * POST /api/crypto/jwt/create
 *
 * Body esperado:
 *   {
 *     "payload": { "sub": "user123", "name": "Ana" },
 *     "secret": "mi-secreto",
 *     "expiresInSeconds": 3600
 *   }
 *
 * Respuesta esperada:
 *   { "token": "eyJhbGciOiJIUzI1NiIs..." }
 *
 * Requisitos:
 *   - Si no se envía "payload" o "secret", lanzar error 400
 *   - El header debe ser: { "alg": "HS256", "typ": "JWT" }
 *   - Si se envía "expiresInSeconds", añadir claim "exp" al payload
 *     con el timestamp actual + los segundos indicados
 *   - Añadir claim "iat" (issued at) con el timestamp actual
 *   - Firmar con HMAC SHA-256
 *   - Codificar en base64url (sin padding '=')
 *
 * Pistas:
 *   - base64url: Buffer.from(str).toString("base64url")
 *   - HMAC: crypto.createHmac("sha256", secret).update(data).digest("base64url")
 */
export const jwtCreate = async (req, res) => {
  // TODO: Implementar
};

/**
 * Verificar y decodificar un JWT
 * POST /api/crypto/jwt/verify
 *
 * Body esperado:
 *   { "token": "eyJhbGciOiJIUzI1NiIs...", "secret": "mi-secreto" }
 *
 * Respuesta esperada (si es válido):
 *   { "valid": true, "payload": { "sub": "user123", "name": "Ana", "iat": ..., "exp": ... } }
 *
 * Respuesta esperada (si es inválido):
 *   { "valid": false, "error": "Invalid signature" }
 *
 * Respuesta esperada (si ha expirado):
 *   { "valid": false, "error": "Token expired" }
 *
 * Requisitos:
 *   - Si no se envía "token" o "secret", lanzar error 400
 *   - Separar el token en sus 3 partes (header.payload.signature)
 *   - Recalcular la firma y compararla con la recibida
 *   - Si el payload tiene "exp", verificar que no haya expirado
 *   - Devolver el payload decodificado si todo es válido
 */
export const jwtVerify = async (req, res) => {
  // TODO: Implementar
};

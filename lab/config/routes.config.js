// ============================================
// Configuración de rutas de la API
// Define los endpoints REST para operaciones criptográficas
// ============================================

import { Router } from "express";
import * as crypto from "../controllers/crypto.controllers.js";
import createHttpError from "http-errors";

const router = Router();

// --- Iteración 1: Hashing ---
router.post("/crypto/hash", crypto.hash);
router.post("/crypto/hmac", crypto.hmac);

// --- Iteración 2: Cifrado simétrico ---
router.post("/crypto/symmetric/encrypt", crypto.symmetricEncrypt);
router.post("/crypto/symmetric/decrypt", crypto.symmetricDecrypt);

// --- Iteración 3: Cifrado asimétrico ---
router.post("/crypto/asymmetric/keypair", crypto.generateKeyPair);
router.post("/crypto/asymmetric/encrypt", crypto.asymmetricEncrypt);
router.post("/crypto/asymmetric/decrypt", crypto.asymmetricDecrypt);

// --- Iteración 4: Firma digital ---
router.post("/crypto/sign", crypto.sign);
router.post("/crypto/verify", crypto.verify);

// --- Iteración 5: JWT ---
router.post("/crypto/jwt/create", crypto.jwtCreate);
router.post("/crypto/jwt/verify", crypto.jwtVerify);

// Middleware "catch-all" para rutas no definidas
router.use((req, res) => {
  throw new createHttpError(404, "Route Not Found");
});

export default router;

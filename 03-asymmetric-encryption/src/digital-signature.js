import { generateKeyPairSync, sign, verify, createHash } from "node:crypto";

console.log("=== Firma Digital con RSA ===\n");

// --- Generar par de claves ---
const { publicKey, privateKey } = generateKeyPairSync("rsa", {
  modulusLength: 2048,
});

// --- Firmar un mensaje ---
const mensaje = "Yo, el firmante, autorizo esta transacción por 10000 EUR";

const firma = sign("sha256", Buffer.from(mensaje, "utf8"), privateKey);

console.log("Mensaje:", mensaje);
console.log("Firma (base64):", firma.toString("base64").slice(0, 80) + "...");
console.log("Tamaño firma:", firma.length, "bytes\n");

// --- Verificar la firma ---
console.log("=== Verificación de Firma ===\n");

const esValida = verify(
  "sha256",
  Buffer.from(mensaje, "utf8"),
  publicKey,
  firma,
);

console.log(`Mensaje: "${mensaje}"`);
console.log(`¿Firma válida? ${esValida ? "Sí" : "No"}\n`);

// --- Verificar con mensaje alterado ---
console.log("=== Firma con mensaje alterado ===\n");

const mensajeAlterado =
  "Yo, el firmante, autorizo esta transacción por 99999 EUR";

const esValidaAlterado = verify(
  "sha256",
  Buffer.from(mensajeAlterado, "utf8"),
  publicKey,
  firma,
);

console.log(`Mensaje original:  "${mensaje}"`);
console.log(`Mensaje alterado:  "${mensajeAlterado}"`);
console.log(
  `¿Firma válida para mensaje alterado? ${esValidaAlterado ? "Sí" : "No"}\n`,
);

// --- Verificar con clave pública diferente ---
console.log("=== Verificación con clave diferente ===\n");

const { publicKey: otraPublicKey } = generateKeyPairSync("rsa", {
  modulusLength: 2048,
});

const esValidaOtraClave = verify(
  "sha256",
  Buffer.from(mensaje, "utf8"),
  otraPublicKey,
  firma,
);

console.log("Verificando con la clave pública de otra persona...");
console.log(`¿Firma válida? ${esValidaOtraClave ? "Sí" : "No"}`);
console.log("(Solo la clave pública del firmante puede verificar su firma)\n");

// --- Proceso completo: hash + firma ---
console.log("=== Proceso completo: Hash + Firma ===\n");
console.log(
  "En la práctica, se firma el HASH del documento, no el documento entero.\n",
);

const documento = `CONTRATO DE COMPRAVENTA
Fecha: 2024-01-15
Vendedor: Alice
Comprador: Bob
Importe: 50000 EUR
Descripción: Venta de propiedad en Madrid`;

// 1. Calcular hash del documento
const hashDocumento = createHash("sha256").update(documento).digest("hex");

console.log("Documento:");
console.log(documento);
console.log(`\nHash del documento: ${hashDocumento}`);

// 2. Firmar (internamente Node.js ya hashea antes de firmar)
const firmaDocumento = sign(
  "sha256",
  Buffer.from(documento, "utf8"),
  privateKey,
);
console.log(`Firma: ${firmaDocumento.toString("base64").slice(0, 60)}...`);

// 3. Verificar
const verificado = verify(
  "sha256",
  Buffer.from(documento, "utf8"),
  publicKey,
  firmaDocumento,
);
console.log(`\n¿Documento verificado? ${verificado ? "Sí" : "No"}`);
console.log("\nLa firma digital garantiza:");
console.log(
  "  - Autenticidad: El documento fue firmado por el dueño de la clave privada",
);
console.log(
  "  - Integridad: El documento no fue modificado después de firmarse",
);
console.log("  - No repudio: El firmante no puede negar haber firmado");

import { generateKeyPairSync } from "node:crypto";

console.log("=== Generación de Par de Claves RSA ===\n");

// --- Generar par de claves RSA-2048 ---
const { publicKey, privateKey } = generateKeyPairSync("rsa", {
  modulusLength: 2048,
});

// --- Exportar en formato PEM ---
const publicKeyPEM = publicKey.export({ type: "spki", format: "pem" });
const privateKeyPEM = privateKey.export({ type: "pkcs8", format: "pem" });

console.log("=== Clave Pública (PEM) ===");
console.log(publicKeyPEM);

console.log("=== Clave Privada (PEM) - Primeras líneas ===");
const lineasPrivada = privateKeyPEM.split("\n");
console.log(lineasPrivada.slice(0, 5).join("\n"));
console.log("... (truncada por seguridad) ...");
console.log(lineasPrivada.at(-2));
console.log(lineasPrivada.at(-1));

// --- Exportar en formato DER (binario) ---
console.log("\n=== Formato DER (binario) ===\n");

const publicKeyDER = publicKey.export({ type: "spki", format: "der" });
const privateKeyDER = privateKey.export({ type: "pkcs8", format: "der" });

console.log(
  "Clave pública DER (hex, primeros 64 chars):",
  publicKeyDER.toString("hex").slice(0, 64) + "...",
);
console.log("Tamaño clave pública DER:", publicKeyDER.length, "bytes");
console.log("Tamaño clave privada DER:", privateKeyDER.length, "bytes");

// --- Información sobre la clave ---
console.log("\n=== Información de la clave ===\n");

console.log("Tipo:", publicKey.type);
console.log("Algoritmo:", publicKey.asymmetricKeyType);
console.log("Tamaño: 2048 bits");
console.log("Tamaño clave pública PEM:", publicKeyPEM.length, "caracteres");
console.log("Tamaño clave privada PEM:", privateKeyPEM.length, "caracteres");

// --- Generar par de claves RSA-4096 ---
console.log("\n=== RSA-4096 (mayor seguridad) ===\n");

const inicio = Date.now();
generateKeyPairSync("rsa", {
  modulusLength: 4096,
});
const tiempoGeneracion = Date.now() - inicio;

console.log("Tamaño: 4096 bits");
console.log(`Tiempo de generación: ${tiempoGeneracion} ms`);
console.log("(RSA-4096 es más lento de generar y usar que RSA-2048)");

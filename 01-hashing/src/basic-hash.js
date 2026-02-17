import { createHash } from "node:crypto";

console.log("=== Funciones Hash Básicas ===\n");

// --- MD5 ---
const textoOriginal = "Hola, este es un mensaje de prueba";
const hashMD5 = createHash("md5").update(textoOriginal).digest("hex");
console.log("Texto original:", textoOriginal);
console.log("MD5:   ", hashMD5);

// --- SHA-256 ---
const hashSHA256 = createHash("sha256").update(textoOriginal).digest("hex");
console.log("SHA-256:", hashSHA256);

// --- SHA-512 ---
const hashSHA512 = createHash("sha512").update(textoOriginal).digest("hex");
console.log("SHA-512:", hashSHA512);

// --- Efecto avalancha ---
// Un cambio mínimo en la entrada produce un hash completamente diferente
console.log("\n=== Efecto Avalancha ===\n");

const texto1 = "Hola mundo";
const texto2 = "Hola Mundo"; // Solo cambia una letra (m → M)

const hash1 = createHash("sha256").update(texto1).digest("hex");
const hash2 = createHash("sha256").update(texto2).digest("hex");

console.log(`"${texto1}" → ${hash1}`);
console.log(`"${texto2}" → ${hash2}`);
console.log(`¿Son iguales? ${hash1 === hash2 ? "Sí" : "No"}`);

// --- Hash de datos binarios (Buffer) ---
console.log("\n=== Hash de datos binarios ===\n");

const buffer = Buffer.from([0x00, 0x01, 0x02, 0x03, 0xff]);
const hashBuffer = createHash("sha256").update(buffer).digest("hex");
console.log("Buffer:", buffer.toString("hex"));
console.log("SHA-256:", hashBuffer);

// --- Propiedad determinista ---
console.log("\n=== Propiedad Determinista ===\n");

const mensaje = "El mismo mensaje siempre produce el mismo hash";
const primerHash = createHash("sha256").update(mensaje).digest("hex");
const segundoHash = createHash("sha256").update(mensaje).digest("hex");

console.log("Primer hash: ", primerHash);
console.log("Segundo hash:", segundoHash);
console.log(`¿Son iguales? ${primerHash === segundoHash ? "Sí" : "No"}`);

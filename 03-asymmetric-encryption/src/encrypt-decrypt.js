import {
  generateKeyPairSync,
  publicEncrypt,
  privateDecrypt,
  constants,
} from "node:crypto";

console.log("=== Cifrado Asimétrico: RSA ===\n");

// --- Generar par de claves ---
const { publicKey, privateKey } = generateKeyPairSync("rsa", {
  modulusLength: 2048,
});

// --- Cifrar con clave pública ---
const mensajeOriginal =
  "Este mensaje solo lo puede leer el dueño de la clave privada";

const mensajeCifrado = publicEncrypt(
  {
    key: publicKey,
    padding: constants.RSA_PKCS1_OAEP_PADDING,
    oaepHash: "sha256",
  },
  Buffer.from(mensajeOriginal, "utf8"),
);

console.log("Texto plano:  ", mensajeOriginal);
console.log(
  "Texto cifrado (base64):",
  mensajeCifrado.toString("base64").slice(0, 80) + "...",
);
console.log("Tamaño cifrado:", mensajeCifrado.length, "bytes\n");

// --- Descifrar con clave privada ---
const mensajeDescifrado = privateDecrypt(
  {
    key: privateKey,
    padding: constants.RSA_PKCS1_OAEP_PADDING,
    oaepHash: "sha256",
  },
  mensajeCifrado,
);

console.log("Descifrado:", mensajeDescifrado.toString("utf8"));
console.log(
  `¿Coincide? ${mensajeOriginal === mensajeDescifrado.toString("utf8") ? "Sí" : "No"}\n`,
);

// --- Limitación de tamaño ---
console.log("=== Limitación de tamaño ===\n");
console.log("RSA-2048 con OAEP-SHA256 puede cifrar hasta ~190 bytes.");
console.log("Para datos más grandes, se usa cifrado híbrido.\n");

try {
  // Intentar cifrar un mensaje demasiado grande
  const mensajeGrande = "A".repeat(200);
  publicEncrypt(
    {
      key: publicKey,
      padding: constants.RSA_PKCS1_OAEP_PADDING,
      oaepHash: "sha256",
    },
    Buffer.from(mensajeGrande, "utf8"),
  );
  console.log("Cifrado exitoso (mensaje cabe en el límite)");
} catch (error) {
  console.log("Error al cifrar mensaje grande:", error.message);
}

// --- Cifrado híbrido (RSA + AES) ---
console.log("\n=== Cifrado Híbrido (RSA + AES) ===\n");

import { randomBytes, createCipheriv, createDecipheriv } from "node:crypto";

function cifradoHibrido(textoPlano, clavePublica) {
  // 1. Generar clave simétrica aleatoria (clave de sesión)
  const claveSesion = randomBytes(32); // AES-256
  const iv = randomBytes(12); // Para GCM

  // 2. Cifrar el mensaje con AES-GCM (rápido, sin límite de tamaño)
  const cipher = createCipheriv("aes-256-gcm", claveSesion, iv);
  let cifrado = cipher.update(textoPlano, "utf8", "hex");
  cifrado += cipher.final("hex");
  const authTag = cipher.getAuthTag();

  // 3. Cifrar la clave de sesión con RSA (solo 32 bytes)
  const claveSesionCifrada = publicEncrypt(
    {
      key: clavePublica,
      padding: constants.RSA_PKCS1_OAEP_PADDING,
      oaepHash: "sha256",
    },
    claveSesion,
  );

  return {
    claveSesionCifrada: claveSesionCifrada.toString("base64"),
    iv: iv.toString("hex"),
    cifrado,
    authTag: authTag.toString("hex"),
  };
}

function descifradoHibrido(datos, clavePrivada) {
  // 1. Descifrar la clave de sesión con RSA
  const claveSesion = privateDecrypt(
    {
      key: clavePrivada,
      padding: constants.RSA_PKCS1_OAEP_PADDING,
      oaepHash: "sha256",
    },
    Buffer.from(datos.claveSesionCifrada, "base64"),
  );

  // 2. Descifrar el mensaje con AES-GCM
  const decipher = createDecipheriv(
    "aes-256-gcm",
    claveSesion,
    Buffer.from(datos.iv, "hex"),
  );
  decipher.setAuthTag(Buffer.from(datos.authTag, "hex"));
  let descifrado = decipher.update(datos.cifrado, "hex", "utf8");
  descifrado += decipher.final("utf8");

  return descifrado;
}

const mensajeLargo =
  "Este es un mensaje mucho más largo que podría ser un documento completo, un archivo JSON, o cualquier dato de gran tamaño. El cifrado híbrido permite cifrar datos de cualquier tamaño de forma eficiente combinando RSA y AES.";

console.log("Mensaje original (largo):", mensajeLargo.slice(0, 60) + "...");
console.log("Tamaño:", mensajeLargo.length, "bytes\n");

const datosHibridos = cifradoHibrido(mensajeLargo, publicKey);
console.log(
  "Clave sesión cifrada (RSA):",
  datosHibridos.claveSesionCifrada.slice(0, 40) + "...",
);
console.log(
  "Mensaje cifrado (AES-GCM):",
  datosHibridos.cifrado.slice(0, 40) + "...\n",
);

const resultadoHibrido = descifradoHibrido(datosHibridos, privateKey);
console.log("Descifrado:", resultadoHibrido.slice(0, 60) + "...");
console.log(`¿Coincide? ${mensajeLargo === resultadoHibrido ? "Sí" : "No"}`);

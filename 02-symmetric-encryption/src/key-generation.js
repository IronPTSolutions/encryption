import { randomBytes, pbkdf2Sync } from "node:crypto";

console.log("=== Generación de Claves ===\n");

// --- Clave aleatoria ---
// Para AES-256 necesitamos una clave de 32 bytes (256 bits)
const claveAleatoria = randomBytes(32);

console.log("Clave aleatoria (hex):   ", claveAleatoria.toString("hex"));
console.log("Clave aleatoria (base64):", claveAleatoria.toString("base64"));
console.log(
  "Longitud:",
  claveAleatoria.length,
  "bytes =",
  claveAleatoria.length * 8,
  "bits\n",
);

// --- IV (Vector de Inicialización) ---
const ivCBC = randomBytes(16); // 16 bytes para CBC
const ivGCM = randomBytes(12); // 12 bytes para GCM

console.log("IV para CBC (16 bytes):", ivCBC.toString("hex"));
console.log("IV para GCM (12 bytes):", ivGCM.toString("hex"));

// --- Derivación de clave con PBKDF2 ---
console.log("\n=== Derivación de Clave con PBKDF2 ===\n");

const contraseña = "mi-contraseña-segura-2024";
const salt = randomBytes(16);
const iteraciones = 100_000;
const longitudClave = 32; // 256 bits para AES-256

const claveDerivada = pbkdf2Sync(
  contraseña,
  salt,
  iteraciones,
  longitudClave,
  "sha256",
);

console.log("Contraseña:        ", contraseña);
console.log("Salt (hex):        ", salt.toString("hex"));
console.log("Iteraciones:       ", iteraciones.toLocaleString());
console.log("Clave derivada:    ", claveDerivada.toString("hex"));
console.log("Longitud de clave: ", claveDerivada.length, "bytes\n");

// --- La misma contraseña + salt produce la misma clave ---
console.log("=== Determinismo con mismo salt ===\n");

const claveDerivada2 = pbkdf2Sync(
  contraseña,
  salt,
  iteraciones,
  longitudClave,
  "sha256",
);

console.log("Clave 1:", claveDerivada.toString("hex"));
console.log("Clave 2:", claveDerivada2.toString("hex"));
console.log(
  `¿Son iguales? ${claveDerivada.equals(claveDerivada2) ? "Sí" : "No"}\n`,
);

// --- Salt diferente produce clave diferente ---
console.log("=== Salt diferente = Clave diferente ===\n");

const saltDiferente = randomBytes(16);
const claveDerivada3 = pbkdf2Sync(
  contraseña,
  saltDiferente,
  iteraciones,
  longitudClave,
  "sha256",
);

console.log("Salt 1:", salt.toString("hex"));
console.log("Salt 2:", saltDiferente.toString("hex"));
console.log("Clave con salt 1:", claveDerivada.toString("hex"));
console.log("Clave con salt 2:", claveDerivada3.toString("hex"));
console.log(
  `¿Son iguales? ${claveDerivada.equals(claveDerivada3) ? "Sí" : "No"}`,
);

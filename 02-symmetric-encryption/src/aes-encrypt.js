import { createCipheriv, createDecipheriv, randomBytes } from "node:crypto";

console.log("=== Cifrado Simétrico: AES-256-CBC ===\n");

// --- Configuración ---
const algoritmo = "aes-256-cbc";
const clave = randomBytes(32); // 256 bits
const iv = randomBytes(16); // 128 bits (tamaño de bloque AES)

// --- Cifrar ---
function cifrar(textoPlano, clave, iv) {
  const cipher = createCipheriv(algoritmo, clave, iv);
  let cifrado = cipher.update(textoPlano, "utf8", "hex");
  cifrado += cipher.final("hex");
  return cifrado;
}

// --- Descifrar ---
function descifrar(textoCifrado, clave, iv) {
  const decipher = createDecipheriv(algoritmo, clave, iv);
  let descifrado = decipher.update(textoCifrado, "hex", "utf8");
  descifrado += decipher.final("utf8");
  return descifrado;
}

// --- Ejemplo básico ---
const mensajeOriginal = "Este es un mensaje secreto que queremos proteger";

console.log("Texto plano:  ", mensajeOriginal);
console.log("Clave (hex):  ", clave.toString("hex"));
console.log("IV (hex):     ", iv.toString("hex"));

const textoCifrado = cifrar(mensajeOriginal, clave, iv);
console.log("Texto cifrado:", textoCifrado);

const textoDescifrado = descifrar(textoCifrado, clave, iv);
console.log("Descifrado:   ", textoDescifrado);
console.log(
  `¿Coincide? ${mensajeOriginal === textoDescifrado ? "Sí" : "No"}\n`,
);

// --- El mismo mensaje cifrado con diferente IV produce resultado diferente ---
console.log("=== Mismo mensaje, diferente IV ===\n");

const iv2 = randomBytes(16);
const cifrado1 = cifrar(mensajeOriginal, clave, iv);
const cifrado2 = cifrar(mensajeOriginal, clave, iv2);

console.log("IV 1:", iv.toString("hex"));
console.log("IV 2:", iv2.toString("hex"));
console.log("Cifrado con IV 1:", cifrado1);
console.log("Cifrado con IV 2:", cifrado2);
console.log(`¿Son iguales? ${cifrado1 === cifrado2 ? "Sí" : "No"}\n`);

// --- Formato práctico: IV + texto cifrado ---
console.log("=== Formato práctico para transmisión ===\n");
console.log("En la práctica, el IV se envía junto al texto cifrado:");
console.log("El IV no es secreto, solo debe ser único por cada cifrado.\n");

function cifrarConIV(textoPlano, clave) {
  const ivLocal = randomBytes(16);
  const cipher = createCipheriv(algoritmo, clave, ivLocal);
  let cifrado = cipher.update(textoPlano, "utf8", "hex");
  cifrado += cipher.final("hex");
  // Concatenamos IV + texto cifrado
  return ivLocal.toString("hex") + ":" + cifrado;
}

function descifrarConIV(paquete, clave) {
  const [ivHex, textoCifrado] = paquete.split(":");
  const ivLocal = Buffer.from(ivHex, "hex");
  const decipher = createDecipheriv(algoritmo, clave, ivLocal);
  let descifrado = decipher.update(textoCifrado, "hex", "utf8");
  descifrado += decipher.final("utf8");
  return descifrado;
}

const paqueteCifrado = cifrarConIV("Mensaje confidencial", clave);
console.log("Paquete (IV:cifrado):", paqueteCifrado);

const resultado = descifrarConIV(paqueteCifrado, clave);
console.log("Descifrado:         ", resultado);

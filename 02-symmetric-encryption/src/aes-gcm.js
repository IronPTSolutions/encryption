import { createCipheriv, createDecipheriv, randomBytes } from "node:crypto";

console.log("=== Cifrado Autenticado: AES-256-GCM ===\n");

const algoritmo = "aes-256-gcm";
const clave = randomBytes(32);

// --- Cifrar con GCM ---
function cifrarGCM(textoPlano, clave) {
  const iv = randomBytes(12); // 96 bits recomendado para GCM
  const cipher = createCipheriv(algoritmo, clave, iv);

  let cifrado = cipher.update(textoPlano, "utf8", "hex");
  cifrado += cipher.final("hex");

  // GCM produce un authentication tag
  const authTag = cipher.getAuthTag();

  return {
    iv: iv.toString("hex"),
    cifrado,
    authTag: authTag.toString("hex"),
  };
}

// --- Descifrar con GCM ---
function descifrarGCM(datos, clave) {
  const decipher = createDecipheriv(
    algoritmo,
    clave,
    Buffer.from(datos.iv, "hex"),
  );

  // Se debe establecer el authTag antes de descifrar
  decipher.setAuthTag(Buffer.from(datos.authTag, "hex"));

  let descifrado = decipher.update(datos.cifrado, "hex", "utf8");
  descifrado += decipher.final("utf8");

  return descifrado;
}

// --- Ejemplo básico ---
const mensaje = "Datos bancarios: cuenta ES12-3456, saldo 50000 EUR";

console.log("Texto plano:", mensaje);

const datosCifrados = cifrarGCM(mensaje, clave);
console.log("\nResultado del cifrado:");
console.log("  IV:       ", datosCifrados.iv);
console.log("  Cifrado:  ", datosCifrados.cifrado);
console.log("  Auth Tag: ", datosCifrados.authTag);

const descifrado = descifrarGCM(datosCifrados, clave);
console.log("\nDescifrado:", descifrado);
console.log(`¿Coincide? ${mensaje === descifrado ? "Sí" : "No"}`);

// --- Detección de manipulación ---
console.log("\n=== Detección de manipulación ===\n");
console.log("GCM detecta si el texto cifrado fue alterado.\n");

const datosManipulados = {
  ...datosCifrados,
  // Modificamos un carácter del texto cifrado
  cifrado: "ff" + datosCifrados.cifrado.slice(2),
};

try {
  descifrarGCM(datosManipulados, clave);
  console.log("Descifrado exitoso (no debería llegar aquí)");
} catch (error) {
  console.log("Error al descifrar datos manipulados:");
  console.log(`  ${error.message}`);
  console.log("  GCM detectó que los datos fueron alterados.");
}

// --- AAD (Additional Authenticated Data) ---
console.log("\n=== AAD (Datos Adicionales Autenticados) ===\n");
console.log("GCM permite autenticar datos adicionales sin cifrarlos.");
console.log("Útil para proteger metadatos (headers, IDs, etc.)\n");

function cifrarConAAD(textoPlano, clave, datosAdicionales) {
  const iv = randomBytes(12);
  const cipher = createCipheriv(algoritmo, clave, iv);

  // AAD se autentica pero no se cifra
  cipher.setAAD(Buffer.from(datosAdicionales, "utf8"));

  let cifrado = cipher.update(textoPlano, "utf8", "hex");
  cifrado += cipher.final("hex");

  return {
    iv: iv.toString("hex"),
    cifrado,
    authTag: cipher.getAuthTag().toString("hex"),
    aad: datosAdicionales,
  };
}

function descifrarConAAD(datos, clave) {
  const decipher = createDecipheriv(
    algoritmo,
    clave,
    Buffer.from(datos.iv, "hex"),
  );

  decipher.setAAD(Buffer.from(datos.aad, "utf8"));
  decipher.setAuthTag(Buffer.from(datos.authTag, "hex"));

  let descifrado = decipher.update(datos.cifrado, "hex", "utf8");
  descifrado += decipher.final("utf8");
  return descifrado;
}

const aad = "usuario:admin;accion:transferencia";
const datosConAAD = cifrarConAAD("Transferir 5000 EUR", clave, aad);

console.log("AAD (no cifrado):", datosConAAD.aad);
console.log("Texto cifrado:   ", datosConAAD.cifrado);

const resultadoAAD = descifrarConAAD(datosConAAD, clave);
console.log("Descifrado:      ", resultadoAAD);

// Si alguien modifica el AAD, la autenticación falla
const datosAADManipulado = {
  ...datosConAAD,
  aad: "usuario:hacker;accion:robo",
};

try {
  descifrarConAAD(datosAADManipulado, clave);
} catch {
  console.log("\nAAD manipulado detectado: la autenticación falló.");
}

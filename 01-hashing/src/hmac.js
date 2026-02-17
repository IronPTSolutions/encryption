import { createHmac, timingSafeEqual } from "node:crypto";

console.log("=== HMAC (Hash-based Message Authentication Code) ===\n");

// --- Crear un HMAC ---
const claveSecreta = "mi-clave-super-secreta-2024";
const mensaje = "Este mensaje debe ser autenticado";

const hmac = createHmac("sha256", claveSecreta).update(mensaje).digest("hex");

console.log("Mensaje:", mensaje);
console.log("Clave:  ", claveSecreta);
console.log("HMAC:   ", hmac);

// --- Verificar un HMAC ---
// El receptor calcula el HMAC con la misma clave y compara
console.log("\n=== Verificación de HMAC ===\n");

function verificarHMAC(mensaje, claveSecreta, hmacRecibido) {
  const hmacCalculado = createHmac("sha256", claveSecreta)
    .update(mensaje)
    .digest();

  const hmacRecibidoBuffer = Buffer.from(hmacRecibido, "hex");

  // Usar timingSafeEqual para evitar ataques de timing
  // Ambos buffers deben tener el mismo tamaño
  if (hmacCalculado.length !== hmacRecibidoBuffer.length) {
    return false;
  }

  return timingSafeEqual(hmacCalculado, hmacRecibidoBuffer);
}

const esValido = verificarHMAC(mensaje, claveSecreta, hmac);
console.log(`Mensaje: "${mensaje}"`);
console.log(`HMAC recibido: ${hmac}`);
console.log(`¿Es válido? ${esValido ? "Sí" : "No"}`);

// --- HMAC con mensaje alterado ---
console.log("\n=== HMAC con mensaje alterado ===\n");

const mensajeAlterado = "Este mensaje ha sido modificado";
const esValidoAlterado = verificarHMAC(mensajeAlterado, claveSecreta, hmac);

console.log(`Mensaje alterado: "${mensajeAlterado}"`);
console.log(`HMAC original:    ${hmac}`);
console.log(`¿Es válido? ${esValidoAlterado ? "Sí" : "No"}`);

// --- HMAC con clave incorrecta ---
console.log("\n=== HMAC con clave incorrecta ===\n");

const claveIncorrecta = "clave-equivocada";
const esValidoClaveIncorrecta = verificarHMAC(mensaje, claveIncorrecta, hmac);

console.log(`Mensaje original: "${mensaje}"`);
console.log(`Clave incorrecta: "${claveIncorrecta}"`);
console.log(`¿Es válido? ${esValidoClaveIncorrecta ? "Sí" : "No"}`);

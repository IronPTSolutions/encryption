import { createHash } from "node:crypto";

console.log("=== Verificación de Integridad ===\n");

// Simulamos un escenario donde un emisor envía un mensaje con su hash,
// y el receptor verifica que el mensaje no fue alterado.

function calcularHash(datos) {
  return createHash("sha256").update(datos).digest("hex");
}

// --- El emisor prepara el mensaje ---
const mensajeOriginal = "Transferir 1000 EUR a la cuenta ES12-3456-7890";
const hashOriginal = calcularHash(mensajeOriginal);

console.log("=== EMISOR ===");
console.log("Mensaje:", mensajeOriginal);
console.log("Hash:   ", hashOriginal);
console.log("(Envía ambos al receptor)\n");

// --- Caso 1: El mensaje llega intacto ---
console.log("=== RECEPTOR - Caso 1: Mensaje intacto ===");

const mensajeRecibido1 = "Transferir 1000 EUR a la cuenta ES12-3456-7890";
const hashRecibido1 = calcularHash(mensajeRecibido1);

console.log("Mensaje recibido:", mensajeRecibido1);
console.log("Hash calculado:  ", hashRecibido1);
console.log("Hash esperado:   ", hashOriginal);
console.log(
  `Integridad: ${hashRecibido1 === hashOriginal ? "VERIFICADA" : "COMPROMETIDA"}\n`,
);

// --- Caso 2: El mensaje fue alterado ---
console.log("=== RECEPTOR - Caso 2: Mensaje alterado ===");

const mensajeRecibido2 = "Transferir 9999 EUR a la cuenta ES99-0000-0000";
const hashRecibido2 = calcularHash(mensajeRecibido2);

console.log("Mensaje recibido:", mensajeRecibido2);
console.log("Hash calculado:  ", hashRecibido2);
console.log("Hash esperado:   ", hashOriginal);
console.log(
  `Integridad: ${hashRecibido2 === hashOriginal ? "VERIFICADA" : "COMPROMETIDA"}\n`,
);

// --- Nota sobre limitaciones ---
console.log("=== Nota importante ===");
console.log("Un hash solo verifica INTEGRIDAD, no AUTENTICIDAD.");
console.log("Un atacante podría alterar tanto el mensaje como el hash.");
console.log(
  "Para garantizar autenticidad, se necesita HMAC o una firma digital.",
);

import { createHmac, createSign } from "node:crypto";

console.log("=== Creación de JSON Web Tokens ===\n");

// --- Función auxiliar para codificar en Base64URL ---
function base64UrlEncode(data) {
  const base64 = Buffer.from(JSON.stringify(data)).toString("base64");
  return base64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
}

// --- 1. Crear un JWT manualmente con HMAC-SHA256 (HS256) ---
console.log("=== JWT con HS256 (HMAC-SHA256) ===\n");

const header = {
  alg: "HS256",
  typ: "JWT",
};

const payload = {
  sub: "1234567890",
  name: "Juan Pérez",
  email: "juan@example.com",
  role: "admin",
  iat: Math.floor(Date.now() / 1000), // Issued at (timestamp actual)
  exp: Math.floor(Date.now() / 1000) + 3600, // Expira en 1 hora
};

const secret = "mi-secreto-super-seguro-que-nadie-debe-conocer";

// Codificar header y payload
const encodedHeader = base64UrlEncode(header);
const encodedPayload = base64UrlEncode(payload);

// Crear la firma
const signatureInput = `${encodedHeader}.${encodedPayload}`;
const signature = createHmac("sha256", secret)
  .update(signatureInput)
  .digest("base64")
  .replace(/\+/g, "-")
  .replace(/\//g, "_")
  .replace(/=/g, "");

// Construir el token completo
const token = `${encodedHeader}.${encodedPayload}.${signature}`;

console.log("Header:", JSON.stringify(header, null, 2));
console.log("\nPayload:", JSON.stringify(payload, null, 2));
console.log("\nToken JWT completo:");
console.log(token);
console.log("\nLongitud del token:", token.length, "caracteres");

// --- 2. Decodificar un JWT (sin verificar) ---
console.log("\n=== Decodificar JWT (sin verificar firma) ===\n");

function decodeJWT(token) {
  const [header, payload, signature] = token.split(".");

  const decodedHeader = JSON.parse(
    Buffer.from(header, "base64url").toString("utf-8"),
  );
  const decodedPayload = JSON.parse(
    Buffer.from(payload, "base64url").toString("utf-8"),
  );

  return { header: decodedHeader, payload: decodedPayload, signature };
}

const decoded = decodeJWT(token);
console.log("Header decodificado:", JSON.stringify(decoded.header, null, 2));
console.log(
  "\nPayload decodificado:",
  JSON.stringify(decoded.payload, null, 2),
);
console.log("\nFirma:", decoded.signature);

// --- 3. JWT con diferentes tiempos de expiración ---
console.log("\n=== JWT con diferentes expiraciones ===\n");

const tiemposExpiracion = {
  "5 minutos": 300,
  "1 hora": 3600,
  "1 día": 86400,
  "7 días": 604800,
};

for (const [descripcion, segundos] of Object.entries(tiemposExpiracion)) {
  const payloadTemp = {
    sub: "user123",
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + segundos,
  };

  const encodedPayloadTemp = base64UrlEncode(payloadTemp);
  const signatureInputTemp = `${encodedHeader}.${encodedPayloadTemp}`;
  const signatureTemp = createHmac("sha256", secret)
    .update(signatureInputTemp)
    .digest("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=/g, "");

  const tokenTemp = `${encodedHeader}.${encodedPayloadTemp}.${signatureTemp}`;

  console.log(`Token con expiración de ${descripcion}:`);
  console.log(tokenTemp.substring(0, 80) + "...");
  console.log(
    `Expira el: ${new Date(payloadTemp.exp * 1000).toLocaleString("es-ES")}\n`,
  );
}

// --- 4. JWT con claims personalizados ---
console.log("=== JWT con claims personalizados ===\n");

const payloadCustom = {
  // Claims estándar
  iss: "https://mi-app.com", // Issuer
  sub: "user123", // Subject
  aud: "https://api.mi-app.com", // Audience
  exp: Math.floor(Date.now() / 1000) + 3600,
  iat: Math.floor(Date.now() / 1000),
  jti: "token-" + crypto.randomUUID(), // JWT ID

  // Claims personalizados
  username: "juanperez",
  role: "admin",
  permissions: ["read", "write", "delete"],
  department: "IT",
};

const encodedPayloadCustom = base64UrlEncode(payloadCustom);
const signatureInputCustom = `${encodedHeader}.${encodedPayloadCustom}`;
const signatureCustom = createHmac("sha256", secret)
  .update(signatureInputCustom)
  .digest("base64")
  .replace(/\+/g, "-")
  .replace(/\//g, "_")
  .replace(/=/g, "");

const tokenCustom = `${encodedHeader}.${encodedPayloadCustom}.${signatureCustom}`;

console.log("Payload con claims personalizados:");
console.log(JSON.stringify(payloadCustom, null, 2));
console.log("\nToken generado:");
console.log(tokenCustom);

console.log("\n✅ Tokens JWT creados correctamente");
console.log(
  "💡 Visita https://jwt.io para inspeccionar estos tokens visualmente",
);

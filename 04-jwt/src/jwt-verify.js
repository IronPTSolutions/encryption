import { createHmac } from "node:crypto";

console.log("=== Verificación de JSON Web Tokens ===\n");

// --- Función auxiliar para codificar en Base64URL ---
function base64UrlEncode(data) {
  const base64 = Buffer.from(JSON.stringify(data)).toString("base64");
  return base64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
}

// --- Función para verificar JWT ---
function verifyJWT(token, secret) {
  try {
    // Dividir el token en sus partes
    const [encodedHeader, encodedPayload, receivedSignature] = token.split(".");

    if (!encodedHeader || !encodedPayload || !receivedSignature) {
      return { valid: false, error: "Token malformado" };
    }

    // Decodificar header y payload
    const header = JSON.parse(
      Buffer.from(encodedHeader, "base64url").toString("utf-8"),
    );
    const payload = JSON.parse(
      Buffer.from(encodedPayload, "base64url").toString("utf-8"),
    );

    // Verificar que el algoritmo sea HS256
    if (header.alg !== "HS256") {
      return { valid: false, error: `Algoritmo no soportado: ${header.alg}` };
    }

    // Recalcular la firma
    const signatureInput = `${encodedHeader}.${encodedPayload}`;
    const expectedSignature = createHmac("sha256", secret)
      .update(signatureInput)
      .digest("base64")
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=/g, "");

    // Comparar firmas
    if (receivedSignature !== expectedSignature) {
      return { valid: false, error: "Firma inválida" };
    }

    // Verificar expiración
    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
      return { valid: false, error: "Token expirado" };
    }

    // Verificar nbf (not before)
    if (payload.nbf && payload.nbf > Math.floor(Date.now() / 1000)) {
      return { valid: false, error: "Token aún no es válido" };
    }

    return {
      valid: true,
      header,
      payload,
    };
  } catch (error) {
    return { valid: false, error: error.message };
  }
}

// --- 1. Crear un token válido ---
console.log("=== Crear token válido ===\n");

const secret = "mi-secreto-super-seguro-que-nadie-debe-conocer";

const header = { alg: "HS256", typ: "JWT" };
const payload = {
  sub: "user123",
  name: "Juan Pérez",
  role: "admin",
  iat: Math.floor(Date.now() / 1000),
  exp: Math.floor(Date.now() / 1000) + 3600, // Expira en 1 hora
};

const encodedHeader = base64UrlEncode(header);
const encodedPayload = base64UrlEncode(payload);
const signatureInput = `${encodedHeader}.${encodedPayload}`;
const signature = createHmac("sha256", secret)
  .update(signatureInput)
  .digest("base64")
  .replace(/\+/g, "-")
  .replace(/\//g, "_")
  .replace(/=/g, "");

const validToken = `${encodedHeader}.${encodedPayload}.${signature}`;

console.log("Token creado:", validToken);

// --- 2. Verificar token válido ---
console.log("\n=== Verificar token válido ===\n");

const result1 = verifyJWT(validToken, secret);
if (result1.valid) {
  console.log("✅ Token válido");
  console.log("Payload:", JSON.stringify(result1.payload, null, 2));
} else {
  console.log("❌ Token inválido:", result1.error);
}

// --- 3. Intentar verificar con secreto incorrecto ---
console.log("\n=== Verificar con secreto incorrecto ===\n");

const wrongSecret = "secreto-incorrecto";
const result2 = verifyJWT(validToken, wrongSecret);
console.log("❌ Token inválido:", result2.error);

// --- 4. Token manipulado (payload alterado) ---
console.log("\n=== Token manipulado ===\n");

// Modificar el payload para cambiar el rol
const tamperedPayload = { ...payload, role: "superadmin" };
const encodedTamperedPayload = base64UrlEncode(tamperedPayload);
const tamperedToken = `${encodedHeader}.${encodedTamperedPayload}.${signature}`;

console.log("Token con payload modificado:", tamperedToken);
const result3 = verifyJWT(tamperedToken, secret);
console.log("❌ Token inválido:", result3.error);

// --- 5. Token expirado ---
console.log("\n=== Token expirado ===\n");

const expiredPayload = {
  sub: "user123",
  iat: Math.floor(Date.now() / 1000) - 7200, // Emitido hace 2 horas
  exp: Math.floor(Date.now() / 1000) - 3600, // Expiró hace 1 hora
};

const encodedExpiredPayload = base64UrlEncode(expiredPayload);
const expiredSignatureInput = `${encodedHeader}.${encodedExpiredPayload}`;
const expiredSignature = createHmac("sha256", secret)
  .update(expiredSignatureInput)
  .digest("base64")
  .replace(/\+/g, "-")
  .replace(/\//g, "_")
  .replace(/=/g, "");

const expiredToken = `${encodedHeader}.${encodedExpiredPayload}.${expiredSignature}`;

console.log("Token expirado:", expiredToken);
const result4 = verifyJWT(expiredToken, secret);
console.log("❌ Token inválido:", result4.error);
console.log(
  `   Expiró el: ${new Date(expiredPayload.exp * 1000).toLocaleString("es-ES")}`,
);

// --- 6. Token malformado ---
console.log("\n=== Token malformado ===\n");

const malformedTokens = [
  "solo.dos.partes",
  "cuatro.partes.en.el.token",
  "invalid-base64!@#$%.invalid-base64!@#$%.invalid-base64!@#$%",
  "",
];

malformedTokens.forEach((token, i) => {
  const result = verifyJWT(token, secret);
  console.log(`Token ${i + 1}:`, token || "(vacío)");
  console.log(`❌ ${result.error}\n`);
});

// --- 7. Verificar claims personalizados ---
console.log("=== Verificar claims específicos ===\n");

function verifyCustomClaims(token, secret, requiredClaims) {
  const result = verifyJWT(token, secret);

  if (!result.valid) {
    return result;
  }

  const { payload } = result;

  // Verificar issuer
  if (requiredClaims.iss && payload.iss !== requiredClaims.iss) {
    return {
      valid: false,
      error: `Issuer inválido: esperado ${requiredClaims.iss}, recibido ${payload.iss}`,
    };
  }

  // Verificar audience
  if (requiredClaims.aud && payload.aud !== requiredClaims.aud) {
    return {
      valid: false,
      error: `Audience inválido: esperado ${requiredClaims.aud}, recibido ${payload.aud}`,
    };
  }

  // Verificar rol
  if (requiredClaims.role && payload.role !== requiredClaims.role) {
    return {
      valid: false,
      error: `Rol insuficiente: se requiere ${requiredClaims.role}`,
    };
  }

  return { valid: true, payload };
}

// Token con claims específicos
const customPayload = {
  sub: "user123",
  iss: "https://mi-app.com",
  aud: "https://api.mi-app.com",
  role: "user",
  iat: Math.floor(Date.now() / 1000),
  exp: Math.floor(Date.now() / 1000) + 3600,
};

const encodedCustomPayload = base64UrlEncode(customPayload);
const customSignatureInput = `${encodedHeader}.${encodedCustomPayload}`;
const customSignature = createHmac("sha256", secret)
  .update(customSignatureInput)
  .digest("base64")
  .replace(/\+/g, "-")
  .replace(/\//g, "_")
  .replace(/=/g, "");

const customToken = `${encodedHeader}.${encodedCustomPayload}.${customSignature}`;

// Verificar con claims correctos
console.log("Verificando claims correctos:");
const result5 = verifyCustomClaims(customToken, secret, {
  iss: "https://mi-app.com",
  aud: "https://api.mi-app.com",
  role: "user",
});
console.log(result5.valid ? "✅ Claims válidos" : `❌ ${result5.error}`);

// Verificar con rol insuficiente
console.log("\nVerificando rol insuficiente:");
const result6 = verifyCustomClaims(customToken, secret, {
  role: "admin",
});
console.log(result6.valid ? "✅ Claims válidos" : `❌ ${result6.error}`);

console.log("\n✅ Ejemplos de verificación completados");

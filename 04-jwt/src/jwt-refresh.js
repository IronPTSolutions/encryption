import { createHmac, randomBytes } from "node:crypto";

console.log("=== Access Tokens y Refresh Tokens ===\n");

// --- Función auxiliar para codificar en Base64URL ---
function base64UrlEncode(data) {
  const base64 = Buffer.from(JSON.stringify(data)).toString("base64");
  return base64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
}

// --- Función para crear JWT ---
function createJWT(payload, secret) {
  const header = { alg: "HS256", typ: "JWT" };

  const encodedHeader = base64UrlEncode(header);
  const encodedPayload = base64UrlEncode(payload);
  const signatureInput = `${encodedHeader}.${encodedPayload}`;
  const signature = createHmac("sha256", secret)
    .update(signatureInput)
    .digest("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=/g, "");

  return `${encodedHeader}.${encodedPayload}.${signature}`;
}

// --- Función para verificar JWT ---
function verifyJWT(token, secret) {
  try {
    const [encodedHeader, encodedPayload, receivedSignature] = token.split(".");

    const header = JSON.parse(
      Buffer.from(encodedHeader, "base64url").toString("utf-8"),
    );
    const payload = JSON.parse(
      Buffer.from(encodedPayload, "base64url").toString("utf-8"),
    );

    const signatureInput = `${encodedHeader}.${encodedPayload}`;
    const expectedSignature = createHmac("sha256", secret)
      .update(signatureInput)
      .digest("base64")
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=/g, "");

    if (receivedSignature !== expectedSignature) {
      return { valid: false, error: "Firma inválida" };
    }

    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
      return { valid: false, error: "Token expirado", expired: true };
    }

    return { valid: true, payload };
  } catch (error) {
    return { valid: false, error: error.message };
  }
}

// --- Sistema de tokens ---
const ACCESS_SECRET = "access-token-secret-key";
const REFRESH_SECRET = "refresh-token-secret-key";
const ACCESS_EXPIRY = 900; // 15 minutos
const REFRESH_EXPIRY = 604800; // 7 días

// Base de datos simulada de refresh tokens (en producción esto estaría en una BD)
const refreshTokenStore = new Set();

// --- 1. Login: Generar access token y refresh token ---
console.log("=== 1. Login del usuario ===\n");

function login(userId, username, role) {
  const now = Math.floor(Date.now() / 1000);

  // Access Token (vida corta)
  const accessPayload = {
    sub: userId,
    username: username,
    role: role,
    type: "access",
    iat: now,
    exp: now + ACCESS_EXPIRY,
  };
  const accessToken = createJWT(accessPayload, ACCESS_SECRET);

  // Refresh Token (vida larga, con identificador único)
  const refreshTokenId = randomBytes(32).toString("hex");
  const refreshPayload = {
    sub: userId,
    jti: refreshTokenId,
    type: "refresh",
    iat: now,
    exp: now + REFRESH_EXPIRY,
  };
  const refreshToken = createJWT(refreshPayload, REFRESH_SECRET);

  // Guardar el refresh token en la "base de datos"
  refreshTokenStore.add(refreshTokenId);

  return { accessToken, refreshToken, refreshTokenId };
}

const user = {
  id: "user123",
  username: "juanperez",
  role: "admin",
};

const tokens = login(user.id, user.username, user.role);

console.log("Usuario autenticado:", user.username);
console.log("\nAccess Token (expira en 15 min):");
console.log(tokens.accessToken);
console.log("\nRefresh Token (expira en 7 días):");
console.log(tokens.refreshToken);
console.log("\nRefresh Token ID almacenado:", tokens.refreshTokenId);

// --- 2. Uso del access token ---
console.log("\n=== 2. Hacer petición con Access Token ===\n");

function authenticatedRequest(accessToken) {
  const result = verifyJWT(accessToken, ACCESS_SECRET);

  if (!result.valid) {
    return { success: false, error: result.error };
  }

  return {
    success: true,
    message: "Petición autorizada",
    user: result.payload,
  };
}

const request1 = authenticatedRequest(tokens.accessToken);
if (request1.success) {
  console.log("✅", request1.message);
  console.log("Usuario:", request1.user.username);
  console.log("Rol:", request1.user.role);
} else {
  console.log("❌ Error:", request1.error);
}

// --- 3. Access token expirado, usar refresh token ---
console.log("\n=== 3. Access Token expirado ===\n");

// Simular un access token expirado
const expiredAccessPayload = {
  sub: user.id,
  username: user.username,
  role: user.role,
  type: "access",
  iat: Math.floor(Date.now() / 1000) - 3600,
  exp: Math.floor(Date.now() / 1000) - 1800,
};
const expiredAccessToken = createJWT(expiredAccessPayload, ACCESS_SECRET);

const request2 = authenticatedRequest(expiredAccessToken);
console.log("❌ Error:", request2.error);

// --- 4. Renovar access token con refresh token ---
console.log("\n=== 4. Renovar Access Token ===\n");

function refreshAccessToken(refreshToken) {
  // Verificar el refresh token
  const result = verifyJWT(refreshToken, REFRESH_SECRET);

  if (!result.valid) {
    return { success: false, error: result.error };
  }

  // Verificar que el token no ha sido revocado
  if (!refreshTokenStore.has(result.payload.jti)) {
    return { success: false, error: "Refresh token revocado" };
  }

  // Verificar que sea un refresh token
  if (result.payload.type !== "refresh") {
    return { success: false, error: "Token inválido" };
  }

  // Generar nuevo access token
  const now = Math.floor(Date.now() / 1000);
  const newAccessPayload = {
    sub: result.payload.sub,
    username: user.username, // En producción, buscar en BD por sub
    role: user.role,
    type: "access",
    iat: now,
    exp: now + ACCESS_EXPIRY,
  };
  const newAccessToken = createJWT(newAccessPayload, ACCESS_SECRET);

  return { success: true, accessToken: newAccessToken };
}

const refreshResult = refreshAccessToken(tokens.refreshToken);
if (refreshResult.success) {
  console.log("✅ Nuevo access token generado");
  console.log("Token:", refreshResult.accessToken);

  // Usar el nuevo token
  const request3 = authenticatedRequest(refreshResult.accessToken);
  console.log("\n✅ Petición con nuevo token:", request3.message);
} else {
  console.log("❌ Error:", refreshResult.error);
}

// --- 5. Revocar refresh token (logout) ---
console.log("\n=== 5. Logout - Revocar Refresh Token ===\n");

function logout(refreshToken) {
  const result = verifyJWT(refreshToken, REFRESH_SECRET);

  if (!result.valid) {
    return { success: false, error: result.error };
  }

  // Eliminar el token de la store
  refreshTokenStore.delete(result.payload.jti);

  return { success: true, message: "Sesión cerrada" };
}

const logoutResult = logout(tokens.refreshToken);
console.log("✅", logoutResult.message);
console.log("Refresh tokens activos:", refreshTokenStore.size);

// --- 6. Intentar renovar con token revocado ---
console.log("\n=== 6. Intentar renovar con token revocado ===\n");

const refreshResult2 = refreshAccessToken(tokens.refreshToken);
console.log("❌ Error:", refreshResult2.error);

// --- 7. Resumen de la estrategia ---
console.log("\n=== Resumen de la estrategia ===\n");

console.log("📋 Estrategia de tokens:");
console.log("┌─────────────────┬──────────────┬─────────────────────────────┐");
console.log("│ Tipo            │ Expiración   │ Propósito                   │");
console.log("├─────────────────┼──────────────┼─────────────────────────────┤");
console.log("│ Access Token    │ 15 minutos   │ Autorizar peticiones        │");
console.log("│ Refresh Token   │ 7 días       │ Renovar access tokens       │");
console.log("└─────────────────┴──────────────┴─────────────────────────────┘");

console.log("\n🔄 Flujo típico:");
console.log("1. Login → Servidor emite access + refresh token");
console.log("2. Cliente almacena ambos tokens");
console.log("3. Cliente usa access token en cada petición");
console.log("4. Access token expira → Cliente usa refresh token");
console.log("5. Servidor valida refresh → Emite nuevo access token");
console.log("6. Logout → Servidor revoca refresh token");

console.log("\n🔐 Ventajas de seguridad:");
console.log(
  "• Access token: Vida corta → Menor ventana de riesgo si se compromete",
);
console.log(
  "• Refresh token: Almacenado en httpOnly cookie → No accesible desde JS",
);
console.log("• Refresh token: Revocable → Logout real del lado del servidor");
console.log("• Separación de responsabilidades → Menor superficie de ataque");

console.log("\n✅ Ejemplos completados");

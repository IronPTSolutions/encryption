# JSON Web Tokens (JWT)

## ¿Qué es un JWT?

Un **JSON Web Token (JWT)** es un estándar abierto ([RFC 7519](https://tools.ietf.org/html/rfc7519)) que define un formato compacto y autónomo para transmitir información de forma segura entre partes como un objeto JSON. Esta información puede ser verificada y confiable porque está firmada digitalmente.

```
Header.Payload.Signature
```

Un JWT consta de tres partes separadas por puntos (`.`):

1. **Header** (Cabecera): Tipo de token y algoritmo de firma
2. **Payload** (Carga útil): Los datos (claims) que queremos transmitir
3. **Signature** (Firma): Garantiza que el token no ha sido alterado

## Estructura de un JWT

### 1. Header (Cabecera)

```json
{
  "alg": "HS256",
  "typ": "JWT"
}
```

- `alg`: Algoritmo de firma (HS256, RS256, etc.)
- `typ`: Tipo de token (siempre "JWT")

### 2. Payload (Carga útil)

```json
{
  "sub": "1234567890",
  "name": "Juan Pérez",
  "iat": 1516239022,
  "exp": 1516242622
}
```

Contiene los **claims** (afirmaciones) sobre una entidad (normalmente el usuario):

- **Registered claims**: Predefinidos (iat, exp, sub, iss, aud)
- **Public claims**: Definidos a voluntad pero deben evitar colisiones
- **Private claims**: Personalizados acordados entre las partes

### 3. Signature (Firma)

```javascript
HMACSHA256(base64UrlEncode(header) + "." + base64UrlEncode(payload), secret);
```

La firma se crea tomando el header codificado, el payload codificado, una clave secreta y el algoritmo especificado en el header.

## Algoritmos de firma

| Algoritmo | Tipo       | Descripción                               |
| --------- | ---------- | ----------------------------------------- |
| **HS256** | Simétrico  | HMAC con SHA-256 (una sola clave secreta) |
| **HS384** | Simétrico  | HMAC con SHA-384                          |
| **HS512** | Simétrico  | HMAC con SHA-512                          |
| **RS256** | Asimétrico | RSA con SHA-256 (clave pública/privada)   |
| **ES256** | Asimétrico | ECDSA con curva P-256 y SHA-256           |

## Claims estándar

| Claim | Nombre          | Descripción                                       |
| ----- | --------------- | ------------------------------------------------- |
| `iss` | Issuer          | Quién emitió el token                             |
| `sub` | Subject         | Sobre quién/qué es el token (normalmente user ID) |
| `aud` | Audience        | Para quién está destinado el token                |
| `exp` | Expiration Time | Fecha de expiración (timestamp Unix)              |
| `nbf` | Not Before      | Fecha antes de la cual el token no es válido      |
| `iat` | Issued At       | Fecha de emisión                                  |
| `jti` | JWT ID          | Identificador único del token                     |

## Flujo típico de autenticación

```
1. Usuario se autentica → Servidor verifica credenciales
2. Servidor genera JWT con información del usuario
3. Cliente almacena el JWT (localStorage, cookie, memoria)
4. Cliente envía JWT en cada petición (Header: Authorization: Bearer <token>)
5. Servidor verifica la firma y valida el token
6. Si es válido, procesa la petición
```

## Access Token vs Refresh Token

### Access Token

- **Vida corta** (5-15 minutos)
- Contiene permisos y datos del usuario
- Se envía en cada petición
- Si se compromete, expira pronto

### Refresh Token

- **Vida larga** (días/semanas)
- Solo se usa para obtener un nuevo access token
- Se almacena de forma segura (httpOnly cookie)
- Puede ser revocado en el servidor

## Ventajas

- ✅ **Stateless**: No requiere sesión en el servidor
- ✅ **Portable**: Funciona en diferentes dominios y plataformas
- ✅ **Autónomo**: Contiene toda la información necesaria
- ✅ **Escalable**: Ideal para microservicios y APIs distribuidas

## Consideraciones de seguridad

- ❌ **No almacenar datos sensibles** (contraseñas, números de tarjeta)
- ⚠️ **Usar HTTPS** siempre para transmitir tokens
- ⏰ **Establecer expiración** adecuada (claim `exp`)
- 🔐 **Proteger la clave secreta** (variables de entorno, key management)
- 🔄 **Implementar refresh tokens** para sesiones largas
- ✅ **Validar siempre** la firma y expiración

## Casos de uso

- **Autenticación de usuarios**: Login, sesiones stateless
- **APIs**: Autorización entre servicios
- **Single Sign-On (SSO)**: Un token para múltiples aplicaciones
- **Comunicación entre microservicios**: Tokens de servicio a servicio

## Ejemplos incluidos

| Archivo          | Descripción                                         |
| ---------------- | --------------------------------------------------- |
| `jwt-create.js`  | Crear y firmar tokens JWT con diferentes algoritmos |
| `jwt-verify.js`  | Verificar y decodificar tokens JWT                  |
| `jwt-refresh.js` | Implementación de access tokens y refresh tokens    |

## Referencias

- [RFC 7519 - JWT](https://tools.ietf.org/html/rfc7519)
- [jwt.io](https://jwt.io/) - Herramienta para decodificar y verificar tokens
- [Node.js crypto](https://nodejs.org/api/crypto.html)

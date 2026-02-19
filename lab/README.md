# Lab: Crypto API con Express.js

API REST de criptografía siguiendo el patrón **MVC** con Express.js. Tu trabajo es implementar los controladores en `controllers/crypto.controllers.js`.

## Setup

```bash
cd lab
npm install
npm start        # Arranca el servidor con --watch (se recarga automáticamente)
```

El servidor estará disponible en `http://localhost:3000`.

## Estructura del proyecto

```
lab/
├── app.js                          # Entrada de la aplicación (ya configurado)
├── config/
│   └── routes.config.js            # Rutas de la API (ya configurado)
├── controllers/
│   └── crypto.controllers.js       # 👈 AQUÍ IMPLEMENTAS TUS FUNCIONES
├── middlewares/
│   └── errors.middleware.js         # Manejador de errores (ya configurado)
└── tests/
    ├── 01-hashing.test.js           # Tests iteración 1
    ├── 02-symmetric.test.js         # Tests iteración 2
    ├── 03-asymmetric.test.js        # Tests iteración 3
    ├── 04-signature.test.js         # Tests iteración 4
    └── 05-jwt.test.js               # Tests iteración 5
```

> **Solo necesitas editar `controllers/crypto.controllers.js`**. Las rutas, el servidor, el error handler y los tests ya están listos.

## Tests

Usa los tests para verificar que tu implementación es correcta. Puedes ejecutar los tests de cada iteración por separado o todos a la vez:

```bash
# Ejecutar TODOS los tests
npm test

# Ejecutar tests en modo watch (se re-ejecutan al guardar)
npm run test:watch

# Ejecutar solo los tests de una iteración
npm run test:1       # Iteración 1: Hashing
npm run test:2       # Iteración 2: Cifrado simétrico
npm run test:3       # Iteración 3: Cifrado asimétrico
npm run test:4       # Iteración 4: Firma digital
npm run test:5       # Iteración 5: JWT
```

Flujo de trabajo recomendado: abre dos terminales, una con `npm start` y otra con `npm run test:watch`. Implementa las funciones y los tests se ejecutarán automáticamente.

---

## Iteraciones

### Iteración 1: Hashing

Implementa las funciones `hash` y `hmac`.

**`POST /api/crypto/hash`** — Generar un hash

```bash
curl -X POST http://localhost:3000/api/crypto/hash \
  -H "Content-Type: application/json" \
  -d '{"text": "hello world", "algorithm": "sha256"}'
```

```json
{ "hash": "b94d27b9934d3e08a52e52d7da7dabfac484efe37a5380ee9088f7ace2efcde9" }
```

**`POST /api/crypto/hmac`** — Generar un HMAC

```bash
curl -X POST http://localhost:3000/api/crypto/hmac \
  -H "Content-Type: application/json" \
  -d '{"text": "hello world", "secret": "mi-clave-secreta"}'
```

```json
{ "hmac": "..." }
```

---

### Iteración 2: Cifrado simétrico (AES-256-GCM)

Implementa las funciones `symmetricEncrypt` y `symmetricDecrypt`.

**`POST /api/crypto/symmetric/encrypt`** — Cifrar texto

```bash
curl -X POST http://localhost:3000/api/crypto/symmetric/encrypt \
  -H "Content-Type: application/json" \
  -d '{"text": "mensaje secreto", "password": "mi-password"}'
```

```json
{
  "encrypted": "a1b2c3...",
  "iv": "d4e5f6...",
  "salt": "789abc...",
  "authTag": "def012..."
}
```

**`POST /api/crypto/symmetric/decrypt`** — Descifrar texto

```bash
curl -X POST http://localhost:3000/api/crypto/symmetric/decrypt \
  -H "Content-Type: application/json" \
  -d '{
    "encrypted": "a1b2c3...",
    "iv": "d4e5f6...",
    "salt": "789abc...",
    "authTag": "def012...",
    "password": "mi-password"
  }'
```

```json
{ "decrypted": "mensaje secreto" }
```

> **Tip**: Usa la respuesta del endpoint de encrypt como body del endpoint de decrypt para probar el flujo completo.

---

### Iteración 3: Cifrado asimétrico (RSA)

Implementa `generateKeyPair`, `asymmetricEncrypt` y `asymmetricDecrypt`.

**`POST /api/crypto/asymmetric/keypair`** — Generar par de claves RSA

```bash
curl -X POST http://localhost:3000/api/crypto/asymmetric/keypair \
  -H "Content-Type: application/json" \
  -d '{}'
```

```json
{
  "publicKey": "-----BEGIN PUBLIC KEY-----\n...",
  "privateKey": "-----BEGIN PRIVATE KEY-----\n..."
}
```

**`POST /api/crypto/asymmetric/encrypt`** — Cifrar con clave pública

```bash
curl -X POST http://localhost:3000/api/crypto/asymmetric/encrypt \
  -H "Content-Type: application/json" \
  -d '{"text": "secreto", "publicKey": "-----BEGIN PUBLIC KEY-----\n..."}'
```

**`POST /api/crypto/asymmetric/decrypt`** — Descifrar con clave privada

```bash
curl -X POST http://localhost:3000/api/crypto/asymmetric/decrypt \
  -H "Content-Type: application/json" \
  -d '{"encrypted": "...", "privateKey": "-----BEGIN PRIVATE KEY-----\n..."}'
```

> **Tip**: Genera un keypair primero, luego usa las claves para cifrar y descifrar.

---

### Iteración 4: Firma digital

Implementa `sign` y `verify`.

**`POST /api/crypto/sign`** — Firmar datos

```bash
curl -X POST http://localhost:3000/api/crypto/sign \
  -H "Content-Type: application/json" \
  -d '{"data": "documento importante", "privateKey": "-----BEGIN PRIVATE KEY-----\n..."}'
```

```json
{ "signature": "base64..." }
```

**`POST /api/crypto/verify`** — Verificar firma

```bash
curl -X POST http://localhost:3000/api/crypto/verify \
  -H "Content-Type: application/json" \
  -d '{
    "data": "documento importante",
    "signature": "base64...",
    "publicKey": "-----BEGIN PUBLIC KEY-----\n..."
  }'
```

```json
{ "valid": true }
```

---

### Iteración 5: JWT (JSON Web Tokens)

Implementa `jwtCreate` y `jwtVerify` **sin usar librerías externas** (solo `node:crypto`).

**`POST /api/crypto/jwt/create`** — Crear un JWT

```bash
curl -X POST http://localhost:3000/api/crypto/jwt/create \
  -H "Content-Type: application/json" \
  -d '{
    "payload": {"sub": "user123", "name": "Ana"},
    "secret": "mi-secreto",
    "expiresInSeconds": 3600
  }'
```

```json
{ "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOi..." }
```

**`POST /api/crypto/jwt/verify`** — Verificar un JWT

```bash
curl -X POST http://localhost:3000/api/crypto/jwt/verify \
  -H "Content-Type: application/json" \
  -d '{"token": "eyJhbGci...", "secret": "mi-secreto"}'
```

```json
{ "valid": true, "payload": {"sub": "user123", "name": "Ana", "iat": 1700000000, "exp": 1700003600} }
```

---

## Referencia rápida

| Módulo `node:crypto`                          | Para qué sirve                         |
| --------------------------------------------- | -------------------------------------- |
| `crypto.createHash(alg)`                      | Crear hash (SHA-256, MD5, etc.)        |
| `crypto.createHmac(alg, secret)`              | Crear HMAC                             |
| `crypto.scryptSync(password, salt, keyLen)`   | Derivar clave desde password           |
| `crypto.randomBytes(n)`                       | Generar bytes aleatorios               |
| `crypto.createCipheriv(alg, key, iv)`         | Cifrar con algoritmo simétrico         |
| `crypto.createDecipheriv(alg, key, iv)`       | Descifrar con algoritmo simétrico      |
| `crypto.generateKeyPairSync("rsa", options)`  | Generar par de claves RSA              |
| `crypto.publicEncrypt(key, buffer)`           | Cifrar con clave pública               |
| `crypto.privateDecrypt(key, buffer)`          | Descifrar con clave privada            |
| `crypto.createSign("SHA256")`                 | Crear firma digital                    |
| `crypto.createVerify("SHA256")`               | Verificar firma digital                |

## Recursos

Consulta los ejemplos resueltos en los directorios `01-hashing`, `02-symmetric-encryption`, `03-asymmetric-encryption` y `04-jwt` del monorepo para guiarte.

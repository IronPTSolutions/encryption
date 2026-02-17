# Criptografía en Node.js

Monorepo educativo con ejemplos prácticos de conceptos de criptografía implementados en Node.js usando el módulo nativo `crypto`.

## Subproyectos

| #   | Proyecto                                         | Descripción                                                                    |
| --- | ------------------------------------------------ | ------------------------------------------------------------------------------ |
| 01  | [Hashing](./01-hashing)                          | Funciones hash (SHA-256, MD5), HMAC y verificación de integridad               |
| 02  | [Cifrado Simétrico](./02-symmetric-encryption)   | AES-256 en modos CBC y GCM, derivación de claves con PBKDF2                    |
| 03  | [Cifrado Asimétrico](./03-asymmetric-encryption) | RSA: generación de claves, cifrado/descifrado, firma digital y cifrado híbrido |

## Requisitos

- **Node.js >= 18** (todos los ejemplos usan el módulo `node:crypto` nativo, sin dependencias externas)

## Uso rápido

Cada subproyecto es independiente. Entra en el directorio y ejecuta los ejemplos:

```bash
# Hashing
cd 01-hashing
npm start

# Cifrado simétrico
cd 02-symmetric-encryption
npm start

# Cifrado asimétrico
cd 03-asymmetric-encryption
npm start
```

También puedes ejecutar cada ejemplo individualmente:

```bash
node 01-hashing/src/basic-hash.js
node 02-symmetric-encryption/src/aes-gcm.js
node 03-asymmetric-encryption/src/digital-signature.js
```

## Estructura

```
node-encryption/
├── README.md
├── 01-hashing/
│   ├── README.md
│   ├── package.json
│   └── src/
│       ├── basic-hash.js
│       ├── hmac.js
│       └── verify-integrity.js
├── 02-symmetric-encryption/
│   ├── README.md
│   ├── package.json
│   └── src/
│       ├── key-generation.js
│       ├── aes-encrypt.js
│       └── aes-gcm.js
└── 03-asymmetric-encryption/
    ├── README.md
    ├── package.json
    └── src/
        ├── keypair-generation.js
        ├── encrypt-decrypt.js
        └── digital-signature.js
```

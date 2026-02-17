# Cifrado Asimétrico

## ¿Qué es el cifrado asimétrico?

El **cifrado asimétrico** (o de clave pública) utiliza un **par de claves** matemáticamente relacionadas:

- **Clave pública**: Se comparte libremente. Cualquiera puede usarla para cifrar.
- **Clave privada**: Se mantiene en secreto. Solo el propietario puede descifrar.

```
Cifrar:    Texto plano + Clave pública  → [Cifrar]    → Texto cifrado
Descifrar: Texto cifrado + Clave privada → [Descifrar] → Texto plano
```

La ventaja principal sobre el cifrado simétrico es que **no es necesario compartir una clave secreta** previamente. Cualquiera puede cifrar un mensaje con tu clave pública, pero solo tú puedes descifrarlo con tu clave privada.

## RSA (Rivest-Shamir-Adleman)

**RSA** es el algoritmo de cifrado asimétrico más conocido, publicado en 1977. Su seguridad se basa en la dificultad de factorizar números enteros muy grandes.

### Tamaños de clave

| Tamaño    | Seguridad  | Uso                         |
| --------- | ---------- | --------------------------- |
| 1024 bits | Inseguro   | No usar                     |
| 2048 bits | Seguro     | Uso general actual          |
| 4096 bits | Muy seguro | Máxima seguridad, más lento |

### Limitaciones

- **Lento**: Mucho más lento que el cifrado simétrico (AES).
- **Tamaño limitado**: Solo puede cifrar datos menores que el tamaño de la clave (ej. ~245 bytes con RSA-2048 y OAEP-SHA256).
- **Uso práctico**: Se usa para cifrar claves simétricas o firmar hashes, no para cifrar datos grandes directamente.

## Firma Digital

La firma digital es el proceso inverso al cifrado: se usa la **clave privada para firmar** y la **clave pública para verificar**.

```
Firmar:    Hash del mensaje + Clave privada → [Firmar]    → Firma
Verificar: Mensaje + Firma + Clave pública   → [Verificar] → Válido/Inválido
```

### ¿Qué garantiza una firma digital?

| Propiedad        | Descripción                                               |
| ---------------- | --------------------------------------------------------- |
| **Autenticidad** | El mensaje fue creado por el poseedor de la clave privada |
| **Integridad**   | El mensaje no fue alterado después de ser firmado         |
| **No repudio**   | El firmante no puede negar haber firmado el mensaje       |

## Cifrado híbrido (en la práctica)

En aplicaciones reales (TLS/HTTPS, PGP), se combina cifrado asimétrico y simétrico:

1. Se genera una **clave simétrica aleatoria** (clave de sesión).
2. Se cifra el mensaje con la clave simétrica (rápido, para datos grandes).
3. Se cifra la clave simétrica con la clave pública del receptor (solo unos bytes).
4. Se envía ambos: clave cifrada + mensaje cifrado.

Esto combina la **conveniencia** del cifrado asimétrico con la **velocidad** del simétrico.

## Ejemplos incluidos

| Archivo                     | Descripción                                       |
| --------------------------- | ------------------------------------------------- |
| `src/keypair-generation.js` | Generar pares de claves RSA en distintos formatos |
| `src/encrypt-decrypt.js`    | Cifrar con clave pública y descifrar con privada  |
| `src/digital-signature.js`  | Firmar datos y verificar la firma                 |

## Ejecución

```bash
# Ejecutar todos los ejemplos
npm start

# Ejecutar un ejemplo individual
node src/keypair-generation.js
node src/encrypt-decrypt.js
node src/digital-signature.js
```

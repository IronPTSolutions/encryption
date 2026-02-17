# Cifrado Simétrico

## ¿Qué es el cifrado simétrico?

En el **cifrado simétrico** se utiliza la **misma clave** tanto para cifrar como para descifrar la información. Emisor y receptor deben compartir esta clave secreta de antemano.

```
Texto plano + Clave → [Cifrar] → Texto cifrado
Texto cifrado + Clave → [Descifrar] → Texto plano
```

Es el tipo de cifrado más rápido y eficiente, ideal para grandes volúmenes de datos.

## AES (Advanced Encryption Standard)

**AES** es el estándar de cifrado simétrico más utilizado en el mundo. Fue adoptado por el gobierno de EE.UU. en 2001 y es considerado seguro con claves de 128, 192 o 256 bits.

### Tamaños de clave

| Tamaño  | Bits de seguridad | Uso recomendado                   |
| ------- | ----------------- | --------------------------------- |
| AES-128 | 128 bits          | Uso general, buen rendimiento     |
| AES-192 | 192 bits          | Mayor seguridad                   |
| AES-256 | 256 bits          | Máxima seguridad, datos sensibles |

## Modos de operación

AES es un cifrado de bloque (opera sobre bloques de 128 bits). Los **modos de operación** definen cómo se aplica el cifrado a mensajes más largos que un bloque.

### CBC (Cipher Block Chaining)

- Cada bloque se combina (XOR) con el bloque cifrado anterior antes de cifrarse.
- Requiere un **IV** (Vector de Inicialización) aleatorio.
- Necesita **padding** cuando el texto no es múltiplo del tamaño de bloque.
- **No proporciona autenticación**: un atacante podría modificar el texto cifrado sin ser detectado.

```
Bloque 1: IV ⊕ Texto → [AES] → Cifrado 1
Bloque 2: Cifrado 1 ⊕ Texto → [AES] → Cifrado 2
...
```

### GCM (Galois/Counter Mode)

- Modo de cifrado **autenticado** (AEAD): garantiza confidencialidad e integridad.
- Produce un **authentication tag** que permite detectar manipulaciones.
- No necesita padding.
- **Recomendado** sobre CBC para la mayoría de casos de uso.

## Vector de Inicialización (IV)

El **IV** es un valor aleatorio que se usa junto con la clave para que cifrar el mismo texto dos veces produzca resultados diferentes. Características:

- Debe ser **único** para cada operación de cifrado con la misma clave.
- **No necesita ser secreto** (se transmite junto al texto cifrado).
- En CBC: 16 bytes (128 bits).
- En GCM: 12 bytes (96 bits) recomendado.

## Derivación de claves (PBKDF2)

En la práctica, las claves no se inventan directamente. Se **derivan** a partir de una contraseña usando funciones como **PBKDF2** (Password-Based Key Derivation Function 2):

```
Contraseña + Salt + Iteraciones → [PBKDF2] → Clave de cifrado
```

- **Salt**: valor aleatorio que evita ataques con tablas precomputadas (rainbow tables).
- **Iteraciones**: cuantas más, más lento el cálculo (dificulta ataques de fuerza bruta).

## Ejemplos incluidos

| Archivo                 | Descripción                                             |
| ----------------------- | ------------------------------------------------------- |
| `src/key-generation.js` | Generación de claves aleatorias y derivación con PBKDF2 |
| `src/aes-encrypt.js`    | Cifrar y descifrar con AES-256-CBC                      |
| `src/aes-gcm.js`        | Cifrar y descifrar con AES-256-GCM (modo autenticado)   |

## Ejecución

```bash
# Ejecutar todos los ejemplos
npm start

# Ejecutar un ejemplo individual
node src/key-generation.js
node src/aes-encrypt.js
node src/aes-gcm.js
```

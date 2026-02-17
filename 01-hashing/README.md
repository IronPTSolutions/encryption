# Hashing (Funciones Resumen)

## ¿Qué es un hash?

Una **función hash** es un algoritmo que toma una entrada de cualquier tamaño y produce una salida de tamaño fijo llamada **digest** o **resumen**. Es una operación matemática unidireccional: a partir del resultado no se puede recuperar la entrada original.

```
Entrada (cualquier tamaño) → [Función Hash] → Digest (tamaño fijo)
```

Por ejemplo, SHA-256 siempre produce una salida de 256 bits (64 caracteres hexadecimales), sin importar si la entrada es una letra o un archivo de varios gigabytes.

## Propiedades fundamentales

| Propiedad                    | Descripción                                                                       |
| ---------------------------- | --------------------------------------------------------------------------------- |
| **Determinista**             | La misma entrada siempre produce la misma salida                                  |
| **Irreversible**             | No se puede obtener la entrada original a partir del hash                         |
| **Efecto avalancha**         | Un cambio mínimo en la entrada genera un hash completamente diferente             |
| **Resistencia a colisiones** | Es computacionalmente inviable encontrar dos entradas distintas con el mismo hash |
| **Rápida de calcular**       | Se puede computar el hash eficientemente para cualquier entrada                   |

## Algoritmos comunes

- **MD5** (128 bits): Obsoleto para seguridad. Aún se usa para checksums rápidos.
- **SHA-1** (160 bits): Considerado inseguro desde 2017. No usar para seguridad.
- **SHA-256** (256 bits): Parte de la familia SHA-2. Ampliamente usado y seguro.
- **SHA-512** (512 bits): Mayor tamaño de digest. Más seguro pero más lento.

## ¿Qué es HMAC?

**HMAC** (Hash-based Message Authentication Code) combina una función hash con una clave secreta para producir un código de autenticación. A diferencia de un hash simple, HMAC garantiza tanto la **integridad** como la **autenticidad** del mensaje.

```
Mensaje + Clave Secreta → [HMAC] → Código de Autenticación
```

Solo quien posea la clave secreta puede generar y verificar el HMAC.

## Casos de uso

- **Verificación de integridad**: Comprobar que un archivo no fue alterado durante la descarga.
- **Almacenamiento de contraseñas**: Se guarda el hash, no la contraseña en texto plano.
- **Firmas digitales**: El hash del documento se firma con una clave privada.
- **HMAC en APIs**: Autenticar solicitudes entre servicios (webhooks, JWT).

## Ejemplos incluidos

| Archivo                   | Descripción                                             |
| ------------------------- | ------------------------------------------------------- |
| `src/basic-hash.js`       | Generar hashes con MD5, SHA-256 y SHA-512               |
| `src/hmac.js`             | Crear y verificar HMAC con clave secreta                |
| `src/verify-integrity.js` | Verificar la integridad de un mensaje comparando hashes |

## Ejecución

```bash
# Ejecutar todos los ejemplos
npm start

# Ejecutar un ejemplo individual
node src/basic-hash.js
node src/hmac.js
node src/verify-integrity.js
```

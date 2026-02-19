# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Educational monorepo demonstrating cryptography concepts in Node.js using the native `node:crypto` module. Written in Spanish. No external dependencies — all examples use only Node.js built-ins.

## Architecture

Four independent subprojects, each with its own `package.json` and `src/` directory:

- **01-hashing** — SHA-256, MD5, HMAC, integrity verification
- **02-symmetric-encryption** — AES-256 (CBC & GCM modes), PBKDF2 key derivation
- **03-asymmetric-encryption** — RSA keypair generation, encrypt/decrypt, digital signatures
- **04-jwt** — JWT creation, verification, access/refresh token patterns

All subprojects use ES modules (`"type": "module"` in package.json).

## Running Examples

```bash
# Run all examples in a subproject
cd 01-hashing && npm start

# Run a single example directly from repo root
node 01-hashing/src/basic-hash.js
```

## Requirements

- Node.js >= 18

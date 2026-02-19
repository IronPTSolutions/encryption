// ============================================
// Archivo principal de la aplicación Express
// ============================================

import express from "express";
import morgan from "morgan";
import router from "./config/routes.config.js";
import { errorHandler } from "./middlewares/errors.middleware.js";

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware: registro de peticiones HTTP en consola
app.use(morgan("dev"));

// Middleware: permite recibir y parsear cuerpos de petición en formato JSON
app.use(express.json());

// Montar todas las rutas de la API bajo el prefijo /api
app.use("/api", router);

// Middleware: manejador de errores
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Crypto API running on http://localhost:${PORT}`);
});

export default app;

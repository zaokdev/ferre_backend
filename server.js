require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cloudinary = require("./cloudinary.js");
const morgan = require("morgan");
require("dotenv").config();
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("combined"));

// Definir puertos
const PORT = process.env.PORT || 3000;
const ENVIRONMENT = process.env.ENVIRONMENT || null;

// Ruta para obtener las imagenes
app.get("/promos", async (req, res) => {
  try {
    const result = await cloudinary.search
      .expression("folder:promos")
      .sort_by("created_at", "desc")
      .max_results(30)
      .execute();

    const images = result.resources.map((element) => ({
      id: element.public_id,
      url: element.url,
    }));

    res.json(images);
  } catch (error) {
    console.error("Error al obtener imágenes:", error);
    res.status(500).json();
  }
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor en el puerto ${PORT}`);
  console.log(`Estas en el entorno de ${ENVIRONMENT}`);
});

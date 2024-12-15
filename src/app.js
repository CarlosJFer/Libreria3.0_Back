const path = require("path");
require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const mongoose = require("mongoose");

// Configura y usa Mercado Pago según tus requerimientos
const { MercadoPagoConfig, Preference } = require("mercadopago");
const client = new MercadoPagoConfig({ accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN });
const Order = require("./models/Order"); 
const { createOrderController } = require("./controllers/orderController");
const mainRouter = require("./routes/main");

const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(morgan("dev"));
app.use(cors());
app.use("/api", mainRouter);

// Ajusta la ruta estática para archivos públicos
const staticPath = path.join(__dirname, "..", "..", "client", "public");
console.log("Serving static files from:", staticPath);
app.use(express.static(staticPath));

// Ruta para servir la página de éxito
app.get("/success", (req, res) => {
  res.sendFile(path.join(staticPath, "success", "index.html"));
});

// Rutas adicionales para failure y pending si existen
app.get("/failure", (req, res) => {
  res.sendFile(path.join(staticPath, "failure", "index.html"));
});

app.get("/pending", (req, res) => {
  res.sendFile(path.join(staticPath, "pending", "index.html"));
});

// Endpoint para crear una preferencia de pago
app.post("/create_preference", async (req, res) => {
  const { items, metodoPago } = req.body;

  try {
    const order = await createOrderController(new Date(), "Pendiente", metodoPago, items);
    const orderId = order._id;

    const body = {
      items: items.map((item) => ({
        title: item.title,
        quantity: Number(item.cantidad),
        currency_id: "ARS",
        unit_price: Number(item.precio),
      })),
      back_urls: {
        success: `http://localhost:3000/success?orderId=${orderId}`,
        failure: "http://localhost:3000/failure",
        pending: "http://localhost:3000/pending",
      },
      auto_return: "approved",
    };

    // Inicializa el objeto de preferencias
    const preferences = new Preference(client);

    // Crea la preferencia
    const preference = await preferences.create({ body });

    if (preference && preference.id) {
      res.json({ id: preference.id, init_point: preference.init_point });
    } else {
      console.error("Respuesta inesperada de Mercado Pago:", preference);
      res.status(500).send({ error: "Error al crear la preferencia de pago." });
    }
  } catch (error) {
    console.error("Error en create_preference:", error);
    res.status(500).send({ error: error.message });
  }
});

// Endpoint para recibir notificaciones de Mercado Pago (webhook)
app.post("/webhook", async (req, res) => {
  console.log("Notificación recibida:", req.body);
  const notification = req.body;
  
  // Dependiendo del tipo de evento, actualiza el estado de la orden
  if (notification.type === 'payment') {
    // Lógica para manejar las notificaciones de pago
  }

  res.status(200).send();
});

// Endpoint para obtener los detalles de una orden específica
app.get('/api/orders/:orderId', async (req, res) => {
  const { orderId } = req.params;

  try {
      const order = await Order.findById(orderId);

      if (!order) {
          return res.status(404).json({ error: 'Order not found' });
      }

      res.json({
          fecha: order.fecha,
          monto: order.total,
          metodoPago: order.metodoPago,
          downloadUrl: order.downloadUrl
      });
  } catch (error) {
      console.error('Error fetching order:', error);
      res.status(500).json({ error: 'Server error' });
  }
});


module.exports = app;
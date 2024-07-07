import express from "express";
import axios from "axios";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 5000;
const apiKey = "AIzaSyBtz6hF_kJYyuJwnS5zdck9rNQHJmF2aHg";

app.use(cors());

app.get("/api/googlemaps/directions", async (req, res) => {
  const { origin, destination } = req.query;
  const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(destination)}&key=${apiKey}`;

  try {
    const response = await axios.get(url);
    res.json(response.data);
  } catch (error) {
    console.error("Erro ao buscar tempo de trajeto:", error);
    res.status(500).json({ error: "Erro ao buscar tempo de trajeto" });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

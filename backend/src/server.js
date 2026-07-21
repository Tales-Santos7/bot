import dotenv from "dotenv";
dotenv.config();
import express from "express";

const app = express();
import app from "./app.js";

const PORT = process.env.PORT || 3000;

// Aguarda carregar o bot somente depois do dotenv
await import("./bot/index.js");

app.get("/", (req, res) => {
  res.send("Bot Online");
});

app.listen(PORT, () => {
  console.log(`API rodando na porta ${PORT}`);
});

bot.launch();

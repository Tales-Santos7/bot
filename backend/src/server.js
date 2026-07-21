import dotenv from "dotenv";
dotenv.config();

import app from "./app.js";

// Carrega o bot
await import("./bot/index.js");

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`API rodando na porta ${PORT}`);
});
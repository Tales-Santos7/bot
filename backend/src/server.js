import dotenv from "dotenv";
dotenv.config();

import app from "./app.js";
import { startBot } from "./bot/index.js";

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`API rodando na porta ${PORT}`);
});

startBot().catch(console.error);
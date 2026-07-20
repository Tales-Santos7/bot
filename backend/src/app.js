import express from "express";
import cors from "cors";
import webhookRoutes from "./routes/webhook.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use("/webhook", webhookRoutes);

app.get("/", (req, res) => {
    res.json({
        status: "online",
        message: "Telegram SaaS API"
    });
});

export default app;
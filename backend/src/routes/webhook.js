import express from "express";
import oasyfyService from "../services/oasyfyService.js";
import orderService from "../services/orderService.js";
import telegramService from "../services/telegramService.js";
import { bot } from "../bot/bot.js";

const router = express.Router();

router.post("/oasyfy", async (req, res) => {
  try {
    // Descobriremos o formato correto quando o webhook chegar.
   const paymentId = req.body.transactionId;

    if (!paymentId) {
      return res.sendStatus(200);
    }

    const event = req.body.event;
    const status = req.body.status;

    if (status !== "PAID" && status !== "COMPLETED") {
      return res.sendStatus(200);
    }

    const order = orderService.approve(paymentId);

    if (!order) {
      return res.sendStatus(200);
    }

    const inviteLink = await telegramService.createInvite(bot, order.groupId);

    await bot.telegram.sendMessage(
      order.telegramId,
      `🎉 <b>Pagamento confirmado com sucesso!</b>

━━━━━━━━━━━━━━━━━━

✅ Seu acesso já foi liberado.

🚀 Basta tocar no botão abaixo para entrar imediatamente.

Bom proveito! 😎`,
      {
        parse_mode: "HTML",
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: "🔞🔓 Acessar Agora",
                url: inviteLink,
              },
            ],
          ],
        },
      },
    );

    console.log("✅ Convite enviado para:", order.telegramId);

    return res.sendStatus(200);
  } catch (err) {
    console.error("ERRO WEBHOOK:");
    console.error(err.response?.data || err.message || err);

    return res.sendStatus(500);
  }
});

export default router;

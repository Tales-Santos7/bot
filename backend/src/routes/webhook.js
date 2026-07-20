import express from "express";
import asaasService from "../services/asaasService.js";
import orderService from "../services/orderService.js";
import telegramService from "../services/telegramService.js";
import { bot } from "../bot/bot.js";

const router = express.Router();

router.post("/mercadopago", async (req, res) => {
  try {
    const paymentId = req.body?.data?.id;

    if (!paymentId) {
      return res.sendStatus(200);
    }

    const payment = await asaasService.getPayment(paymentId);

    if (payment.status !== "approved") {
      return res.sendStatus(200);
    }

    const order = orderService.approve(paymentId);

    if (!order) {
      return res.sendStatus(200);
    }

    const inviteLink = await telegramService.createInvite(bot);

    await bot.telegram.sendMessage(
      order.telegramId,

      `🎉 Pagamento aprovado!

Seu acesso já está liberado.`,

      {
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: "🚀 Entrar no Grupo",

                url: inviteLink,
              },
            ],
          ],
        },
      },
    );

    return res.sendStatus(200);
  } catch (err) {
    console.error(err);

    return res.sendStatus(500);
  }
});

export default router;

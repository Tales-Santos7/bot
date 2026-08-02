import express from "express";
import oasyfyService from "../services/oasyfyService.js";
import orderService from "../services/orderService.js";
import telegramService from "../services/telegramService.js";
import { bot } from "../bot/bot.js";

const router = express.Router();

router.post("/oasyfy", async (req, res) => {
  try {
    console.log("WEBHOOK RECEBIDO");
    console.log(JSON.stringify(req.body, null, 2));

    const paymentId = req.body.transaction?.id;
    const status = req.body.transaction?.status;

    if (!paymentId) return res.sendStatus(200);

    if (status !== "COMPLETED") return res.sendStatus(200);

    const order = orderService.approve(paymentId);

    if (!order) {
      console.log("Pedido não encontrado.");
      return res.sendStatus(200);
    }

    console.log("Pagamento aprovado!");

    const invite = await telegramService.createInvite(bot, order.groupId);

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
                url: invite,
              },
            ],
          ],
        },
      },
    );

    res.sendStatus(200);
  } catch (err) {
    console.log(err);

    res.sendStatus(500);
  }
});

export default router;

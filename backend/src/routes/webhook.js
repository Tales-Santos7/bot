import express from "express";
import oasyfyService from "../services/oasyfyService.js";
import orderService from "../services/orderService.js";
import telegramService from "../services/telegramService.js";
import { bot } from "../bot/bot.js";

const router = express.Router();

router.post("/oasyfy", async (req, res) => {
  console.log("========================================");
  console.log("📩 WEBHOOK OASYFY RECEBIDO");
  console.log("========================================");

  console.log("HEADERS:");
  console.log(req.headers);

  console.log("BODY:");
  console.log(JSON.stringify(req.body, null, 2));

  try {
    // Descobriremos o formato correto quando o webhook chegar.
    const paymentId =
      req.body?.data?.id ||
      req.body?.transactionId ||
      req.body?.id ||
      req.body?.transaction?.id;

    if (!paymentId) {
      console.log("⚠️ Nenhum paymentId encontrado no payload.");
      return res.sendStatus(200);
    }

    console.log("🔎 Consultando transação:", paymentId);

    const payment = await oasyfyService.getPayment(paymentId);

    console.log("RESPOSTA DA API:");
    console.log(JSON.stringify(payment, null, 2));

    const status =
      payment?.status ||
      payment?.data?.status ||
      payment?.transaction?.status;

    console.log("STATUS:", status);

    if (
      status !== "COMPLETED" &&
      status !== "APPROVED" &&
      status !== "PAID"
    ) {
      console.log("⏳ Pagamento ainda não aprovado.");
      return res.sendStatus(200);
    }

    const order = orderService.approve(paymentId);

    if (!order) {
      console.log("⚠️ Pedido não encontrado:", paymentId);
      return res.sendStatus(200);
    }

    const inviteLink = await telegramService.createInvite(bot);

    await bot.telegram.sendMessage(
      order.telegramId,
      `🎉 <b>Pagamento aprovado!</b>

Seu acesso foi liberado.

Clique no botão abaixo para entrar no grupo.`,
      {
        parse_mode: "HTML",
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
      }
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
import { bot } from "./bot.js";
import { menuPrincipal } from "./keyboards.js";
import { products } from "./products.js";
import paymentService from "../services/paymentService.js";
import asaasService from "../services/asaasService.js";
import telegramService from "../services/telegramService.js";
import QRCode from "qrcode";
import { Markup, Input } from "telegraf";

/*
|--------------------------------------------------------------------------
| MENU
|--------------------------------------------------------------------------
*/

bot.action("menu", async (ctx) => {
  await ctx.editMessageCaption(
    `👋 Bem-vindo!

Escolha um produto abaixo.`,
    {
      reply_markup: menuPrincipal.reply_markup,
    },
  );
});

/*
|--------------------------------------------------------------------------
| PRODUTOS
|--------------------------------------------------------------------------
*/

products.forEach((product) => {
  bot.action(product.callback, async (ctx) => {
    await ctx.editMessageCaption(
      `${product.description}

👇 Clique em Comprar Agora para continuar.`,

      {
        parse_mode: "HTML",

        reply_markup: Markup.inlineKeyboard([
          [
            Markup.button.callback(
              `💳 Comprar • R$ ${product.price.toFixed(2).replace(".", ",")}`,
              `comprar_${product.id}`,
            ),
          ],

          [Markup.button.callback("⬅️ Voltar", "menu")],
        ]).reply_markup,
      },
    );
  });
});

/*
|--------------------------------------------------------------------------
| COMPRAR
|--------------------------------------------------------------------------
*/

products.forEach((product) => {
  bot.action(`comprar_${product.id}`, async (ctx) => {
    await ctx.answerCbQuery("⏳ Gerando PIX...");

    try {
      const order = await paymentService.createOrder(product, ctx.from.id);

      const qrBuffer = await QRCode.toBuffer(order.qrCode, {
        type: "png",
        width: 500,
        margin: 1,
      });

      await ctx.replyWithPhoto(Input.fromBuffer(qrBuffer), {
        caption: `💳 <b>PAGAMENTO PIX</b>

━━━━━━━━━━━━━━━━━━

📦 Produto

${order.productName}

💰 Valor

R$ ${order.amount.toFixed(2).replace(".", ",")}

━━━━━━━━━━━━━━━━━━

📋 PIX Copia e Cola

<code>${order.qrCode}</code>

━━━━━━━━━━━━━━━━━━

⏳ Assim que o pagamento for aprovado o acesso será liberado automaticamente.`,

        parse_mode: "HTML",

        reply_markup: Markup.inlineKeyboard([
          [Markup.button.callback("✅ Já paguei", `check_${order.paymentId}`)],
          [Markup.button.callback("❌ Cancelar", "menu")],
        ]).reply_markup,
      });
    } catch (err) {}
  });
});

// VERIFICAR PAGAMENTO

bot.action(/^check_(.+)$/, async (ctx) => {
  await ctx.answerCbQuery("Verificando pagamento...");

  const paymentId = ctx.match[1];

  const payment = await asaasService.createPix(order);

  if (payment.status === "RECEIVED") {
    const inviteLink = await telegramService.createInvite(bot);

    return await ctx.reply(
      `🎉 <b>Pagamento confirmado!</b>

Seu acesso foi liberado. O prazer lhe aguarda.

👇 Entre no grupo pelo botão abaixo.`,

      {
        parse_mode: "HTML",

        reply_markup: Markup.inlineKeyboard([
          [Markup.button.url("🔞Entrar no Grupo🔞", inviteLink)],
        ]).reply_markup,
      },
    );
  }

  return await ctx.reply(
    `⏳ Ainda não identificamos o pagamento.

Quando concluir o pagamento, clique novamente em:

✅ Já paguei`,
  );
});

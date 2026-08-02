import { bot } from "./bot.js";
import { menuPrincipal } from "./keyboards.js";
import { products } from "./products.js";
import paymentService from "../services/paymentService.js";
import oasyfyService from "../services/oasyfyService.js";
import telegramService from "../services/telegramService.js";
import orderService from "../services/orderService.js";
import QRCode from "qrcode";
import { Markup, Input } from "telegraf";

/*
|--------------------------------------------------------------------------
| MENU
|--------------------------------------------------------------------------
*/

bot.action("menu", async (ctx) => {
  await ctx.editMessageCaption(
    `🔥 𝗕𝗘𝗠-𝗩𝗜𝗡𝗗𝗢 𝗔𝗢 𝗨𝗡𝗜𝗩𝗘𝗥𝗦𝗢 DO PRAZER 🔥
🇧🇷 Faveladinhas gostosas, desesperadinhas, ninfetas de bairro, magrinhas peitudas, todo tipo de vazado bruto em um único grupo 😈🥵

𝗔𝗤𝗨𝗜 É 𝗠𝗔𝗧𝗘𝗥𝗜𝗔𝗟 𝗦𝗨𝗝𝗢, 𝗦𝗘𝗠 𝗙𝗜𝗟𝗧𝗥𝗢:

Selecione o produto que deseja acessar.

Basta clicar em um botão abaixo.`,
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
      `${product.description}`,

      {
        parse_mode: "HTML",

        reply_markup: Markup.inlineKeyboard([
          [
            Markup.button.callback(
              "🔞🔓Comprar Agora",
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
        caption: `💎 <b>SEU ACESSO ESTÁ A UM PASSO!</b>

━━━━━━━━━━━━━━━━━━

📦 <b>Produto</b>

${order.productName}

💰 <b>Valor</b>

R$ ${order.amount.toFixed(2).replace(".", ",")}

━━━━━━━━━━━━━━━━━━

📱 <b>PIX Copia e Cola</b>

<code>${order.qrCode}</code>

━━━━━━━━━━━━━━━━━━

⚡ Escaneie o QR Code ou copie o código PIX acima.

🔒 Assim que o pagamento for confirmado, seu acesso será liberado automaticamente.

🚀 O processo costuma levar apenas alguns segundos.`,

        parse_mode: "HTML",

        reply_markup: Markup.inlineKeyboard([
          [
            Markup.button.callback(
              "✅ Já realizei o pagamento",
              `check_${order.paymentId}`,
            ),
          ],
          [Markup.button.callback("❌ Cancelar", "menu")],
        ]).reply_markup,
      });
    } catch (err) {
      console.error(err.response?.data);

      console.error(err.message);

      await ctx.reply("Erro ao gerar o PIX.");
    }
  });
});

// VERIFICAR PAGAMENTO

bot.action(/^check_(.+)$/, async (ctx) => {
  await ctx.answerCbQuery("🔍 Verificando seu pagamento...");

  const paymentId = ctx.match[1];

  const order = orderService.find(paymentId);

  if (!order) {
    return ctx.reply("❌ Pedido não encontrado.");
  }

  const payment = await oasyfyService.getPayment(paymentId);

  if (payment.status === "COMPLETED") {
    const inviteLink = await telegramService.createInvite(bot, order.groupId);

    return ctx.reply(
      `🎉 <b>Pagamento confirmado com sucesso!</b>

━━━━━━━━━━━━━━━━━━

✅ Seu acesso já foi liberado.

🚀 Basta tocar no botão abaixo para entrar imediatamente.

Bom proveito! 😎
`,
      {
        parse_mode: "HTML",
        reply_markup: Markup.inlineKeyboard([
          [Markup.button.url("🔞🔓 Acessar Agora", inviteLink)],
        ]).reply_markup,
      },
    );
  }

  return await ctx.reply(
    `⌛ <b>Ainda estamos aguardando a confirmação.</b>

Isso normalmente leva alguns segundos após o pagamento.

Assim que concluir o PIX, toque novamente em:

<b>✅ Já paguei</b>

💡 Caso tenha acabado de pagar, aguarde um instante e tente novamente.`,
  );
});

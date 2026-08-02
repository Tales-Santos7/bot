import { bot } from "./bot.js";
import { menuPrincipal } from "./keyboards.js";

bot.start(async (ctx) => {

  const msg = await ctx.replyWithVideo(
    Input.fromLocalFile("BAACAgEAAxkDAAIDeWpvzvasqv-6VZkuSoUO8rEIxgjwAAI5CQACaFaAR4DG8EZZo6lIPQQ"),
    {
            caption:
`🔥 𝗕𝗘𝗠-𝗩𝗜𝗡𝗗𝗢 𝗔𝗢 𝗨𝗡𝗜𝗩𝗘𝗥𝗦𝗢 DO PRAZER 🔥
🇧🇷 Faveladinhas gostosas, desesperadinhas, ninfetas de bairro, magrinhas peitudas, todo tipo de vazado bruto em um único grupo 😈🥵

𝗔𝗤𝗨𝗜 É 𝗠𝗔𝗧𝗘𝗥𝗜𝗔𝗟 𝗦𝗨𝗝𝗢, 𝗦𝗘𝗠 𝗙𝗜𝗟𝗧𝗥𝗢:

Selecione o produto que deseja acessar.

Basta clicar em um botão abaixo.`,

            ...menuPrincipal
        }

    );

});
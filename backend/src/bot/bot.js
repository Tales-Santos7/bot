import dotenv from "dotenv";
dotenv.config();

import { Telegraf } from "telegraf";

export const bot = new Telegraf(process.env.BOT_TOKEN);

// bot.command("id", async (ctx) => {
//     await ctx.reply(`ID deste chat: ${ctx.chat.id}`);
// });
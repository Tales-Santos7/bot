import dotenv from "dotenv";
dotenv.config();

import { Telegraf } from "telegraf";

export const bot = new Telegraf(process.env.BOT_TOKEN);

// bot.on("channel_post", (ctx) => {
//   console.log("Canal:");
//   console.log(ctx.update.channel_post.chat);
// });
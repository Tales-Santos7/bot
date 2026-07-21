import { bot } from "./bot.js";
import "./commands.js";
import "./callbacks.js";

export async function startBot() {
    const me = await bot.telegram.getMe();

    console.log(`🤖 @${me.username}`);

    await bot.launch();

    process.once("SIGINT", () => bot.stop("SIGINT"));
    process.once("SIGTERM", () => bot.stop("SIGTERM"));
}
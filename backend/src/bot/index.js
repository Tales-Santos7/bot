import { bot } from "./bot.js";
import "./commands.js";
import "./callbacks.js";

try {

    const me = await bot.telegram.getMe();

    console.log(`🤖 @${me.username}`);

    await bot.launch();

} catch (err) {

    console.error(err);

}

process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
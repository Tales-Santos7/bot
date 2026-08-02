import { Markup } from "telegraf";
import { products } from "./products.js";

const buttons = [];

products.forEach(product => {

    buttons.push([
        Markup.button.callback(
            product.name,
            product.callback
        )
    ]);

});

// buttons.push([
//     Markup.button.callback(
//         "👤 Minha Assinatura",
//         "minha_assinatura"
//     )
// ]);

// buttons.push([
//     Markup.button.callback(
//         "💬 Suporte",
//         "suporte"
//     )
// ]);

export const menuPrincipal = Markup.inlineKeyboard(buttons);
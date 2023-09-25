/**
 * @typedef {import("./bot.mjs").BotContext} BotContext
 * @typedef {import("@grammyjs/conversations").Conversation} Conversation
 *
 * @typedef {Conversation<BotContext>} BotConversation
 */

import {createReTrigger} from "grammy-retrigger";
import {InlineKeyboard} from "grammy";

export async function conversation(conversation, ctx) {

    const {signal} = globalThis;

    const step = createReTrigger(conversation, {drop: true});

    await ctx.reply("Hey !", {}, signal).then(step);
    await ctx.reply("Send any text", {}, signal).then(step);

    const text = await conversation.form.text(ctx => ctx.reply("Send any text", {}, signal));

    await ctx.reply("Nice, send any number of repeats for your text (maximum 100)", {}, signal).then(step);

    let repeats = await conversation.form.number(ctx => ctx.reply("Send any number", {}, signal));

    if (repeats > 100) repeats = 100;

    await ctx.reply(`Your text repeated ${repeats} time(s):`, {
        reply_markup: new InlineKeyboard().text("Cancel", "cancel")
    }, signal).then(step);

    while (repeats-- > 0) await ctx.reply(text, {}, signal).then(step);

    await ctx.reply(`Done`, {}, signal).then(step);

}

/**
 * @typedef {import("./bot.mjs").BotContext} BotContext
 * @typedef {import("@grammyjs/conversations").Conversation} Conversation
 *
 * @typedef {Conversation<BotContext>} BotConversation
 */

import {createReTrigger} from "grammy-retrigger";

export async function conversation(conversation, ctx) {

    const step = createReTrigger(conversation, {drop: true});

    await ctx.reply("Hey !").then(step);

    if (Math.random() < 0.2)
        throw new Error("Random error");

    await ctx.reply("Send any text").then(step);
    const text = await conversation.form.text(ctx => ctx.reply("Send any text"));
    await ctx.reply("Nice, send any number of repeats for your text (maximum 10)").then(step);
    let repeats = await conversation.form.number(ctx => ctx.reply("Send any number"));
    if (repeats > 10) repeats = 10;
    await ctx.reply(`Your text repeated ${repeats} time(s):`).then(step);
    while (repeats-- > 0) await ctx.reply(text).then(step);
    await ctx.reply(`Done`).then(step);

}

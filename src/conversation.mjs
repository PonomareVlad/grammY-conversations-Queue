/**
 * @typedef {import("./bot.mjs").BotContext} BotContext
 * @typedef {import("@grammyjs/conversations").Conversation} Conversation
 *
 * @typedef {Conversation<BotContext>} BotConversation
 */

const step = async conversation => {
    const {update_id} = conversation.currentCtx.update;
    await conversation.external(() => conversation.ctx.reTrigger());
    await conversation.waitUntil(
        ctx => ctx.update.update_id === update_id,
        () => console.warn("Update skipped:", conversation.ctx.update)
    );
}

export async function conversation(conversation, ctx) {

    await ctx.reply("Hey !").then(() => step(conversation));

    if (Math.random() < 0.5) throw new Error("Random error");

    await ctx.reply("Send any text").then(() => step(conversation));

    const text = await conversation.form.text(ctx => ctx.reply("Send any text"));

    await ctx.reply("Nice, send any number of repeats for your text").then(() => step(conversation));

    let repeats = await conversation.form.number(ctx => ctx.reply("Send any number"));

    await ctx.reply(`Your text repeated ${repeats} time(s):`).then(() => step(conversation));

    while (repeats-- > 0) await ctx.reply(text).then(() => step(conversation));

    await ctx.reply(`Done`).then(() => step(conversation));

}

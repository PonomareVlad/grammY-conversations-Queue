/**
 * @typedef {import("./bot.mjs").BotContext} BotContext
 * @typedef {import("@grammyjs/conversations").Conversation} Conversation
 *
 * @typedef {Conversation<BotContext>} BotConversation
 */

export async function conversation(conversation, ctx) {

    const step = async () => {
        const {update_id} = ctx.update;
        await conversation.external(() => ctx.reTrigger());
        await conversation.waitUntil(
            ctx => ctx.update.update_id === update_id,
            () => console.warn("Update skipped:", ctx.update)
        );
    }

    await ctx.reply("Hey !").then(step);

    if (Math.random() < 0.5) throw new Error("Random error");

    await ctx.reply("Send any text").then(step);

    const text = await conversation.form.text(ctx => ctx.reply("Send any text").then(step));

    await ctx.reply("Done, your text:");

    await ctx.reply(text);

}

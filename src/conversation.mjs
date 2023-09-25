/**
 * @typedef {import("./bot.mjs").BotContext} BotContext
 * @typedef {import("@grammyjs/conversations").Conversation} Conversation
 *
 * @typedef {Conversation<BotContext>} BotConversation
 */

// console.debug(JSON.stringify(conversation.session.conversation, null, 2));

export async function conversation(conversation, ctx) {

    const step = async () => {
        const {update_id} = ctx.update;
        await conversation.external(() => ctx.reTrigger());
        await conversation.waitUntil(
            ctx => ctx.update.update_id === update_id,
            () => console.debug("Update skipped:", ctx.update)
        );
    }

    await ctx.reply("Hey !").then(step);

    if (Math.random() < 0.5) throw new Error("Random error");

    await ctx.reply("Send something").then(step);

    await conversation.waitFor("msg");

    await ctx.reply("Done");

}

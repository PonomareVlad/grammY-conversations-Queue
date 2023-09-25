/**
 * @typedef {import("./bot.mjs").BotContext} BotContext
 * @typedef {import("@grammyjs/conversations").Conversation} Conversation
 *
 * @typedef {Conversation<BotContext>} BotConversation
 */

// console.debug(JSON.stringify(conversation.session.conversation, null, 2));

export async function conversation(conversation, ctx) {

    const {update_id} = ctx.update;

    await ctx.reply("Hey !");
    await conversation.external(() => ctx.reTrigger());
    await conversation.waitUntil(
        ctx => ctx.update.update_id === update_id,
        () => console.debug("Update skipped:", ctx.update)
    );

    await ctx.reply("Send something");
    await conversation.external(() => ctx.reTrigger());
    await conversation.waitUntil(
        ctx => ctx.update.update_id === update_id,
        () => console.debug("Update skipped:", ctx.update)
    );

    await conversation.waitFor("msg");

    await ctx.reply("Done");
    await conversation.external(() => ctx.reTrigger());
    await conversation.waitUntil(
        ctx => ctx.update.update_id === update_id,
        () => console.debug("Update skipped:", ctx.update)
    );

}

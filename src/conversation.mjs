/**
 * @typedef {import("./bot.mjs").BotContext} BotContext
 * @typedef {import("@grammyjs/conversations").Conversation} Conversation
 *
 * @typedef {Conversation<BotContext>} BotConversation
 */

export async function conversation(conversation, ctx) {

    await ctx.reply("Send something");

    console.debug("ctx", ctx.session.conversation);
    console.debug("conversation", conversation.session.conversation);

    await conversation.waitFor("msg");

    await ctx.reply("See logs");

    console.debug("ctx", ctx.session.conversation);
    console.debug("conversation", conversation.session.conversation);

}

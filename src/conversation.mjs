/**
 * @typedef {import("./bot.mjs").BotContext} BotContext
 * @typedef {import("@grammyjs/conversations").Conversation} Conversation
 *
 * @typedef {Conversation<BotContext>} BotConversation
 */

export async function conversation(conversation, ctx) {

    await ctx.reply("Send something");

    console.debug("conversation", JSON.stringify(conversation.session.conversation, null, 2));

    await conversation.waitFor("msg");

    await ctx.reply("See logs");

    console.debug("conversation", JSON.stringify(conversation.session.conversation, null, 2));

}

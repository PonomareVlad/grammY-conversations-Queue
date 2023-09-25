/**
 * @typedef {import("grammy").Context} Context
 * @typedef {import("@grammyjs/types").Chat} Chat
 * @typedef {import("grammy").MiddlewareObj} MiddlewareObj
 * @typedef {import("grammy").SessionFlavor} SessionFlavor
 * @typedef {import("@grammyjs/conversations").ConversationFlavor} ConversationFlavor
 *
 * @typedef {{} & Chat} SessionData
 * @typedef {Context & ConversationFlavor & SessionFlavor<SessionData>} BotContext
 */

import {session} from "grammy";
import {users as collection} from "./db.mjs";
import {conversation} from "./conversation.mjs";
import {Bot, reTrigger} from "grammy-retrigger";
import {MongoDBAdapter} from "@grammyjs/storage-mongodb";
import {conversations, createConversation} from "@grammyjs/conversations";

export const {
    TELEGRAM_BOT_TOKEN: token,
    TELEGRAM_SECRET_TOKEN: secretToken = String(token).split(":").pop()
} = process.env;

export const bot = /** @type {Bot<BotContext>} */ new Bot(token);

bot.use((ctx, next) => globalThis.signal.throwIfAborted() || next());

bot.use(session({
    initial: () => ({}),
    storage: new MongoDBAdapter({collection}),
}));

bot.use(reTrigger(bot));
bot.use(conversations());
bot.callbackQuery("cancel", async ctx => {
    await ctx.conversation.exit();
    await ctx.reply("Canceled");
});
bot.use(createConversation(conversation, "conversation"));
bot.command("start", ctx => ctx.conversation.enter("conversation", {overwrite: true}));

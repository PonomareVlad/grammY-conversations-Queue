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

import {
    Bot,
    session
} from "grammy";
import {
    conversations,
    createConversation,
} from "@grammyjs/conversations";
import {delistify} from "o-son";
import {users as collection} from "./db.mjs";
import {conversation} from "./conversation.mjs";
import {MongoDBAdapter} from "@grammyjs/storage-mongodb";

export const {

    // Telegram bot token from t.me/BotFather
    TELEGRAM_BOT_TOKEN: token,

    // Secret token to validate incoming updates
    TELEGRAM_SECRET_TOKEN: secretToken = String(token).split(":").pop()

} = process.env;

// Default grammY bot instance
export const bot = /** @type {Bot<BotContext>} */ new Bot(token);

bot.use(session({
    initial: () => ({}),
    storage: new MongoDBAdapter({collection}),
}));

bot.use(conversations());

bot.command("debug", ctx => ctx.reply(JSON.stringify(delistify(ctx.session.conversation), null, 2)));

bot.use(createConversation(conversation, "conversation"));

bot.command("start", ctx => ctx.conversation.enter("conversation", {overwrite: true}));

// Sample handler for a simple echo bot
bot.on("message:text", ctx => ctx.reply(ctx.msg.text));

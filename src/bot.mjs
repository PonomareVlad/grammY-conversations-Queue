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

import "grammy-debug-edge";
import {users as collection} from "./db.mjs";
import {conversation} from "./conversation.mjs";
import {MongoDBAdapter} from "@grammyjs/storage-mongodb";
import {Bot, InlineKeyboard, session, reTrigger} from "grammy-retrigger";
import {conversations, createConversation} from "@grammyjs/conversations";

export const {
    TELEGRAM_BOT_TOKEN: token,
    TELEGRAM_SECRET_TOKEN: secretToken = String(token).split(":").pop()
} = process.env;

export const bot = /** @type {Bot<BotContext>} */ new Bot(token);

bot.use(reTrigger(bot));

const safe = bot.errorBoundary(err => {
    const {error: {error_code} = {}} = err;
    if (error_code === 429) throw err;
    console.error(err);
});

safe.use(session({
    initial: () => ({}),
    storage: new MongoDBAdapter({collection}),
}));

safe.use(conversations());
safe.command("restart", ctx => ctx.conversation.exit());
safe.callbackQuery("cancel", ctx => Promise.allSettled([
    ctx.answerCallbackQuery("Canceling..."),
    ctx.editMessageText(`Your text repeated some time(s):`, {}),
    ctx.editMessageReplyMarkup({reply_markup: new InlineKeyboard()}),
    collection.updateOne({key: ctx.chat.id.toString()}, {$set: {tasks: []}}),
]));
safe.use(createConversation(conversation, "conversation"));
safe.command("start", ctx => ctx.conversation.enter("conversation", {overwrite: true}));

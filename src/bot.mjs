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
    session,
} from "grammy";
import {
    conversations,
    createConversation,
} from "@grammyjs/conversations";
import {users as collection} from "./db.mjs";
import {conversation} from "./conversation.mjs";
import {MongoDBAdapter} from "@grammyjs/storage-mongodb";

export const {
    TELEGRAM_BOT_TOKEN: token,
    TELEGRAM_SECRET_TOKEN: secretToken = String(token).split(":").pop()
} = process.env;

class ReTriggerBot extends Bot {
    async handleUpdate(update, webhookReplyEnvelope) {
        do {
            this.retrigger = false;
            await super.handleUpdate(update, webhookReplyEnvelope);
        } while (this.retrigger);
    }
}

// Default grammY bot instance
export const bot = /** @type {Bot<BotContext>} */ new ReTriggerBot(token);

bot.use(session({
    initial: () => ({}),
    storage: new MongoDBAdapter({collection}),
}));

bot.use((ctx, next) => {
    ctx.reTrigger = () => bot.retrigger = true;
    return next();
});

bot.use(conversations());

bot.use(createConversation(conversation, "conversation"));

bot.command("start", ctx => ctx.conversation.enter("conversation", {overwrite: true}));

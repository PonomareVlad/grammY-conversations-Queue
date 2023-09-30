import {bot, secretToken} from "../src/bot.mjs";
import {webhookCallback} from "grammy-retrigger";

export const config = {runtime: "edge"};

// Default grammY handler for incoming updates via webhooks
export default webhookCallback(bot, "std/http", {
    timeoutMilliseconds: 24_000,
    reTriggerTimeout: 20_000,
    secretToken,
});
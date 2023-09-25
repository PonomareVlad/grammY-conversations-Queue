import "grammy-debug-edge";
import {webhookCallback} from "grammy";
import {bot, secretToken} from "../src/bot.mjs";

export const config = {runtime: "edge"};

// Default grammY handler for incoming updates via webhooks
export default (...args) => {
    globalThis.signal = AbortSignal.timeout(20_000);
    return webhookCallback(bot, "std/http", {
        timeoutMilliseconds: 24_000,
        secretToken,
    })(...args);
};

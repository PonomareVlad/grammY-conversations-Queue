import {setWebhookCallback} from "vercel-grammy";
import {bot, secretToken} from "../src/bot.mjs";

export const config = {runtime: "edge"};

// Handler to set webhook url based on request headers
export default setWebhookCallback(bot, {
    drop_pending_updates: true,
    secret_token: secretToken,
    path: "api/update",
    onError: "return"
});

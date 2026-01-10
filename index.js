import { bot, startBot, stopBot } from "./bot.js";
import { ADMIN_CHAT_ID } from "./config.js";

//posting commands
bot.onText(/\/start/, msg => {
  if (String(msg.chat.id) !== ADMIN_CHAT_ID) {
    bot.sendMessage(msg.chat.id, "⛔ You are not authorized.");
    return;
  }
  startBot(msg.chat.id);
});

bot.onText(/\/stop/, msg => {
  if (String(msg.chat.id) !== ADMIN_CHAT_ID) {
    bot.sendMessage(msg.chat.id, "⛔ You are not authorized.");
    return;
  }
  stopBot(msg.chat.id);
});

// cleanup on exit
const shutdown = async () => {
  console.log("\n⏹️ Shutting down bot...");
  stopBot(ADMIN_CHAT_ID);
  await new Promise(r => setTimeout(r, 1000));
  bot.stopPolling();
  console.log("✅ Bot shut down successfully.");
  process.exit(0);
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

// Start the bot immediately
startBot(ADMIN_CHAT_ID);
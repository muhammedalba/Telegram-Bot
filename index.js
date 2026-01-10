import { bot, startBot, stopBot } from "./bot.js";
import { ADMIN_CHAT_ID } from "./config.js";
import express from "express";
// Express app for Webhook
const app = express();
app.use(express.json());
//posting commands
// bot.onText(/\/start/, (msg) => {
//   if (String(msg.chat.id) !== ADMIN_CHAT_ID) {
//     bot.sendMessage(msg.chat.id, "⛔ You are not authorized.");
//     return;
//   }
//   startBot(msg.chat.id);
// });

// bot.onText(/\/stop/, (msg) => {
//   if (String(msg.chat.id) !== ADMIN_CHAT_ID) {
//     bot.sendMessage(msg.chat.id, "⛔ You are not authorized.");
//     return;
//   }
//   stopBot(msg.chat.id);
// });

app.post("/webhook", async (req, res) => {
  const update = req.body;
  console.log("Received update:", req.body);
  if (update.message && update.message.text) {
    const chatId = update.message.chat.id;
    const text = update.message.text;

    if (String(chatId) !== ADMIN_CHAT_ID) {
      await bot.sendMessage(
        chatId,
        "⛔ You are not authorized to use this command."
      );
      return res.sendStatus(200);
    }

    if (text === "/start") await startBot(chatId);
    if (text === "/stop") await stopBot(chatId);
  }

  res.sendStatus(200);
});

// cleanup on exit
const shutdown = async () => {
  console.log("\n⏹️ Shutting down bot...");
  stopBot(ADMIN_CHAT_ID);
  await new Promise((r) => setTimeout(r, 1000));
  bot.stopPolling();
  console.log("✅ Bot shut down successfully.");
  process.exit(0);
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

// Start the bot immediately
// startBot(ADMIN_CHAT_ID);
// ===== Start Express server =====
const PORT = process.env.PORT || 3000;
app.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT}`);
  await bot.sendMessage(ADMIN_CHAT_ID, `Server started on port ${PORT}`);
});

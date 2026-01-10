import TelegramBot from "node-telegram-bot-api";

const BOT_TOKEN = "7924825237:AAEFfVxKSpfpOyPWFLjmv521soCqRgHjZVQ";
const bot = new TelegramBot(BOT_TOKEN, { polling: false });

(async () => {
  try {
    const me = await bot.getMe();
    console.log("Bot Info:", me);
  } catch (error) {
    console.error("Error getting bot info:", error);
  }
})();

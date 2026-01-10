import TelegramBot from "node-telegram-bot-api";
import {
  BOT_TOKEN,
  CHANNEL_ID,
  ADMIN_CHAT_ID,
  POST_INTERVAL,
  POST_DELAY,
  WEBHOOK_URL,
} from "./config.js";
import { getUnpublishedDeals, markDealAsPosted } from "./google.js";
import { escapeHTML, isImageURLValid } from "./utils.js";

// export let bot = new TelegramBot(BOT_TOKEN, { polling: true });
export let bot = new TelegramBot(BOT_TOKEN);
bot.setWebHook(`${WEBHOOK_URL}/webhook`);

let timeoutId = null;
export let isRunning = false;

export async function postAllDeals() {
  const timestamp = new Date().toLocaleString("en-US", {
    timeZone: "Europe/Berlin",
    weekday: "long", //  Monday, Tuesday...
    year: "numeric", //  2026
    month: "long", //  January, February...
    day: "numeric", //  10
    hour: "2-digit", //  08
    minute: "2-digit",
    second: "2-digit",
    hour12: true, // 12-hour format مع AM/PM
  });
  console.log(`[${timestamp}] 🔍 Searching for new deals...`);
  await bot.sendMessage(ADMIN_CHAT_ID, `🔍 Searching for new deals...`);

  try {
    const unpublishedRows = await getUnpublishedDeals();

    if (unpublishedRows.length === 0) {
      console.log("ℹ️ No new deals to post.");
      await bot.sendMessage(ADMIN_CHAT_ID, "ℹ️ No new deals to post.");
      return;
    }

    let successCount = 0;
    for (const row of unpublishedRows) {
      if (!isRunning) {
        console.log("⏹️ Bot stopped during posting.");
        await bot.sendMessage(
          ADMIN_CHAT_ID,
          "⏹️ Bot stopped. Current posting session aborted."
        );
        break;
      }

      const message = `
<b>🔥🔥 Angebot 🔥🔥</b>

<b>✨ Produkt:</b> ${escapeHTML(row.title)}

<b>💰 Preis:</b> ✅ ${escapeHTML(row.price)}€ ❌ <s>${escapeHTML(
        row.old_price
      )}€</s>

<b>Rabatt:</b> -${escapeHTML(row.discount)}%

#Amazon

⬇️ <b>Kauf-Link:</b> ⬇️
${escapeHTML(row.link)}
`;

      try {
        const imageValid = await isImageURLValid(row.image_url);
        if (!imageValid) {
          console.warn(
            `⚠️ Image URL invalid for deal "${row.title}", skipping...`
          );
          await bot.sendMessage(
            ADMIN_CHAT_ID,
            `⚠️ Image URL invalid for deal "${row.title}", skipping this deal.`
          );
          continue;
        }

        await bot.sendPhoto(CHANNEL_ID, row.image_url, {
          caption: message,
          parse_mode: "HTML",
        });

        await markDealAsPosted(row);
        console.log(`✅ Deal posted: ${row.title}`);
        await bot.sendMessage(ADMIN_CHAT_ID, `✅ Deal posted: ${row.title}`);

        await new Promise((r) => setTimeout(r, POST_DELAY));
        successCount++;
      } catch (err) {
        console.error(`❌ Error posting deal "${row.title}":`, err.message);
        await bot.sendMessage(
          ADMIN_CHAT_ID,
          `❌ Error posting deal "${row.title}": ${err.message}`
        );
      }
    }

    console.log(
      `✅ Finished posting session. ${successCount}/${unpublishedRows.length} deals posted successfully.`
    );
    await bot.sendMessage(
      ADMIN_CHAT_ID,
      `✅ Finished posting session. ${successCount}/${unpublishedRows.length} deals posted successfully.`
    );
  } catch (error) {
    console.error("❌ Critical error while posting deals:", error.message);
    await bot.sendMessage(ADMIN_CHAT_ID, `❌ Critical error: ${error.message}`);
  }
}

export function scheduleNextPost() {
  clearTimeout(timeoutId);
  postAllDeals().finally(() => {
    if (isRunning) {
      timeoutId = setTimeout(scheduleNextPost, POST_INTERVAL);
    } else {
      console.log("⏹️ Bot is stopped. Next session will not be scheduled.");
    }
  });
}

export async function startBot(chatId) {
  if (isRunning) {
    await bot.sendMessage(chatId, "✅ Bot is already running.");
    return;
  }
  isRunning = true;
  await bot.sendMessage(
    chatId,
    `🚀 Bot started! Posting all new deals with delay of ${
      POST_DELAY / 1000
    }s. Checking every ${POST_INTERVAL / 60000} minutes.`
  );
  scheduleNextPost();
}

export async function stopBot(chatId) {
  if (!isRunning) {
    await bot.sendMessage(chatId, "ℹ️ Bot is not running.");
    return;
  }
  isRunning = false;
  if (timeoutId) {
    clearTimeout(timeoutId);
    timeoutId = null;
  }
  await bot.sendMessage(
    chatId,
    "⏹️ Bot stopped! No more deals will be posted automatically."
  );
}

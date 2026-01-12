import dotenv from "dotenv";


dotenv.config();

export const ENVIRONMENT = process.env.ENVIRONMENT ?? "production";

export const POST_INTERVAL = (process.env.POST_INTERVAL || 30) * 60 * 1000; // 30 m
export const POST_DELAY = process.env.POST_DELAY || 5000; // 5 s

export const BOT_TOKEN = process.env.BOT_TOKEN;
export const CHANNEL_ID = process.env.CHANNEL_ID;
export const ADMIN_CHAT_ID = process.env.ADMIN_CHAT_ID;

export const CREDS_FILE = process.env.CREDS_FILE;
export const GOOGLE_CREDENTIALS_JSON = process.env.GOOGLE_CREDENTIALS_JSON;
export const SPREADSHEET_ID = process.env.SPREADSHEET_ID;

export const PORT = process.env.PORT || 3000;
export const WEBHOOK_URL =process.env.WEBHOOK_URL;
export const AMAZON_Tag=process.env.AMAZON_Tag;

if (
  !BOT_TOKEN ||
  !CHANNEL_ID ||
  !ADMIN_CHAT_ID ||
  !CREDS_FILE ||
  !WEBHOOK_URL ||
  !GOOGLE_CREDENTIALS_JSON ||
  !AMAZON_Tag ||
  !SPREADSHEET_ID
) {
  console.error("❌ Missing environment variables.");
  process.exit(1);
}

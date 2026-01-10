import dotenv from "dotenv";
dotenv.config();

export const POST_INTERVAL = process.env.POST_INTERVAL ?? 30 * 60 * 1000; // 30 m
export const POST_DELAY = process.env.POST_DELAY ?? 5000; // 5 s 

export const BOT_TOKEN = process.env.BOT_TOKEN;
export const CHANNEL_ID = process.env.CHANNEL_ID;
export const ADMIN_CHAT_ID = process.env.ADMIN_CHAT_ID;

export const CREDS_FILE = process.env.CREDS_FILE;
export const GOOGLE_CREDENTIALS_JSON = process.env.GOOGLE_CREDENTIALS_JSON;
export const SPREADSHEET_ID = process.env.SPREADSHEET_ID;

if (
  !BOT_TOKEN ||
  !CHANNEL_ID ||
  !ADMIN_CHAT_ID ||
  !CREDS_FILE ||
  !SPREADSHEET_ID
) {
  console.error("❌ Missing environment variables.");
  process.exit(1);
}

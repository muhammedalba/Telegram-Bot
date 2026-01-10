import { GoogleSpreadsheet } from "google-spreadsheet";
import fs from "fs";
import {
  CREDS_FILE,
  SPREADSHEET_ID,
  GOOGLE_CREDENTIALS_JSON,
} from "./config.js";

let creds;
try {
  console.log("CREDS length:", process.env.GOOGLE_CREDENTIALS_JSON?.length);
  console.log(
    "CREDS first char:",
    process.env.GOOGLE_CREDENTIALS_JSON?.charAt(0)
  );

  creds = JSON.parse(GOOGLE_CREDENTIALS_JSON);
  // creds = JSON.parse(fs.readFileSync(CREDS_FILE, "utf8"));
} catch (error) {
  console.error("❌ Error loading credentials:", error.message);
  process.exit(1);
}

const doc = new GoogleSpreadsheet(SPREADSHEET_ID);

export async function getUnpublishedDeals() {
  await doc.useServiceAccountAuth(creds);
  await doc.loadInfo();
  const sheet = doc.sheetsByIndex[0];
  const rows = await sheet.getRows();
  return rows.filter((row) => String(row.posted).toLowerCase() === "no");
}

export async function markDealAsPosted(row) {
  row.posted = "yes";
  await row.save();
}

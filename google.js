import { GoogleSpreadsheet } from "google-spreadsheet";
import fs from "fs";
import {
  CREDS_FILE,
  SPREADSHEET_ID,
  GOOGLE_CREDENTIALS_JSON,
  ENVIRONMENT,
} from "./config.js";

let creds;

try {
  if (ENVIRONMENT === "development") {
    creds = JSON.parse(fs.readFileSync(CREDS_FILE, "utf8"));
  }
  creds = JSON.parse(GOOGLE_CREDENTIALS_JSON);
  //
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

export async function clearAllRowsFromSheet(sheetId, keepHeader = true) {
  await doc.useServiceAccountAuth(creds);
  await doc.loadInfo();
  const sheet = doc.sheetsByIndex[0];
  //  const sheet = doc.sheetsByTitle["angebote"];
  if (!sheet) {
    throw new Error("Sheet not found");
  }

  const totalRows = sheet.rowCount;

  // إذا لم يكن هناك بيانات
  if (totalRows <= (keepHeader ? 1 : 0)) {
    return;
  }

  const startIndex = keepHeader ? 1 : 0;

  await doc._makeSingleUpdateRequest("deleteDimension", {
    range: {
      sheetId: sheet.sheetId,
      dimension: "ROWS",
      startIndex: startIndex,
      endIndex: totalRows,
    },
  });
}

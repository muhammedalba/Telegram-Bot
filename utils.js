import fetch from "node-fetch";

export function escapeHTML(text) {
  if (!text) return "";
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

// Check if an image URL is valid by sending a HEAD request
export async function isImageURLValid(url) {
  try {
    const response = await fetch(url, { method: "HEAD" });
    return response.ok && response.headers.get("content-type")?.startsWith("image/");
  } catch (err) {
    return false;
  }
}

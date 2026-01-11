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
    return (
      response.ok && response.headers.get("content-type")?.startsWith("image/")
    );
  } catch (err) {
    return false;
  }
}

export function extractASIN(url) {
  if (!url) return null;

  const match = url.match(/\/(dp|gp\/product|product)\/([A-Z0-9]{10})/i);

  return match ? match[2].toUpperCase() : null;
}

export function buildDisplayAmazonLink(asin, tag) {
  if (!asin) return null;
  return `https://www.amazon.de/dp/${asin}?tag=${tag}`;
}

import { chromium } from "playwright-core";

// Force Node.js runtime (Edge won't work with Playwright)
export const runtime = "nodejs";

export async function POST(req: Request) {
try {
const { html } = await req.json();


const browser = await chromium.launch({
  headless: true,
  args: ["--no-sandbox", "--disable-setuid-sandbox"],
});

const page = await browser.newPage();
await page.setContent(html, { waitUntil: "load" });
await page.emulateMedia({ media: "print" });

const pdfBuffer = await page.pdf({
  format: "A4",
  printBackground: true,
  preferCSSPageSize: true,
});

await browser.close();

// Convert Buffer to Uint8Array (safe for Response)
const pdfUint8 = new Uint8Array(pdfBuffer);

return new Response(pdfUint8, {
  headers: {
    "Content-Type": "application/pdf",
    "Content-Disposition": "attachment; filename=invoice.pdf",
  },
});


} catch (error) {
console.error("PDF ERROR:", error);
return new Response("Failed to generate PDF", { status: 500 });
}
}

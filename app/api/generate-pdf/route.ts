import { chromium } from "playwright"; // full playwright, includes Chromium

export const runtime = "nodejs"; // ensures Node runtime on Vercel

export async function POST(req: Request) {
try {
const { html } = await req.json();


// Launch headless Chromium with sandbox flags for Vercel
const browser = await chromium.launch({
  headless: true,
  args: ["--no-sandbox", "--disable-setuid-sandbox"],
});

const page = await browser.newPage();

// Load HTML content
await page.setContent(html, { waitUntil: "load" });

// Render as print so Tailwind print:hidden works
await page.emulateMedia({ media: "print" });

// Generate PDF
const pdfBuffer = await page.pdf({
  format: "A4",
  printBackground: true,
  preferCSSPageSize: true,
});

await browser.close();

// Convert Node Buffer -> Uint8Array for Response
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

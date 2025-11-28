import { chromium } from "playwright-core";

export const runtime = "nodejs"; // critical!

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

    // Convert Buffer to ArrayBuffer for Response
    const arrayBuffer = pdfBuffer.buffer.slice(
      pdfBuffer.byteOffset,
      pdfBuffer.byteOffset + pdfBuffer.byteLength
    );

    return new Response(arrayBuffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": "attachment; filename=invoice.pdf",
      },
    });
  } catch (err) {
    console.error("PDF ERROR:", err);
    return new Response("Failed to generate PDF", { status: 500 });
  }
}

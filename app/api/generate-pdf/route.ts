import { chromium } from "playwright";

export async function POST(req: Request) {
try {
const { html } = await req.json();


    const browser = await chromium.launch();
    const page = await browser.newPage();

    await page.setContent(html, { waitUntil: "load" });
    await page.emulateMedia({ media: "print" });

    const pdfBuffer = await page.pdf({
        format: "A4",
        printBackground: true,
        preferCSSPageSize: true,
    });

    await browser.close();

    // Convert Node Buffer -> Uint8Array for Edge/Serverless environments
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

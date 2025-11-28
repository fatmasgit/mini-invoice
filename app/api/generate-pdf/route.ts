import { chromium } from "playwright";

export async function POST(req: Request) {
try {
const { html } = await req.json();


    const browser = await chromium.launch();
    const page = await browser.newPage();

    // Load HTML into a virtual browser
    await page.setContent(html, { waitUntil: "load" });

    // Render as print so Tailwind print:hidden works
    await page.emulateMedia({ media: "print" });

    // Generate high-quality PDF
    const pdfBuffer = await page.pdf({
        format: "A4",
        printBackground: true,
        preferCSSPageSize: true,
    });

    await browser.close();

    // Convert Buffer -> Uint8Array to satisfy Next.js Response
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

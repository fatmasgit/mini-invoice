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

    // Convert Node Buffer -> Blob
    const pdfBlob = new Blob([pdfBuffer], { type: "application/pdf" });

    return new Response(pdfBlob, {
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

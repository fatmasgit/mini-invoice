import { chromium } from "playwright";

export async function POST(req: Request) {
    try {
        const { html } = await req.json();

        const browser = await chromium.launch();
        const page = await browser.newPage();

        // Load HTML into a virtual browser
        await page.setContent(html, { waitUntil: "load" });

        // IMPORTANT: render in screen mode so colors appear
        await page.emulateMedia({ media:  "print" });

        // Generate high-quality PDF
        const pdf = await page.pdf({
            format: "A4",
            printBackground: true, // enables Tailwind colors
            preferCSSPageSize: true,
        });

        await browser.close();

        return new Response(pdf, {
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

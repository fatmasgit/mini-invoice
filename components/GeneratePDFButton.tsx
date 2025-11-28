"use client";

import { RefObject } from "react";

export default function GeneratePDFButton({
    containerRef,
}: {
    containerRef: RefObject<HTMLDivElement | null>;
}) {
    const onDownload = async () => {
        if (!containerRef.current) return;

        // Extract ONLY your invoice DOM area
        const htmlContent = `
        <html>
        <head>
            <!-- Tailwind v3 supports arbitrary colors -->
            <script src="https://cdn.tailwindcss.com"></script>
        </head>
        <body class="p-6">
            ${containerRef.current.innerHTML}
        </body>
        </html>
        `;

        const response = await fetch("/api/generate-pdf", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ html: htmlContent }),
        });

        const blob = await response.blob();
        const url = URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.href = url;
        a.download = "invoice.pdf";
        a.click();
    };

    return (
        <div className="w-full flex justify-end mt-4">
            <button
                onClick={onDownload}
                className="px-5 py-2 bg-[#2563eb] text-white  text-base font-medium rounded-md shadow-md hover:bg-[#1e4db7] transition"
            >
                Generate PDF
            </button>
        </div>
    );
}

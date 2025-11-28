"use client";

import { RefObject } from "react";

export default function GeneratePDFButton({
    containerRef,
}: {
    containerRef: RefObject<HTMLDivElement | null>;
}) {
    const onDownload = async () => {
        if (!containerRef.current) return;


        // Wrap invoice content in proper HTML
        const htmlContent = `<html>
            

  <head>
    <script src="https://cdn.tailwindcss.com"></script>
  </head>
  <body class="p-6 bg-white">
    ${containerRef.current.innerHTML}
  </body>
</html>`;


        try {
            const response = await fetch("/api/generate-pdf", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ html: htmlContent }),
            });

            if (!response.ok) throw new Error("PDF generation failed");

            const blob = await response.blob();
            const url = URL.createObjectURL(blob);

            const a = document.createElement("a");
            a.href = url;
            a.download = "invoice.pdf";
            document.body.appendChild(a);
            a.click();
            a.remove();
            URL.revokeObjectURL(url);
        } catch (err) {
            console.error("PDF download error:", err);
            alert("Failed to generate PDF.");
        }


    };

    return (<div className="w-full flex justify-end mt-4"> <button
        onClick={onDownload}
        className="px-5 py-2 bg-[#2563eb] text-white text-base font-medium rounded-md shadow-md hover:bg-[#1e4db7] transition"
    >
        Generate PDF </button> </div>
    );
}

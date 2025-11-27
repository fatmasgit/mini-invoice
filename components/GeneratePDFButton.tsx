"use client";

import { RefObject } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export default function GeneratePDFButton({
    containerRef,
}: {
    containerRef: RefObject<HTMLDivElement | null>;
}) {
    const onDownload = async () => {
        if (!containerRef.current) return;

        const element = containerRef.current;

        // HIGH RESOLUTION
        const scale = 3;
        // capture DOM → canvas
        const canvas = await html2canvas(element, {
            scale,
            useCORS: true,
            backgroundColor: null, // keeps original background
            logging: false,
        });

        const imgData = canvas.toDataURL("image/png");

        const pdfWidth = canvas.width;
        const pdfHeight = canvas.height;

        const pdf = new jsPDF({
            orientation: pdfWidth > pdfHeight ? "landscape" : "portrait",
            unit: "px",
            format: [pdfWidth, pdfHeight],
        });

        pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
        pdf.save("invoice.pdf");
    };

    return (
        <div className="w-full flex justify-end mt-4">
            <button
                onClick={onDownload}
                className="px-5 py-2 bg-[#2563eb] text-base font-medium text-white rounded-md shadow-md hover:bg-[#1e4db7] transition"
            >
                Generate PDF
            </button>
        </div>

    );
}

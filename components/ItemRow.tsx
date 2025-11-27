"use client";

import { useRef } from "react";
import { useDrag, useDrop } from "react-dnd";
import { Trash } from "lucide-react";


export default function ItemRow({
    item,
    index,
    selected,
    inputRef,
    onSelect,
    onUpdate,
    onRemove,
    moveItem,
}: {
    item: any;
    index: number;
    selected?: boolean;
    inputRef?: (el: HTMLInputElement | null) => void;
    onSelect?: () => void;
    onUpdate: (payload: any) => void;
    onRemove: () => void;
    moveItem: (from: number, to: number) => void;
}) {
    const ref = useRef<HTMLDivElement | null>(null);

    // DRAG
    const [{ isDragging }, drag] = useDrag({
        type: "ROW",
        item: { index },
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
    });

    // DROP — Smooth midpoint logic
    const [, drop] = useDrop({
        accept: "ROW",
        hover(dragged: any, monitor) {
            if (!ref.current) return;

            const dragIndex = dragged.index;
            const hoverIndex = index;

            // Don't reorder when hovering itself
            if (dragIndex === hoverIndex) return;

            // Position data
            const hoverRect = ref.current.getBoundingClientRect();
            const hoverMiddleY = (hoverRect.bottom - hoverRect.top) / 3;

            const clientOffset = monitor.getClientOffset();
            if (!clientOffset) return;
            const hoverClientY = clientOffset.y - hoverRect.top;

            // Move only if cursor crosses middle
            if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) return;
            if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) return;

            moveItem(dragIndex, hoverIndex);
            dragged.index = hoverIndex;
        },
    });

    drag(drop(ref));

    // Helpers
    const sanitizePriceInput = (val: string) => {
        // allow digits and a single dot
        const cleaned = val.replace(/[^\d.]/g, "");
        // ensure only one dot
        const parts = cleaned.split(".");
        if (parts.length <= 1) return parts[0];
        return parts.shift() + "." + parts.join("");
    };

    return (
        <div
            ref={ref}
            onClick={onSelect}
            className={`flex items-center p-3 transition justify-between cursor-pointer w-full
        ${selected
                    ? "bg-[#eff6ff] border border-[#60a5fa]"
                    : "bg-[#ffffff]"
                }
        ${isDragging ? "opacity-50" : ""}`
            }
        >

            {/* Title */}
            <input
                ref={(el) => {
                    if (typeof inputRef === "function") {
                        inputRef(el);
                    }
                }} value={item.title}
                placeholder="Item title"
                onChange={(e) => onUpdate({ title: e.target.value })}
                className="w-56 p-2 border border-[#d1d5db] rounded outline-none text-sm"
            />

            {/* Quantity */}
            <div className="flex items-center gap-2 w-10">
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onUpdate({ qty: Math.max(1, (item.qty || 1) - 1) });
                    }}
                    className="px-2 py-1 border border-[#d1d5db] rounded select-none"
                >
                    -
                </button>

                <div className="w-7 text-center text-sm">
                    {item.qty ?? 1}
                </div>

                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onUpdate({ qty: (item.qty || 1) + 1 });
                    }}
                    className="px-2 py-1 border border-[#d1d5db] rounded select-none"
                >
                    +
                </button>
            </div>

            {/* Price */}
            <input
                type="text"
                inputMode="decimal"
                value={String(item.price ?? "")}
                onChange={(e) => {
                    const cleaned = sanitizePriceInput(e.target.value);
                    const num = cleaned === "" ? 0 : Number(cleaned);
                    onUpdate({ price: Number.isFinite(num) ? num : 0 });
                }}
                onClick={(e) => e.stopPropagation()}
                className="w-24 p-2 text-start border border-[#d1d5db] rounded outline-none text-sm"
                placeholder="0.00"
            />

            {/* Total */}
            <div className="text-start text-sm font-semibold w-12">
                {((item.qty ?? 1) * (item.price ?? 0)).toFixed(2)}
            </div>

            {/* Trash Button */}
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    onRemove();
                }}
                className="flex w-14 items-center justify-center p-1 text-[#dc2626] hover:text-[#991b1b]"
            >
                <Trash size={20} />
            </button>

        </div>
    );
}

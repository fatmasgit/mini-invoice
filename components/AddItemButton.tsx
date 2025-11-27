"use client";

export default function AddItemButton({ onAdd }: { onAdd: () => void }) {
    return (
        <button
            onClick={onAdd}
            className="px-5 py-2 bg-[rgb(37,99,235)] text-[rgb(255,255,255)] rounded-md shadow-md hover:bg-[rgb(30,77,183)] transition text-base font-medium"
        >
            Add Item
        </button>
    );
}

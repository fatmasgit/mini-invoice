"use client";

import { useRef, useEffect } from "react";

// state hook
import { useItemsReducer } from "@/hooks/useItemsReducer";

// components
import DndProviderClient from "@/components/DndProviderClient";
import ItemRow from "@/components/ItemRow";
import AddItemButton from "@/components/AddItemButton";
import TotalsFooter from "@/components/TotalsFooter";
import GeneratePDFButton from "@/components/GeneratePDFButton";

export default function InvoiceBuilder() {
    const { state, dispatch } = useItemsReducer();
    const { items, selectedId } = state;

    const inputRefs = useRef<Record<string, HTMLInputElement | null>>({});
    const pdfRef = useRef<HTMLDivElement | null>(null); // Only for PDF

    /** Auto-focus selected row input */
    useEffect(() => {
        if (!selectedId) return;
        const el = inputRefs.current[selectedId];
        if (el) {
            el.focus();
            const val = el.value;
            el.setSelectionRange(val.length, val.length);
        }
    }, [selectedId]);

    /** Actions */
    const addItem = () => dispatch({ type: "ADD_ITEM" });

    const updateItem = (id: string, payload: any) =>
        dispatch({ type: "UPDATE_ITEM", id, payload });

    const removeItem = (id: string) =>
        dispatch({ type: "REMOVE_ITEM", id });

    const selectItem = (id: string) =>
        dispatch({ type: "SELECT", id });

    /** Drag & Drop reorder */
    const moveItem = (dragIndex: number, hoverIndex: number) => {
        const list = [...items];
        const [dragged] = list.splice(dragIndex, 1);
        list.splice(hoverIndex, 0, dragged);
        dispatch({ type: "REORDER", items: list });
    };

    /** Invoice Total */
    const total = items.reduce(
        (sum, item) => sum + item.qty * item.price,
        0
    );

    return (
        <DndProviderClient>

            {/* Invoice Display */}
            <div className="mx-auto space-y-4">

                {/* Header + Add Item Button (not in PDF) */}
                <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-semibold text-[rgb(55,65,81)]">
                        Mini Invoice
                    </h2>
                    <AddItemButton onAdd={addItem} />
                </div>

                {/* PDF Container */}
                <div ref={pdfRef} className="space-y-4">

                    {/* Table Header */}
                    <div className="border border-[rgb(156,163,175)] rounded-lg overflow-hidden bg-[rgb(249,250,251)]">
                        <div className="flex items-center p-3 transition justify-between gap-4 px-2 text-sm text-[rgb(75,85,99)] font-semibold">
                            <span className="text-start w-56 block">Product Name</span>
                            <span className="text-start w-10 block">Quantity</span>
                            <span className="text-start w-24 block">Price</span>
                            <span className="text-start w-12 block">Total</span>
                            <span className="text-start w-14 block print:opacity-0 ">Actions</span>
                        </div>

                        {/* Item Rows */}
                        <div className="space-y-1">
                            {items.map((item, index) => (
                                <ItemRow
                                    key={item.id}
                                    item={item}
                                    index={index}
                                    selected={selectedId === item.id}
                                    onSelect={() => selectItem(item.id)}
                                    onUpdate={(data) => updateItem(item.id, data)}
                                    onRemove={() => removeItem(item.id)}
                                    moveItem={moveItem}
                                    inputRef={(el) =>
                                        (inputRefs.current[item.id] = el)
                                    }
                                />
                            ))}
                        </div>

                    </div>

                    {/* Totals */}
                    <TotalsFooter total={total} />

                </div>
                <GeneratePDFButton containerRef={pdfRef} />
            </div>
            {/* PDF Button */}

        </DndProviderClient>
    );
}

"use client";

export default function TotalsFooter({
    total,
}: {
    total: number;
}) {
    // subtotal always equals total
    const subtotal = total;

    // static tax value (edit this number)
    const tax = 0;

    return (
        <div className="w-full flex justify-end mt-5">
            <div className="px-2 py-5 w-64 rounded-lg">

                {/* Subtotal */}
                <div className="flex justify-between text-[rgb(75,85,99)] text-sm mb-2">
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                </div>

                {/* Tax */}
                <div className="flex justify-between text-[rgb(75,85,99)] text-sm mb-4">
                    <span>Tax</span>
                    <span>${tax.toFixed(2)}</span>
                </div>

                {/* Total */}
                <div className="border-t border-[rgb(156,163,175)] pt-3 flex justify-between items-center">
                    <span className="text-base font-semibold">Total:</span>
                    <span className="text-xl font-bold">
                        ${(subtotal + tax).toFixed(2)}
                    </span>
                </div>

            </div>
        </div>
    );
}

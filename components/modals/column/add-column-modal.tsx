"use client";

import { FormEvent, useState } from "react";

type AddColumnModalProps = {
    onClose: () => void;
    onSubmit: (name: string) => Promise<void>;
};

export default function AddColumnModal({ onClose, onSubmit }: AddColumnModalProps) {
    const [name, setName] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("");

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const trimmedName = name.trim();

        if (!trimmedName) {
            setError("Please enter a column name.");
            return;
        }

        try {
            setIsSubmitting(true);
            setError("");
            await onSubmit(trimmedName);
        } catch {
            setError("Unable to create the column. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onMouseDown={onClose}>
            <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl" onMouseDown={(event) => event.stopPropagation()}>
                <h2 className="mb-6 text-xl font-bold text-gray-900">Add New Column</h2>
                <form onSubmit={handleSubmit}>
                    <label className="mb-2 block text-sm font-bold text-gray-600" htmlFor="column-name">Name</label>
                    <input
                        id="column-name"
                        autoFocus
                        value={name}
                        onChange={(event) => setName(event.target.value)}
                        placeholder="e.g. In Review"
                        className="w-full rounded border border-gray-300 px-4 py-2 text-gray-900 outline-none focus:border-purple-600"
                    />
                    {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
                    <div className="mt-6 flex gap-3">
                        <button disabled={isSubmitting} className="flex-1 rounded-full bg-purple-600 py-2 font-bold text-white disabled:opacity-60" type="submit">
                            {isSubmitting ? "Creating..." : "Create Column"}
                        </button>
                        <button className="flex-1 rounded-full bg-gray-100 py-2 font-bold text-purple-600" type="button" onClick={onClose}>Cancel</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

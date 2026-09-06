"use client";

import { FormEvent, useState } from "react";

type AddNewBoardModalProps = {
    onClose: () => void;
    onSubmit: (name: string) => Promise<void>;
};

export default function AddNewBoardModal({ onClose, onSubmit }: AddNewBoardModalProps) {
    const [name, setName] = useState("");
    const [error, setError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const trimmedName = name.trim();

        if (!trimmedName) {
            setError("Please enter a board name.");
            return;
        }

        try {
            setError("");
            setIsSubmitting(true);
            await onSubmit(trimmedName);
        } catch {
            setError("Unable to create the board. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onMouseDown={onClose}>
            <form onSubmit={handleSubmit} onMouseDown={(event) => event.stopPropagation()} className="w-full max-w-md rounded-lg bg-white p-6 text-gray-900 shadow-xl">
                <h1 className="mb-6 text-xl font-bold">Add New Board</h1>
                <label htmlFor="boardName" className="mb-2 block text-sm font-bold text-gray-600">Board name</label>
                <input id="boardName" autoFocus value={name} placeholder="e.g. Web Design" onChange={(event) => setName(event.target.value)} className="w-full rounded border border-gray-300 px-4 py-2 outline-none focus:border-purple-600" />
                {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
                <div className="mt-6 flex gap-3">
                    <button type="submit" disabled={isSubmitting} className="flex-1 rounded-full bg-purple-600 py-2 font-bold text-white disabled:opacity-60">{isSubmitting ? "Creating..." : "Create New Board"}</button>
                    <button type="button" onClick={onClose} className="flex-1 rounded-full bg-gray-100 py-2 font-bold text-purple-600">Cancel</button>
                </div>
            </form>
        </div>
    );
}

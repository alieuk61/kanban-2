"use client";

import { useState } from "react";
import type { Board } from "@/types/types";

type DeleteBoardModalProps = {
    board: Board;
    onClose: () => void;
    onDelete: (boardId: number) => Promise<void>;
};

export default function DeleteBoardModal({ board, onClose, onDelete }: DeleteBoardModalProps) {
    const [isDeleting, setIsDeleting] = useState(false);
    const [error, setError] = useState("");

    async function handleDelete() {
        try {
            setError("");
            setIsDeleting(true);
            await onDelete(Number(board.id));
        } catch {
            setError("Unable to delete the board. Please try again.");
            setIsDeleting(false);
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onMouseDown={onClose}>
            <div className="w-full max-w-md rounded-lg bg-white p-6 text-gray-900 shadow-xl" onMouseDown={(event) => event.stopPropagation()}>
                <h1 className="text-xl font-bold text-[#EA5555]">Delete this Board?</h1>
                <p className="mt-4 text-sm leading-6 text-gray-500">
                    Are you sure you want to delete the &lsquo;{board.name}&rsquo; board? This will delete all of its columns, tasks, and subtasks. This action cannot be reversed.
                </p>
                {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
                <div className="mt-6 flex gap-3">
                    <button type="button" disabled={isDeleting} onClick={handleDelete} className="flex-1 rounded-full bg-[#EA5555] py-2 font-bold text-white disabled:opacity-60">
                        {isDeleting ? "Deleting..." : "Delete"}
                    </button>
                    <button type="button" disabled={isDeleting} onClick={onClose} className="flex-1 rounded-full bg-gray-100 py-2 font-bold text-purple-600 disabled:opacity-60">Cancel</button>
                </div>
            </div>
        </div>
    );
}

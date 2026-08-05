"use client";

import { FormEvent, useState } from "react";
import type { Column } from "@/types/types";

export type NewTaskValues = {
    columnId: number;
    title: string;
    description: string;
    subtasks: string[];
};

type AddTaskModalProps = {
    columns: Column[];
    onClose: () => void;
    onSubmit: (values: NewTaskValues) => Promise<void>;
};

export function AddTaskModal({ columns, onClose, onSubmit }: AddTaskModalProps) {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [columnId, setColumnId] = useState(columns[0]?.id ?? 0);
    const [subtasks, setSubtasks] = useState([""]);
    const [error, setError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        if (!title.trim() || !columnId) {
            setError("A title and status are required.");
            return;
        }

        try {
            setError("");
            setIsSubmitting(true);
            await onSubmit({
                columnId,
                title: title.trim(),
                description: description.trim(),
                subtasks: subtasks.map((item) => item.trim()).filter(Boolean),
            });
        } catch {
            setError("Unable to create the task. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    }

    function updateSubtask(index: number, value: string) {
        setSubtasks((current) =>
            current.map((item, itemIndex) => itemIndex === index ? value : item)
        );
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onMouseDown={onClose}>
            <form
                onSubmit={handleSubmit}
                onMouseDown={(event) => event.stopPropagation()}
                className="w-full max-w-lg rounded-lg bg-white p-6 text-gray-900 shadow-xl"
            >
                <h1 className="mb-6 text-xl font-bold">Add New Task</h1>
                <div className="flex flex-col gap-4">
                    <label className="flex flex-col gap-1 font-medium">
                        Title
                        <input autoFocus value={title} onChange={(event) => setTitle(event.target.value)} placeholder="e.g. Take coffee break" className="rounded border px-3 py-2" />
                    </label>
                    <label className="flex flex-col gap-1 font-medium">
                        Description
                        <textarea value={description} onChange={(event) => setDescription(event.target.value)} placeholder="e.g. It’s always good to take a break" className="min-h-24 resize-none rounded border px-3 py-2" />
                    </label>
                    <div>
                        <span className="font-medium">Subtasks</span>
                        {subtasks.map((subtask, index) => (
                            <div className="mt-2 flex gap-2" key={index}>
                                <input value={subtask} onChange={(event) => updateSubtask(index, event.target.value)} placeholder="e.g. Make coffee" className="flex-1 rounded border px-3 py-2" />
                                <button type="button" aria-label="Remove subtask" onClick={() => setSubtasks((current) => current.filter((_, itemIndex) => itemIndex !== index))}>×</button>
                            </div>
                        ))}
                        <button type="button" onClick={() => setSubtasks((current) => [...current, ""])} className="mt-3 w-full rounded-full bg-purple-50 py-2 font-bold text-purple-600">+ Add New Subtask</button>
                    </div>
                    <label className="flex flex-col gap-1 font-medium">
                        Status
                        <select value={columnId} onChange={(event) => setColumnId(Number(event.target.value))} className="rounded border px-3 py-2">
                            {columns.map((column) => <option key={column.id} value={column.id}>{column.name}</option>)}
                        </select>
                    </label>
                </div>
                {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
                <div className="mt-6 flex gap-3">
                    <button type="submit" disabled={isSubmitting} className="flex-1 rounded-full bg-purple-600 py-2 font-bold text-white disabled:opacity-60">{isSubmitting ? "Creating..." : "Create Task"}</button>
                    <button type="button" onClick={onClose} className="flex-1 rounded-full bg-gray-100 py-2 font-bold text-purple-600">Cancel</button>
                </div>
            </form>
        </div>
    );
}

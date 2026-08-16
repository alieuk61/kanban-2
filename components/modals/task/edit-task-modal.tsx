"use client";

import { FormEvent, useState } from "react";
import type { Column, Subtask, Task } from "@/types/types";

type EditTaskModalProps = {
    onClose: () => void;
    task: Task;
    columns: Column[];
    onSave: (updatedTask: Task) => Promise<void>;
};

export default function EditTaskModal({ onClose, task, columns, onSave }: EditTaskModalProps) {
    const [title, setTitle] = useState(task.title);
    const [description, setDescription] = useState(task.description ?? "");
    const [columnId, setColumnId] = useState(task.column_id);
    const [subtasks, setSubtasks] = useState<Subtask[]>(task.subtasks ?? []);
    const [error, setError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    function updateSubtask(index: number, title: string) {
        setSubtasks((current) => current.map((subtask, subtaskIndex) =>
            subtaskIndex === index ? { ...subtask, title } : subtask
        ));
    }

    function addSubtask() {
        setSubtasks((current) => [
            ...current,
            {
                id: -Date.now(),
                task_id: task.id,
                title: "",
                is_done: false,
                position: current.length + 1,
                created_at: "",
            },
        ]);
    }

    async function handleSave(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const trimmedTitle = title.trim();

        if (!trimmedTitle) {
            setError("Please enter a task title.");
            return;
        }

        try {
            setError("");
            setIsSubmitting(true);
            await onSave({
                ...task,
                title: trimmedTitle,
                description: description.trim() || null,
                column_id: columnId,
                subtasks: subtasks
                    .map((subtask, index) => ({
                        ...subtask,
                        title: subtask.title.trim(),
                        position: index + 1,
                    }))
                    .filter((subtask) => Boolean(subtask.title)),
            });
        } catch {
            setError("Unable to save the task. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <div onMouseDown={onClose} className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <form onSubmit={handleSave} onMouseDown={(event) => event.stopPropagation()} className="w-full max-w-lg rounded-lg bg-white p-6 text-black shadow-xl">
                <h1 className="mb-6 text-2xl font-bold">Edit Task</h1>
                <div className="flex flex-col gap-4">
                    <label className="flex flex-col gap-1 font-medium">
                        Title
                        <input autoFocus value={title} onChange={(event) => setTitle(event.target.value)} className="rounded border px-3 py-2" />
                    </label>
                    <label className="flex flex-col gap-1 font-medium">
                        Description
                        <textarea value={description} onChange={(event) => setDescription(event.target.value)} className="min-h-28 resize-none rounded border px-3 py-2" />
                    </label>
                    <div>
                        <span className="font-medium">Subtasks</span>
                        {subtasks.map((subtask, index) => (
                            <div key={subtask.id} className="mt-2 flex gap-2">
                                <input value={subtask.title} onChange={(event) => updateSubtask(index, event.target.value)} className="flex-1 rounded border px-3 py-2" />
                                <button type="button" aria-label="Remove subtask" onClick={() => setSubtasks((current) => current.filter((_, subtaskIndex) => subtaskIndex !== index))}>×</button>
                            </div>
                        ))}
                        <button type="button" onClick={addSubtask} className="mt-3 w-full rounded-full bg-purple-50 py-2 font-bold text-purple-600">+ Add New Subtask</button>
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
                    <button type="submit" disabled={isSubmitting} className="flex-1 rounded-full bg-purple-600 py-2 font-bold text-white disabled:opacity-60">{isSubmitting ? "Saving..." : "Save Changes"}</button>
                    <button type="button" onClick={onClose} className="flex-1 rounded-full bg-gray-100 py-2 font-bold text-purple-600">Cancel</button>
                </div>
            </form>
        </div>
    );
}

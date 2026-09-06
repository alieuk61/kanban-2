import type { Subtask } from "@/types/types";

type SubtaskCardProps = {
    subtask: Subtask;
    isUpdating: boolean;
    onChange: (isDone: boolean) => Promise<void>;
};

export default function SubtaskCard({ subtask, isUpdating, onChange }: SubtaskCardProps) {
    return (
        <label className="flex cursor-pointer items-center gap-3 rounded bg-gray-100 p-3 hover:bg-purple-100">
            <input
                type="checkbox"
                checked={subtask.is_done}
                disabled={isUpdating}
                onChange={(event) => onChange(event.target.checked)}
                className="h-4 w-4 accent-purple-600 disabled:cursor-wait"
            />
            <span className={subtask.is_done ? "text-gray-400 line-through" : "text-gray-900"}>
                {subtask.title}
            </span>
        </label>
    );
}

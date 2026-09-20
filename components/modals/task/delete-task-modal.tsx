import { Task } from "@/types/types";

type DeleteTaskModalProps = {
    task: Task | null;
    onClose: () => void;
    onDelete: (task: Task) => Promise<void> | void;
};

export default function DeleteTaskModal({
    task,
    onClose,
    onDelete,
        }: DeleteTaskModalProps) {

    if (!task) return null;
    const taskToDelete = task;

    async function handleDelete() {
        await onDelete(taskToDelete);
        onClose();
    }

    return(
        <div className="fixed top-0 right-0 bottom-0 left-0 z-[9999] flex items-center justify-center bg-black/50">
        <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-md w-120 h-58">
            <h1 className="text-[#EA5555]">Delete this task?</h1>
            <p>Are you sure you want to delete the ‘{task.title}’ task and its subtasks? This action cannot be reversed.</p>
            
                <div className="flex gap-3">
                    <button
                        type="button"
                        onClick={handleDelete}
                        className="w-full rounded-2xl bg-red-500 py-2 text-white cursor-pointer"
                    >
                        Delete
                    </button>

                    <button
                        type="button"
                        onClick={onClose}
                        className="w-full rounded-2xl bg-purple-100 py-2 text-purple-600"
                    >
                        Cancel
                    </button>
                </div>
        </div>
        </div>
    )
}

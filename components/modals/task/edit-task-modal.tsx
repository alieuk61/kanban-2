import { useEffect, useState } from "react";
import { useAppContext } from "@/context/kanban-context";
import { Subtask } from "@/types/types";
import type { Task } from "@/types/types";
import AddTaskButton from "@/components/buttons/task/add-subtask";

type EditTaskModalProps = {
    onClose: () => void;
    task: Task | null;
    onSave: (updatedTask: Task) => Promise<void> | void;
};

export default function EditTaskModal({
    onClose,
    task,
    onSave
}: EditTaskModalProps) {

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [newSubtasks, setNewSubtasks] = useState<Subtask[]>([])

    useEffect(() => {
        if (task) {
            setTitle(task.title || "");
            setDescription(task.description || "");
        }
    }, [task]);

    if (!task) return null;

    function handleSave() {
        if (!task) return;

        const updatedTask: Task = {
            ...task,
            title,
            description,
        };

        console.log("EditTaskModal handleSave fired", updatedTask);

        // props passed from a different file
        onSave( updatedTask);
        onClose();
    }


    return(
        <div
            onClick={onClose}
            className="fixed top-0 right-0 bottom-0 left-0 z-[9999] flex items-center justify-center bg-black/50"
        >
        <div 
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-md text-black w-120 h-168.75"
        >
            <h1 className="font-bold text-2xl">Edit Task</h1>
            <div className="flex flex-col">
                <label htmlFor="">Title</label>
                <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
            </div>

            <div>
                <label htmlFor="">Description</label>
                <textarea 
                name="" 
                id=""
                className="resize-none w-full min-h-28"
                placeholder="e.g. It’s always good to take a break. This 15 minute break will 
                recharge the batteries a little."  
                value={description} 
                onChange={(e) => setDescription(e.target.value)}

                ></textarea>
            </div>
            <div>
                <label htmlFor="">Subtasks</label>
                <div>
                    {/* loop through subtasks */}
                </div>
            </div>
                <AddTaskButton />
                <button
                    type="button"
                    onClick={handleSave}
                    className="w-full h-10 rounded-2xl bg-purple-500 cursor-pointer"
                >
                    Save Changes
                </button>
        </div>
        </div>
    )
}
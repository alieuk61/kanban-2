import { Subtask } from "@/types/types"

export default function AddSubTaskButton({
    subtasks,
    setSubtasks,
}: {
    subtasks: Subtask[];
    setSubtasks: React.Dispatch<React.SetStateAction<Subtask[]>>;
}) {
    function handleAddSubtask() {
        const newSubtask: Subtask = {
            id: Date.now(),
            task_id: 0,
            title: "",
            is_done: false,
            position: subtasks.length + 1,
            created_at: new Date().toISOString(),
        };

        setSubtasks([...subtasks, newSubtask]);
    }

   

    return(
        <button 
        className="p-5 bg-purple-600"
        onClick={handleAddSubtask}
        >
           + Add New Subtask
        </button>
    )
}

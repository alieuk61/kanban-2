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
            title: "",
            is_done: false,
            position: subtasks.length,
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
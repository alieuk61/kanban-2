import type { Subtask, Task } from "@/types/types";
import { useState, useEffect } from "react";
import { useAppContext } from "@/context/kanban-context";
import elipsesIcon from '../../../public/ellipsis.svg'
import Image from "next/image";
import TaskActionsDropdown from "@/components/dropdowns/task-options";

export default function ViewTaskModal({
  columnId,
  task,
  onClose,
  onEditTask,
  onDeleteTask
}: {
  columnId: number;
  task: Task;
  onClose: () => void;
  onEditTask: () => void;
  onDeleteTask: () => void;
}) {

  const [subtasks, setSubtasks] = useState<Subtask[]>([]);
  const {getSubtasksByTask, chosenBoardId} = useAppContext();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  // since theres only one elipses ill track if its being clicked

  useEffect(() => {
    async function loadSubtasks() {
      if (!chosenBoardId) return;

      console.log('task ids: ', task.id);

      const data = await getSubtasksByTask(
        Number(chosenBoardId),
        Number(columnId),
        Number(task.id)
      );
      console.log("subtasks data:", data, Array.isArray(data));
      setSubtasks(data);
    }

    loadSubtasks();
  }, [chosenBoardId, columnId, task.id]);



  return (
    <div
      onClick={onClose}
      className="fixed top-0 right-0 bottom-0 left-0 z-[9999] flex items-center justify-center bg-black/50"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-[500px] min-h-[500px] rounded-xl bg-white p-6 text-black shadow-2xl"
      >
        <section className="flex justify-between">
          <h1 className="text-2xl font-bold">{task.title}</h1>

          <div className="relative">
          <button
            type="button"
            className="cursor-pointer"
            onClick={() => setIsDropdownOpen((prev) => !prev)}
          >
            <Image
              src={elipsesIcon}
              alt="Task options"
              height={20}
              width={20}
            />
          </button>

          {isDropdownOpen && (
            <div className="absolute -right-25 top-8">
              <TaskActionsDropdown
                toggleEdit={onEditTask}
                toggleDelete={onDeleteTask}
              />
            </div>
          )}
          </div>
        </section>

        <div className="w-full min-h-[70px] rounded-md text-gray-500 p-3">
          {task.description || "No description provided"}
        </div>

        <div>
          <h4>
            Subtasks ({Array.isArray(subtasks) ? subtasks.filter((s) => s.is_done).length : 0} of {Array.isArray(subtasks) ? subtasks.length : 0})
            {/* we filter the whole array get all the ones with is_done being true and get the length */}
          </h4>
          <section>
            {/* map through subtasks */}
          </section>
        </div>

        <section>
          <h4>Current status</h4>
        </section>
      </div>
    </div>
  );
}

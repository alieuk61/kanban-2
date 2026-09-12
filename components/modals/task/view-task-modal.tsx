import type { Column, Subtask, Task } from "@/types/types";
import { useState, useEffect } from "react";
import { useAppContext } from "@/context/kanban-context";
import elipsesIcon from '../../../public/ellipsis.svg'
import Image from "next/image";
import TaskActionsDropdown from "@/components/dropdowns/task-options";
import SubtaskCard from "@/components/cards/subtask-card";

export default function ViewTaskModal({
  columnId,
  task,
  columns,
  onClose,
  onEditTask,
  onDeleteTask,
  onStatusChange
}: {
  columnId: number;
  task: Task;
  columns: Column[];
  onClose: () => void;
  onEditTask: () => void;
  onDeleteTask: () => void;
  onStatusChange: (destinationColumnId: number) => Promise<void>;
}) {

  const [subtasks, setSubtasks] = useState<Subtask[]>([]);
  const {getSubtasksByTask, updateSubtaskCompletion, chosenBoardId} = useAppContext();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [updatingSubtaskId, setUpdatingSubtaskId] = useState<number | null>(null);
  const [subtaskError, setSubtaskError] = useState("");
  const [isStatusUpdating, setIsStatusUpdating] = useState(false);
  const [statusError, setStatusError] = useState("");
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
    // The context function is intentionally omitted because it is recreated by the provider.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chosenBoardId, columnId, task.id]);

  async function handleSubtaskChange(subtask: Subtask, isDone: boolean) {
    if (!chosenBoardId) return;

    try {
      setSubtaskError("");
      setUpdatingSubtaskId(subtask.id);
      const updatedSubtask = await updateSubtaskCompletion(
        Number(chosenBoardId),
        Number(columnId),
        Number(task.id),
        Number(subtask.id),
        isDone
      );
      setSubtasks((current) => current.map((item) =>
        item.id === updatedSubtask.id ? updatedSubtask : item
      ));
    } catch {
      setSubtaskError("Unable to update the subtask. Please try again.");
    } finally {
      setUpdatingSubtaskId(null);
    }
  }

  async function handleStatusChange(destinationColumnId: number) {
    if (destinationColumnId === Number(task.column_id)) return;

    try {
      setStatusError("");
      setIsStatusUpdating(true);
      await onStatusChange(destinationColumnId);
    } catch {
      setStatusError("Unable to change the task status. Please try again.");
    } finally {
      setIsStatusUpdating(false);
    }
  }



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
            <div className="mt-3 flex flex-col gap-2">
              {subtasks.map((subtask) => (
                <SubtaskCard
                  key={subtask.id}
                  subtask={subtask}
                  isUpdating={updatingSubtaskId === subtask.id}
                  onChange={(isDone) => handleSubtaskChange(subtask, isDone)}
                />
              ))}
            </div>
            {subtaskError && <p className="mt-2 text-sm text-red-600">{subtaskError}</p>}
          </section>
        </div>

        <section>
          <label htmlFor="task-status" className="mt-5 flex flex-col gap-2 font-medium">
            Current status
            <select
              id="task-status"
              value={task.column_id}
              disabled={isStatusUpdating}
              onChange={(event) => handleStatusChange(Number(event.target.value))}
              className="rounded border border-gray-300 px-3 py-2 disabled:cursor-wait disabled:opacity-60"
            >
              {columns.map((column) => (
                <option key={column.id} value={column.id}>
                  {column.name}
                </option>
              ))}
            </select>
          </label>
          {statusError && <p className="mt-2 text-sm text-red-600">{statusError}</p>}
        </section>
      </div>
    </div>
  );
}

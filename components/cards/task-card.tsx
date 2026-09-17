import { Task } from "@/types/types";

export default function TaskCard({
  task,
  onClick,
  onDragStart,
  onDragEnd,
}: {
  task: Task;
  onClick: () => void;
  onDragStart: (event: React.DragEvent<HTMLDivElement>) => void;
  onDragEnd: () => void;
}) {
    return(
        <div
        draggable
        onClick={onClick}
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
        className="bg-white p-2 rounded-lg flex flex-col cursor-grab active:cursor-grabbing active:opacity-50">
            <h2>{task.title}</h2>
            <p className="text-sm text-gray-500">
                {task.completed_subtasks} of {task.total_subtasks} subtasks
            </p>
        </div>
    )
}




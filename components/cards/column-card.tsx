import { DragEvent, useEffect, useState } from "react";
import { useAppContext } from "@/context/kanban-context";
import TaskCard from "./task-card";
import type { Column, Task } from "@/types/types";

type ColumnCardProps = {
    column: Column;
    onTaskClick: (task: Task) => void;
    onTaskDrop: (taskId: number, sourceColumnId: number, destinationColumnId: number) => Promise<void>;
    taskRefreshKey: number;
};

export default function ColumnCard({ column, onTaskClick, onTaskDrop, taskRefreshKey }: ColumnCardProps) {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [isDragOver, setIsDragOver] = useState(false);
    const { getTasksByColumn, chosenBoardId } = useAppContext();

    useEffect(() => {
        async function loadTasks() {
            if (!chosenBoardId) return;

            const data = await getTasksByColumn(
                Number(chosenBoardId),
                Number(column.id)
            );
            setTasks(data);
        }

        loadTasks();
    }, [chosenBoardId, column.id, taskRefreshKey]);

    function handleDragStart(event: DragEvent<HTMLDivElement>, task: Task) {
        event.dataTransfer.effectAllowed = "move";
        event.dataTransfer.setData("application/json", JSON.stringify({
            taskId: task.id,
            sourceColumnId: task.column_id,
        }));
    }

    function handleDragOver(event: DragEvent<HTMLDivElement>) {
        event.preventDefault();
        event.dataTransfer.dropEffect = "move";
        setIsDragOver(true);
    }

    async function handleDrop(event: DragEvent<HTMLDivElement>) {
        event.preventDefault();
        setIsDragOver(false);

        try {
            const data = JSON.parse(event.dataTransfer.getData("application/json"));
            if (typeof data.taskId !== "number" || typeof data.sourceColumnId !== "number") return;
            if (data.sourceColumnId === column.id) return;

            await onTaskDrop(data.taskId, data.sourceColumnId, column.id);
        } catch {
            // Ignore drops that did not originate from one of our task cards.
        }
    }

    return (
        <div
            onDragOver={handleDragOver}
            onDragLeave={() => setIsDragOver(false)}
            onDrop={handleDrop}
            className={`min-w-72 rounded-md p-4 text-black mr-2 transition-colors ${isDragOver ? "bg-purple-200" : ""}`}
        >
            <h2 className="mb-4 font-bold">{column.name}</h2>

            {tasks.length > 0
                ? tasks.map((t) => (
                    <div key={t.id}>
                        <TaskCard
                            task={t}
                            onClick={() => onTaskClick(t)}
                            onDragStart={(event) => handleDragStart(event, t)}
                            onDragEnd={() => setIsDragOver(false)}
                        />
                    </div>
                ))
                : null}

        </div>
    );
}

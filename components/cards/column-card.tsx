import { useContext, useEffect, useState } from "react";
import { useAppContext } from "@/context/kanban-context";
import TaskCard from "./task-card";
import type { Column, Task } from "@/types/types";

export default function ColumnCard({ column }: { column: Column }){

    const [tasks, setTasks] = useState<Task[]>([]);
    const { getTasksByColumn, chosenBoardId } = useAppContext();

    useEffect(() => {
        async function loadTasks() {
            if (!chosenBoardId) return;

            const data = await getTasksByColumn(Number(chosenBoardId), Number(column.id));
            setTasks(data);
        }

        loadTasks();
    }, [chosenBoardId, column.id]);


    return (
        <div className="min-w-72 rounded-md p-4 text-black mr-2">
            <h2 className="mb-4 font-bold ">
                {column.name}
            </h2>

            {tasks.length > 0 ? tasks.map((t) => {
                console.log('tasks: ', tasks)
                return(
                    <div>
                        <TaskCard key={t.id} task={t} />
                    </div>
                )
            }) : null };


        </div>
    );
}

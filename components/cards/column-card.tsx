import { useContext, useEffect } from "react";
import { useAppContext } from "@/context/kanban-context";
import TaskCard from "./task-card";

type Column = {
    id: number;
    name: string;
    tasks?: Task[];
};

type Task = {
    id: number;
    title: string;
};

export default function ColumnCard({ column }: { column: Column }){

    const {tasks} = useAppContext();


    return (
        <div className="min-w-72 rounded-md p-4 text-black">
            <h2 className="mb-4 font-bold ">
                {column.name}
            </h2>

            {tasks && tasks.length > 0 ? tasks.map((t) => {
                return(
                    <div>
                        <TaskCard key={t.id} task={t} />
                    </div>
                )
            })}


        </div>
    );
}

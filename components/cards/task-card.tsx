import { Task } from "@/types/types";
import { useState } from "react";

export default function TaskCard({ task }: { task: Task[] }) {
    return(
        <div className="bg-white p-2 rounded-lg flex flex-col cursor-pointer ">
            <h2>{task.title}</h2>
            <p>completed subtasks out of subtask length</p>
        </div>
    )
}




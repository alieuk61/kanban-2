import { Task, Subtask } from "@/types/types";

export function AddTaskModal (){

    return(
        <div className="w-120 min-h-170 bg-white">
            <h1>Add New Task</h1>

            <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-1">
                    <label htmlFor="title" className="font-medium">
                        Title
                    </label>
                    <input
                        id="title"
                        type="text"
                        placeholder="e.g. Take coffee break"
                        className="border rounded px-3 py-2"
                    />
                </div>

                <div className="flex flex-col gap-1">
                    <label htmlFor="description" className="font-medium">
                        Description
                    </label>
                    <input
                        id="description"
                        type="text"
                        placeholder="e.g. It’s always good to take a break"
                        className="border rounded px-3 py-2"
                    />
                </div>

                <div className="flex flex-col gap-1">
                    <label htmlFor="subtasks" className="font-medium">
                        Subtasks
                    </label>
                    <input
                        id="subtasks"
                        type="text"
                        placeholder="e.g. Make coffee"
                        className="border rounded px-3 py-2"
                    />
                </div>
            </div>
        </div>
    )
}
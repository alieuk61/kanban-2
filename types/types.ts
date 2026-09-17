export type Subtask = {
    id: number;
    task_id: number;
    title: string;
    is_done: boolean;
    position: number;
    created_at: string;
}

export type Task = {
    id: number;
    column_id: number;
    title: string;
    description: string | null;
    position: number;
    created_at: string;
    updated_at: string;
    subtasks: Subtask[];
    total_subtasks: number;
    completed_subtasks: number;
}

export type Column = {
    id: number;
    board_id: number;
    name: string;
    position: number;
    created_at: string;
    tasks: Task[];
}

export type Board = {
    id: number;
    name: string;
    created_at: string;
    columns: Column[]
}


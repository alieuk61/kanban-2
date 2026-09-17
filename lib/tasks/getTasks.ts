import { dbQuery } from "../db";
import { ApiError } from "../errors";
import type { Task } from "@/types/types";

export async function getAllTasks (columnId: number)  {
    try {

        const result = await dbQuery(
            `SELECT
                t.id,
                t.column_id,
                t.title,
                t.description,
                t.position,
                t.created_at,
                t.updated_at,
                COUNT(s.id)::int AS total_subtasks,
                COUNT(s.id) FILTER (WHERE s.is_done)::int AS completed_subtasks
             FROM tasks t
             LEFT JOIN subtasks s ON s.task_id = t.id
             WHERE t.column_id = $1
             GROUP BY t.id
             ORDER BY t.position;`,
            [columnId]
        );
        
        return result.rows;

    } catch (error) {
        if (error instanceof ApiError) {
            throw error;
        }
        
        throw new ApiError("server error", 500);
    }
}

export async function getTask(
    boardId: number,
    columnId: number,
    taskId: number
) {
    const result = await dbQuery(
        `SELECT *
     FROM tasks
     WHERE id = $1 AND column_id = $2
     LIMIT 1;`,
        [taskId, columnId]
    );

    return result.rows[0] || null;
}

export async function updateTaskById(
    boardId: number,
    columnId: number,
    taskId: number,
    updatedTask: Partial<Task>
) {
    const result = await dbQuery(
        `UPDATE tasks
     SET title = $1,
         description = $2,
         updated_at = now()
     WHERE id = $3 AND column_id = $4
     RETURNING *;`,
        [updatedTask.title, updatedTask.description, taskId, columnId]
    );

    return result.rows[0] || null;
}

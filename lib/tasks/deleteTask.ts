import { dbQuery } from "../db";
import { ApiError } from "../errors";
import type { Task } from "@/types/types";

export async function deleteTaskById(columnId: number, taskId: number) {
    const result = await dbQuery(
        `DELETE FROM tasks
     WHERE id = $1 AND column_id = $2
     RETURNING *;`,
        [taskId, columnId]
    );

    return result.rows[0] || null;
}
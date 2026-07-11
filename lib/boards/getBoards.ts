import { ApiError } from "@/lib/errors";
import { Board } from "@/types/types";
import { dbQuery } from "../db";

export async function getAllBoards() {
    const boards = await dbQuery(
        'SELECT * FROM boards;'
    )
    const columns = await dbQuery(
        `select * FROM columns ORDER BY position;`
    )
    const tasks = await dbQuery(
        
        `SELECT
        c.id AS column_id,
        t.id AS task_id,
        t.title,
        t.description,
        t.position AS task_position,
        s.id AS subtask_id,
        s.title AS subtask_title,
        s.is_done,
        s.position AS subtask_position
        FROM columns c
        LEFT JOIN tasks t ON t.column_id = c.id
        LEFT JOIN subtasks s ON s.task_id = t.id
        ORDER BY c.position, t.position, s.position`
    )
    if (boards.rows.length === 0) {
        throw new ApiError("Boards not found", 404);
    } else if (columns.rows.length === 0){
        throw new ApiError("Columns not found", 404);
    } else if (tasks.rows.length === 0) {
        throw new ApiError("tasks not found", 404)
    }
    
    console.log("all boards:", {
        boards: boards.rows
    });

    return boards.rows;
}

export async function getBoard(id: number) {
    const result = await dbQuery(
        'SELECT * FROM boards WHERE id = $1 ORDER BY id',
        [id]
    );
    if (result.rows.length === 0) {
        throw new ApiError("Board not found", 404);
    }

    console.log('specific board: ', result.rows)
    return result.rows[0]
}
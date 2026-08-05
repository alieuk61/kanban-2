import { ApiError } from "@/lib/errors";
import { getAllTasks } from "@/lib/tasks/getTasks";
import { NextResponse } from "next/server";
import { pool } from "@/lib/db";

type Params = {
    boardId: string;
    columnId: string;
}

export async function GET(req: Request, context: {params: Promise<Params>}) {
    try {
        console.log('we have made it here')
        const {columnId} = await context.params;
        const tasks = await getAllTasks(Number(columnId));
         return NextResponse.json(tasks, { status: 200 });
    } catch (error) {
        if (error instanceof ApiError) {
            return NextResponse.json(
                { error: error.message },
                { status: error.status }
            );
        }
        
        return NextResponse.json({error: "Internal server error" }, { status: 500 })
    }
}

export async function POST(req: Request, context: {params: Promise<Params>}) {
    const client = await pool.connect();

    try {
        const { boardId, columnId } = await context.params;
        const numericBoardId = Number(boardId);
        const numericColumnId = Number(columnId);
        const body = await req.json();
        const title = typeof body.title === "string" ? body.title.trim() : "";
        const description = typeof body.description === "string" ? body.description.trim() : "";
        const subtasks = Array.isArray(body.subtasks)
            ? body.subtasks
                .filter((item: unknown): item is string => typeof item === "string" && Boolean(item.trim()))
                .map((item: string) => item.trim())
            : [];

        if (!Number.isInteger(numericBoardId) || !Number.isInteger(numericColumnId) || !title) {
            return NextResponse.json(
                { error: "A valid board, column, and title are required" },
                { status: 400 }
            );
        }

        await client.query("BEGIN");
        const taskResult = await client.query(
            `INSERT INTO tasks (column_id, title, description, position)
             SELECT c.id, $3, $4,
               COALESCE((SELECT MAX(t.position) FROM tasks t WHERE t.column_id = c.id), 0) + 1
             FROM columns c
             WHERE c.id = $2 AND c.board_id = $1
             RETURNING id, column_id, title, description, position, created_at, updated_at`,
            [numericBoardId, numericColumnId, title, description || null]
        );

        if (!taskResult.rows[0]) {
            await client.query("ROLLBACK");
            return NextResponse.json({ error: "Column not found on this board" }, { status: 404 });
        }

        const createdSubtasks = [];
        for (let index = 0; index < subtasks.length; index += 1) {
            const subtaskResult = await client.query(
                `INSERT INTO subtasks (task_id, title, position)
                 VALUES ($1, $2, $3)
                 RETURNING id, task_id, title, is_done, position, created_at`,
                [taskResult.rows[0].id, subtasks[index], index + 1]
            );
            createdSubtasks.push(subtaskResult.rows[0]);
        }

        await client.query("COMMIT");
        return NextResponse.json(
            { ...taskResult.rows[0], subtasks: createdSubtasks },
            { status: 201 }
        );
    } catch (error) {
        await client.query("ROLLBACK");
        console.error("POST task failed:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    } finally {
        client.release();
    }
}

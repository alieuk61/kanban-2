import { NextResponse } from "next/server";
import { getTask } from "@/lib/tasks/getTasks";
import { deleteTaskById } from "@/lib/tasks/deleteTask";
import { pool } from "@/lib/db";

export async function GET(
    req: Request,
    {
        params,
    }: {
        params: Promise<{
            boardId: string;
            columnId: string;
            taskId: string;
        }>;
    }
) {
    try {
        const { boardId, columnId, taskId } = await params;
        console.log('get function has been called!!')

        const task = await getTask(
            Number(boardId),
            Number(columnId),
            Number(taskId)
        );

        if (!task) {
            return NextResponse.json({ error: "Task not found" }, { status: 404 });
        }

        return NextResponse.json(task, { status: 200 });
    } catch (error) {
        console.error("Error fetching task:", error);
        return NextResponse.json(
            { error: "Failed to fetch task" },
            { status: 500 }
        );
    }
}

export async function PUT(
    req: Request,
    {
        params,
    }: {
        params: Promise<{
            boardId: string;
            columnId: string;
            taskId: string;
        }>;
    }
) {
    const client = await pool.connect();

    try {
        const { boardId, columnId, taskId } = await params;
        const body = await req.json();
        const numericBoardId = Number(boardId);
        const originalColumnId = Number(columnId);
        const numericTaskId = Number(taskId);
        const destinationColumnId = Number(body.column_id);
        const title = typeof body.title === "string" ? body.title.trim() : "";
        const description = typeof body.description === "string" ? body.description.trim() : "";
        const subtasks = Array.isArray(body.subtasks)
            ? body.subtasks.filter((subtask: unknown) =>
                typeof subtask === "object" && subtask !== null &&
                "title" in subtask && typeof subtask.title === "string" && Boolean(subtask.title.trim())
            )
            : [];

        if (!title || !Number.isInteger(destinationColumnId)) {
            return NextResponse.json({ error: "A title and valid status are required" }, { status: 400 });
        }

        await client.query("BEGIN");
        const taskResult = await client.query(
            `UPDATE tasks
             SET title = $1,
                 description = $2,
                 column_id = $3,
                 position = CASE
                    WHEN column_id = $3 THEN position
                    ELSE COALESCE((SELECT MAX(position) FROM tasks WHERE column_id = $3), 0) + 1
                 END,
                 updated_at = now()
             WHERE id = $4
               AND column_id = $5
               AND EXISTS (SELECT 1 FROM columns WHERE id = $3 AND board_id = $6)
             RETURNING id, column_id, title, description, position, created_at, updated_at`,
            [title, description || null, destinationColumnId, numericTaskId, originalColumnId, numericBoardId]
        );

        if (!taskResult.rows[0]) {
            await client.query("ROLLBACK");
            return NextResponse.json({ error: "Task not found" }, { status: 404 });
        }

        await client.query("DELETE FROM subtasks WHERE task_id = $1", [numericTaskId]);
        const updatedSubtasks = [];

        for (let index = 0; index < subtasks.length; index += 1) {
            const subtask = subtasks[index] as { title: string; is_done?: boolean };
            const result = await client.query(
                `INSERT INTO subtasks (task_id, title, is_done, position)
                 VALUES ($1, $2, $3, $4)
                 RETURNING id, task_id, title, is_done, position, created_at`,
                [numericTaskId, subtask.title.trim(), Boolean(subtask.is_done), index + 1]
            );
            updatedSubtasks.push(result.rows[0]);
        }

        await client.query("COMMIT");
        return NextResponse.json({ ...taskResult.rows[0], subtasks: updatedSubtasks }, { status: 200 });
    } catch (error) {
        await client.query("ROLLBACK");
        console.error("Error updating task:", error);
        return NextResponse.json(
            { error: "Failed to update task" },
            { status: 500 }
        );
    } finally {
        client.release();
    }
}

export async function DELETE(
    req: Request,
    {
        params,
    }: {
        params: Promise<{
            boardId: string;
            columnId: string;
            taskId: string;
        }>;
    }
) {
    try {
        const { columnId, taskId } = await params;

        const deletedTask = await deleteTaskById(
            Number(columnId),
            Number(taskId)
        );

        if (!deletedTask) {
            return NextResponse.json({ error: "Task not found" }, { status: 404 });
        }

        return NextResponse.json(deletedTask, { status: 200 });
    } catch (error) {
        console.error("Error deleting task:", error);
        return NextResponse.json(
            { error: "Failed to delete task" },
            { status: 500 }
        );
    }
}

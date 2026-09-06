import { dbQuery } from "@/lib/db";
import { NextResponse } from "next/server";

type Params = {
    boardId: string;
    columnId: string;
    taskId: string;
    subtaskId: string;
};

export async function PATCH(req: Request, context: { params: Promise<Params> }) {
    try {
        const { boardId, columnId, taskId, subtaskId } = await context.params;
        const body = await req.json();

        if (typeof body.isDone !== "boolean") {
            return NextResponse.json({ error: "isDone must be a boolean" }, { status: 400 });
        }

        const result = await dbQuery(
            `UPDATE subtasks s
             SET is_done = $1
             FROM tasks t, columns c
             WHERE s.id = $2
               AND s.task_id = $3
               AND t.id = s.task_id
               AND t.column_id = $4
               AND c.id = t.column_id
               AND c.board_id = $5
             RETURNING s.id, s.task_id, s.title, s.is_done, s.position, s.created_at`,
            [body.isDone, Number(subtaskId), Number(taskId), Number(columnId), Number(boardId)]
        );

        if (!result.rows[0]) {
            return NextResponse.json({ error: "Subtask not found" }, { status: 404 });
        }

        return NextResponse.json(result.rows[0], { status: 200 });
    } catch (error) {
        console.error("Error updating subtask:", error);
        return NextResponse.json({ error: "Failed to update subtask" }, { status: 500 });
    }
}

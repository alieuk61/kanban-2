import { dbQuery } from "@/lib/db";
import { NextResponse } from "next/server";

type Params = {
    boardId: string;
    columnId: string;
    taskId: string;
};

export async function GET(_req: Request, context: { params: Promise<Params> }) {
    try {
        const { boardId, columnId, taskId } = await context.params;
        const result = await dbQuery(
            `SELECT s.id, s.task_id, s.title, s.is_done, s.position, s.created_at
             FROM subtasks s
             JOIN tasks t ON t.id = s.task_id
             JOIN columns c ON c.id = t.column_id
             WHERE s.task_id = $1
               AND t.column_id = $2
               AND c.board_id = $3
             ORDER BY s.position`,
            [Number(taskId), Number(columnId), Number(boardId)]
        );

        return NextResponse.json(result.rows, { status: 200 });
    } catch (error) {
        console.error("Error fetching subtasks:", error);
        return NextResponse.json({ error: "Failed to fetch subtasks" }, { status: 500 });
    }
}

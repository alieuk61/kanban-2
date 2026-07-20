import { getColumns } from "@/lib/columns/getColumns";
import { ApiError } from "@/lib/errors";
import { NextResponse } from "next/server";
import { dbQuery } from "@/lib/db";


type Params = {
    boardId: string;
}

export async function GET(req: Request, context: {params: Promise<Params>}) {
    try {
        console.log('we have made it here')
        const {boardId} = await context.params;
        const columns = await getColumns(Number(boardId));
         return NextResponse.json(columns, { status: 200 });
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
    try {
        const { boardId } = await context.params;
        const numericBoardId = Number(boardId);
        const body = await req.json();
        const name = typeof body.name === "string" ? body.name.trim() : "";

        if (!Number.isInteger(numericBoardId) || numericBoardId <= 0 || !name) {
            return NextResponse.json({ error: "A valid board and column name are required" }, { status: 400 });
        }

        const result = await dbQuery(
            `INSERT INTO columns (board_id, name, position)
             SELECT $1, $2, COALESCE(MAX(position), 0) + 1
             FROM columns
             WHERE board_id = $1
             RETURNING id, board_id, name, position, created_at`,
            [numericBoardId, name]
        );

        return NextResponse.json({ ...result.rows[0], tasks: [] }, { status: 201 });
    } catch (error) {
        console.error("POST column failed:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

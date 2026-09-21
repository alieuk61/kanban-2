import { NextResponse } from "next/server";
import { ApiError } from "@/lib/errors";
import { getBoard } from "@/lib/boards/getBoards";
import { deleteBoard } from "@/lib/boards/deleteBoard";
import { dbQuery } from "@/lib/db";

type Params = { 
    boardId: string
};

export async function GET(req: Request, context: { params: Promise<Params> }) {
    try {

        const { boardId } = await context.params;
        const board = await getBoard(Number(boardId));
        console.log(context, typeof (context));
        return NextResponse.json(board, { status: 200 });
    } catch (error) {
        if (error instanceof ApiError) {
            return NextResponse.json(
                { error: error.message },
                { status: error.status }
            );
        }

        // if the error is not api related, then it's an internal server error
        console.error("Route failed:", error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : "Internal server error" },
            { status: 500 }
        );
    }
}
/*we ask if the error we recieve is an instance of api Error and that could return true
 because ApiError is an instance of the original error, its an inheritance chain
reasons for using this error class:
JavaScript checks:

Was err constructed via new ApiError()?

Or was it constructed via new Error()?

Or something else?

It does NOT compare messages.
It does NOT compare status codes.
It checks the constructor lineage.

It only cares about:

Is this a domain error or not?

That’s clean separation.

 */

export async function DELETE(req: Request, context: { params: Promise<Params> }) {
    try {
        const { boardId: requestedBoardId } = await context.params;
        const boardId = Number(requestedBoardId);
        const deletedBoard = await deleteBoard(boardId);
        return NextResponse.json(deletedBoard, { status: 200 });
    } catch (error) {
        if (error instanceof ApiError) {
            return NextResponse.json(
                { error: error.message },
                { status: error.status }
            )
        }

        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

export async function PATCH(req: Request, context: { params: Promise<Params> }) {
    try {
        const { boardId } = await context.params;
        const numericBoardId = Number(boardId);
        const body = await req.json();
        const name = typeof body.name === "string" ? body.name.trim() : "";

        if (!Number.isInteger(numericBoardId) || numericBoardId <= 0 || !name) {
            return NextResponse.json({ error: "A valid board and name are required" }, { status: 400 });
        }

        const result = await dbQuery(
            `UPDATE boards
             SET name = $1
             WHERE id = $2
             RETURNING id, name, created_at`,
            [name, numericBoardId]
        );

        if (!result.rows[0]) {
            return NextResponse.json({ error: "Board not found" }, { status: 404 });
        }

        return NextResponse.json({ ...result.rows[0], columns: [] }, { status: 200 });
    } catch (error) {
        console.error("Error updating board:", error);
        return NextResponse.json({ error: "Failed to update board" }, { status: 500 });
    }
}

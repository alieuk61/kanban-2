import { NextResponse } from "next/server";
import { ApiError } from "@/lib/errors";
import { getAllBoards } from "@/lib/boards/getBoards";
import { dbQuery } from "@/lib/db";

export async function GET(req: Request){
    try {
        console.log("GET /api/boards hit");

        const boards = await getAllBoards();

        console.log("Boards fetched:", boards);

        return NextResponse.json(boards, { status: 200 });
    } catch (error) {
        console.error("GET /api/boards failed:", error);

        if (error instanceof ApiError)  {
            return NextResponse.json(
                { error: error.message },
                { status: error.status }
            )
        }
        
        console.log('server error')
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
}
}

export async function POST(req: Request){
    try {
        const body = await req.json();
        const name = typeof body.name === "string" ? body.name.trim() : "";

        if (!name) {
            return NextResponse.json({ error: "A board name is required" }, { status: 400 });
        }

        const result = await dbQuery(
            `INSERT INTO boards (name)
             VALUES ($1)
             RETURNING id, name, created_at`,
            [name]
        );

        return NextResponse.json({ ...result.rows[0], columns: [] }, { status: 201 });
    } catch (error) {
        console.error("POST /api/boards failed:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

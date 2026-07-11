import { NextResponse } from "next/server";
import { ApiError } from "@/lib/errors";
import { getAllBoards } from "@/lib/boards/getBoards";

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
        
    } catch (error) {
        
    }
}

import { getColumns } from "@/lib/columns/getColumns";
import { ApiError } from "@/lib/errors";
import { NextResponse } from "next/server";


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
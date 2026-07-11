import { ApiError } from "@/lib/errors";
import { getAllTasks } from "@/lib/tasks/getTasks";
import { NextResponse } from "next/server";

type Params = {
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
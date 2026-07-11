import { NextResponse } from "next/server";
import { getTask, updateTaskById } from "@/lib/tasks/getTasks";
import { deleteTaskById } from "@/lib/tasks/deleteTask";

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
    try {
        const { boardId, columnId, taskId } = await params;
        console.log(boardId, columnId, taskId);
        console.log('put function has been called!!')
        const body = await req.json();

        const updatedTask = await updateTaskById(
            Number(boardId),
            Number(columnId),
            Number(taskId),
            body
        );

        if (!updatedTask) {
            return NextResponse.json({ error: "Task not found" }, { status: 404 });
        }

        return NextResponse.json(updatedTask, { status: 200 });
    } catch (error) {
        console.error("Error updating task:", error);
        return NextResponse.json(
            { error: "Failed to update task" },
            { status: 500 }
        );
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
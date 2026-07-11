
type Params = {
    boardId: string;
    columnId: string;
}

export async function GET(req: Request, context: { params: Promise<Params> }){

    try {
        const {boardId} = await context.params;
        const {columnId} = await context.params;
        // console.log (boardId, columnId)
    } catch (error) {
        
    }
}
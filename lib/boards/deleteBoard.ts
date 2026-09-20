import { ApiError } from "../errors";
import { dbQuery } from "../db";

export async function deleteBoard(boardId: number){
    const deletedBoard = await dbQuery(`
        DELETE FROM boards WHERE id = $1 RETURNING id`,
    [boardId])

    if (deletedBoard.rowCount === 0) {
        throw new ApiError("Board not found", 404);
    }

    return deletedBoard.rows[0];
}

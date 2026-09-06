import { ApiError } from "@/lib/errors";
import { dbQuery } from "../db";

export async function getAllBoards() {
    const boards = await dbQuery('SELECT * FROM boards ORDER BY id;')
    console.log("all boards:", {
        boards: boards.rows
    });

    return boards.rows;
}

export async function getBoard(id: number) {
    const result = await dbQuery(
        'SELECT * FROM boards WHERE id = $1 ORDER BY id',
        [id]
    );
    if (result.rows.length === 0) {
        throw new ApiError("Board not found", 404);
    }

    console.log('specific board: ', result.rows)
    return result.rows[0]
}

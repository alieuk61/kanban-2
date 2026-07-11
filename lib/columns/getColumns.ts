import { dbQuery } from "../db";

export async function getColumns(boardId: number) {
    const result = await dbQuery(
        'SELECT * FROM columns WHERE board_Id = $1 ORDER BY position;',
        [boardId]
    )

    return result.rows;
}

//we are making the getcolumns function -> then we will finish making the function in routes -> we will call the function in the column page section -> we will then map through the saved columns
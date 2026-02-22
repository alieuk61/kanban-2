-- get all boards
    SELECT * FROM boards
    WHERE id = $1;

--  get columns
    SELECT * FROM columns
    WHERE board_id = $1
    ORDER BY position;


-- get tasks and subtasks
    SELECT
    c.id AS column_id,
    t.id AS task_id,
    t.title,
    t.description,
    t.position AS task_position,
    s.id AS subtask_id,
    s.title AS subtask_title,
    s.is_done,
    s.position AS subtask_position
    FROM columns c
    LEFT JOIN tasks t ON t.column_id = c.id
    LEFT JOIN subtasks s ON s.task_id = t.id
    WHERE c.board_id = $1
    ORDER BY c.position, t.position, s.position

-- create board
-- INSERT INTO boards(name)
-- VALUES('Demo Board')
-- RETURNING id;

-- delete board

-- update board



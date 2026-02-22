-- get all boards
-- get boards
    -- SELECT * FROM boards
    -- WHERE id = $1;

--  get columns
    -- SELECT * FROM columns
    -- WHERE board_id = $1
    -- ORDER BY position;


-- get tasks
    SELECT * FROM tasks
    join subtasks on tasks.id = subtasks.task_id

-- get subtasks
    -- SELECT * FROM subtasks

-- create board
-- INSERT INTO boards(name)
-- VALUES('Demo Board')
-- RETURNING id;

-- delete board

-- update board



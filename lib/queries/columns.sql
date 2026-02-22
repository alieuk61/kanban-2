-- create cols
INSERT INTO columns (board_id, name, position)
VALUES
  (1, 'Backlog', 1),
  (1, 'In Progress', 2),
  (1, 'Done', 3)
RETURNING id, name;
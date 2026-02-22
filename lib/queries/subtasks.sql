-- insert into subtasks (task_id, title, is_done, position)
-- select 
-- -- we need task id to find where the tasks are coming from (we get it from tasks t but we select it using t.id)
--     t.id,
--     s.title,
--     s.is_done,
--     s.position
--     from tasks t
--     -- below we're creating a temporary table/dataset and joining datasets to produce a result set.
--     -- and we insert it into the table "subtasks"
--     join (
--         VALUES
--          -- go shopping - the task title, this isn't selected so it wont show up but is used to help join new values onto selected values and then retrieve that task id
--     ('go shopping', 'Make a shopping list', false, 1),
--     ('go shopping', 'Drive to supermarket', false, 2),
--     ('go shopping', 'Pay at checkout', false, 3),

--     -- go to park
--     ('go to park', 'Pack snacks', true, 1),
--     ('go to park', 'Bring football', false, 2),
--     ('go to park', 'Take photos', false, 3),

--     -- go cinema
--     ('go cinema', 'Book tickets online', true, 1),
--     ('go cinema', 'Buy popcorn', false, 2),
--     ('go cinema', 'Leave review after movie', false, 3)
--     ) AS s(task_title, title, is_done, position) /*s is temporary dataset*/
--     on s.task_title = t.title
--     RETURNING id, task_id, title, position; /*we return these*/

select * from subtasks
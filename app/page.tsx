"use client";
import Header from "@/components/layout/header";
import Sidebar from "@/components/layout/sidebar";
import SidebarButton from "@/components/buttons/sidebar-button";
import ViewTaskModal from "@/components/modals/task/view-task-modal";
import { Task } from "@/types/types";
import { useEffect, useState } from "react";
import { useAppContext } from "@/context/kanban-context";
import ColumnCard from "@/components/cards/column-card";
import { AddColumnButton } from "@/components/buttons/columns/add-column-button";
import EditTaskModal from "@/components/modals/task/edit-task-modal";
import DeleteTaskModal from "@/components/modals/task/delete-task-modal";
import { NewColumnTab } from "@/components/buttons/columns/new-column-tab";
import AddNewBoardModal from "@/components/modals/board/add-board-modal";
import AddColumnModal from "@/components/modals/column/add-column-modal";
import { AddTaskModal, NewTaskValues } from "@/components/modals/task/add-task-modal";

export default function Home() {
  const { getBoard, createBoard, createColumn, createTask, getAllBoards, chosenBoardId, columns, getColumns, updateTask, deleteTask } = useAppContext();
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [selectedColumnId, setSelectedColumnId] = useState<number | null>(null);
  const [isViewTaskOpen, setIsViewTaskOpen] = useState(false);
  const [isEditTaskOpen, setIsEditTaskOpen] = useState(false);
  const [taskRefreshKey, setTaskRefreshKey] = useState(0);
  const [isDeleteTaskOpen, setIsDeleteTaskOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isAddBoardOpen, setIsAddBoardOpen] = useState(false);
  const [isAddColumnOpen, setIsAddColumnOpen] = useState(false);
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);

  function handleOpenTask(task: Task, columnId: number) {
    setSelectedTask(task);
    setSelectedColumnId(columnId);
    setIsViewTaskOpen(true);
  }

  function handleCloseTaskModal() {
    setIsViewTaskOpen(false);
    setSelectedTask(null);
  }

  function editTaskClicked() {
    setIsViewTaskOpen(false);
    setIsEditTaskOpen(true);
  }

  function deleteTaskClicked() {
    setIsViewTaskOpen(false);
    setIsDeleteTaskOpen(true);
  }

  function closeEditTaskModal() {
    setIsEditTaskOpen(false);
    setSelectedTask(null);
  }

  function closeDeleteTaskModal() {
    setIsDeleteTaskOpen(false);
    setSelectedTask(null);
  }

  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev)

  async function handleSaveTask(updatedTask: Task) {
    console.log("Parent handleSaveTask fired", updatedTask);
    console.log("chosenBoardId:", chosenBoardId);
    console.log("selectedColumnId:", selectedColumnId);
    console.log("selectedTask?.column_id:", selectedTask?.column_id);
    console.log("updatedTask.id:", updatedTask.id);

    if (!chosenBoardId || !updatedTask.column_id) return;

    const savedTask = await updateTask(
      Number(chosenBoardId),
      Number(updatedTask?.column_id),
      Number(updatedTask.id),
      updatedTask
    );

    setTaskRefreshKey((prev) => prev + 1);
    setSelectedTask(savedTask ?? updatedTask);
    setIsEditTaskOpen(false);
  }

  async function handleDeleteTask(task: Task) {
    if (!chosenBoardId || !task.column_id) return;

    await deleteTask(
      Number(chosenBoardId),
      Number(task.column_id),
      Number(task.id)
    );

    setIsDeleteTaskOpen(false);
    setSelectedTask(null);
    setTaskRefreshKey((prev) => prev + 1);
  }

  async function handleCreateBoard(name: string) {
    const newBoard = await createBoard({ name });

    await getAllBoards();
    await getBoard(Number(newBoard.id));
    await getColumns(Number(newBoard.id));

    setIsAddBoardOpen(false);
  }

  async function handleCreateColumn(name: string) {
    if (!chosenBoardId) throw new Error("Select a board before adding a column");

    await createColumn(Number(chosenBoardId), { name });
    await getColumns(Number(chosenBoardId));
    setIsAddColumnOpen(false);
  }

  async function handleCreateTask(values: NewTaskValues) {
    if (!chosenBoardId) throw new Error("Select a board before adding a task");

    await createTask(Number(chosenBoardId), values.columnId, {
      title: values.title,
      description: values.description,
      subtasks: values.subtasks,
    });
    setTaskRefreshKey((previous) => previous + 1);
    setIsAddTaskOpen(false);
  }

  useEffect(() => {
    getAllBoards()
    getBoard(1)
    getColumns(1)
  }, [])

  return (
    <main className="flex min-h-screen h-screen bg-[#828FA3] flex-col">

      <div className="flex-1">
        <Header onAddTask={() => setIsAddTaskOpen(true)} />
      </div>

      <div>
        <Sidebar
        isActive={isSidebarOpen}
        />
        <div className="bg-[#E4EBFA] w-full h-screen flex ">

          {isAddBoardOpen && <AddNewBoardModal/>}
          
          {columns && columns.length > 0 ? (
            <>
              {columns.map((col) => (
                <ColumnCard
                  key={col.id}
                  column={col}
                  taskRefreshKey={taskRefreshKey}
                  onTaskClick={handleOpenTask}
                />
              ))}

              <NewColumnTab onClick={() => setIsAddColumnOpen(true)} />
            </>
          ) : (
            <AddColumnButton onClick={() => setIsAddColumnOpen(true)} />
          )}

          {isAddColumnOpen && (
            <AddColumnModal
              onClose={() => setIsAddColumnOpen(false)}
              onSubmit={handleCreateColumn}
            />
          )}

          {isAddTaskOpen && columns && columns.length > 0 && (
            <AddTaskModal
              columns={columns}
              onClose={() => setIsAddTaskOpen(false)}
              onSubmit={handleCreateTask}
            />
          )}

          {isViewTaskOpen && selectedTask && (
            <ViewTaskModal
              columnId={selectedTask.column_id}
              task={selectedTask}
              onClose={handleCloseTaskModal}
              onEditTask={editTaskClicked}
              onDeleteTask={deleteTaskClicked}
            />
          )}

          {isEditTaskOpen && selectedTask && (
            <EditTaskModal
              onClose={closeEditTaskModal}
              task={selectedTask}
              onSave={handleSaveTask}
            />
          )}

          {isDeleteTaskOpen && selectedTask && (
            <DeleteTaskModal
              task={selectedTask}
              onClose={closeDeleteTaskModal}
              onDelete={handleDeleteTask}
            />
          )}

          <SidebarButton
            onClick={toggleSidebar}
            setIsAddBoardOpen={setIsAddBoardOpen}
          />
        </div>
      </div>
    </main>
          
  );
}

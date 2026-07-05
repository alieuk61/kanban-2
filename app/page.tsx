"use client";
import Header from "@/components/layout/header";
import Sidebar from "@/components/layout/sidebar";
import SidebarButton from "@/components/buttons/sidebar-button";
import ViewTaskModal from "@/components/modals/task/view-task-modal";
import { Task } from "@/types/types";
import { useEffect, useState } from "react";
import { useAppContext } from "@/context/kanban-context";
import ColumnCard from "@/components/cards/column-card";
import { AddColumnButton } from "@/components/buttons/columns/add-column";
import EditTaskModal from "@/components/modals/task/edit-task-modal";

export default function Home() {
  const { getBoard, getAllBoards, chosenBoardId, columns, getColumns, updateTask } = useAppContext();
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [selectedColumnId, setSelectedColumnId] = useState<number | null>(null);
  const [isViewTaskOpen, setIsViewTaskOpen] = useState(false);
  const [isEditTaskOpen, setIsEditTaskOpen] = useState(false);
  const [taskRefreshKey, setTaskRefreshKey] = useState(0);
  const [isDeleteTaskOpen, setIsDeleteTaskOpen] = useState(false);

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

  async function handleDeleteTask() {
    
  }

  useEffect(() => {
    getAllBoards()
    getBoard(1)
    getColumns(1)
  }, [])

  return (
    <main className="flex min-h-screen h-screen bg-[#828FA3] flex-col">
      {/* <Sidebar /> */}

      <div className="flex-1">
        <Header />
      </div>

      <div>
        <div className="bg-[#E4EBFA] w-full h-screen flex ">
          
          {columns && columns.length > 0 ? (
            columns.map((col) => 
            <ColumnCard 
             key={col.id}
             column={col}
             taskRefreshKey={taskRefreshKey}
             onTaskClick={handleOpenTask} 
             />)
             
          ) : (
            <AddColumnButton />
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

          <SidebarButton />
        </div>
      </div>
    </main>
          
  );
}

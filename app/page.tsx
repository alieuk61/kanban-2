"use client";
import Header from "@/components/layout/header";
import ViewTaskModal from "@/components/modals/task/view-task-modal";
import { Task } from "@/types/types";
import { useContext, useEffect, useState } from "react";
import { useAppContext } from "@/context/kanban-context";
import ColumnCard from "@/components/cards/column-card";
import { AddColumnButton } from "@/components/buttons/columns/add-column";

export default function Home() {
  const { getBoard, getAllBoards, chosenBoardId, columns, getColumns } = useAppContext();
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isViewTaskOpen, setIsViewTaskOpen] = useState(false);

  function handleOpenTask(task: Task) {
    setSelectedTask(task);
    setIsViewTaskOpen(true);
  }

  function handleCloseTaskModal() {
    setIsViewTaskOpen(false);
    setSelectedTask(null);
  }

  useEffect(() => {
    getAllBoards()
    getBoard(1)
    getColumns(1)
  }, [])

  return (
    <main className="flex min-h-screen h-screen bg-[#828FA3] flex-col">
      <Header />
      <div>
        <div className="bg-[#E4EBFA] w-full h-screen flex ">
          
          {columns && columns.length > 0 ? (
            columns.map((col) => 
            <ColumnCard 
             key={col.id}
             column={col}
             onTaskClick={handleOpenTask} />)
          ) : (
            <AddColumnButton />
          )}

          {isViewTaskOpen && selectedTask && (
            <ViewTaskModal
              columnId={selectedTask.column_id}
              task={selectedTask}
              onClose={handleCloseTaskModal}
            />
          )}
        </div>
      </div>
    </main>
          
  );
}

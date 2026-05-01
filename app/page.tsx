"use client";
import Image from "next/image";
import Header from "@/components/layout/header";
import { useContext, useEffect } from "react";
import { useAppContext } from "@/context/kanban-context";
import ColumnCard from "@/components/cards/column-card";
import { AddColumnButton } from "@/components/buttons/columns/add-column";

export default function Home() {
  const { getBoard, getAllBoards, chosenBoardId, columns, getColumns } = useAppContext();

  useEffect(() => {
    getAllBoards()
    getBoard(1)
    getColumns(1)
  }, [])

  return (
    <main className="flex min-h-screen h-screen bg-[#828FA3] flex-col">
      <Header />
      <div>
        <div className="bg-[#E4EBFA] w-full h-screen flex">
          
          {columns && columns.length > 0 ? (
            columns.map((col) => <ColumnCard key={col.id} column={col} />)
          ) : (
            <AddColumnButton />
          )}
        </div>
      </div>
    </main>
          
  );
}

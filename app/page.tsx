"use client";
import Image from "next/image";
import Header from "@/components/layout/header";
import { useContext, useEffect } from "react";
import { useAppContext } from "@/context/kanban-context";

export default function Home() {
  const { getBoard, getAllBoards, chosenBoardId } = useAppContext();

  useEffect(() => {
    getAllBoards()
    getBoard(1)
  }, [])

  return (
    <main className="flex min-h-screen h-screen bg-[#828FA3] flex-col">
      <Header />
      <div>
        <div className="bg-white w-full h-screen">
          
        </div>
      </div>
    </main>
          
  );
}

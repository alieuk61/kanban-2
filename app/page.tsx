"use client";
import Image from "next/image";
import Navbar from "@/components/layout/navbar";
import { useContext, useEffect } from "react";
import { useAppContext } from "@/context/kanban-context";

export default function Home() {
  const { getAllBoards } = useAppContext();

  useEffect(() => {
    getAllBoards();
  }, [getAllBoards]);

  return (
    <main className="flex min-h-screen h-screen bg-[#828FA3]">
      <Navbar />
      <div>
        <div>
          
        </div>
      </div>
    </main>
          
  );
}

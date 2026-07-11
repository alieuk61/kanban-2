"use client";
import { useEffect } from "react";
import { useAppContext } from "@/context/kanban-context";


export default function Header() {

    const {board} = useAppContext();

    return (
        <nav className="flex justify-between items-center bg-white text-black w-full h-24 border-b-2 px-8 box-border border-[#828FA3]">
            <div className="border-r-2 h-full border-[#828FA3] py-24 pr-24 pl-8 flex items-center justify-center ">Kanban</div>
            <ol className="flex justify-between w-full box-border">
                <li><h1 className="text-2xl font-bold">{board?.name}</h1></li>
                <button className="rounded-3xl bg-[#635FC7] h-12 w-48 text-white">Add new task</button>
            </ol>
        </nav>
    );
}
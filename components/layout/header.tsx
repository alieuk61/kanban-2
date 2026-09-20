"use client";
import { useState } from "react";
import { useAppContext } from "@/context/kanban-context";
import Image from "next/image";
import ellipsisIcon from "../../public/ellipsis.svg";

type HeaderProps = {
    onAddTask: () => void;
    onDeleteBoard: () => void;
};

export default function Header({ onAddTask, onDeleteBoard }: HeaderProps) {

    const {board, columns} = useAppContext();
    const [isBoardMenuOpen, setIsBoardMenuOpen] = useState(false);

    return (
        <nav className="flex justify-between items-center bg-white text-black w-full h-24 border-b-2 px-8 box-border border-[#828FA3]">
            <div className="border-r-2 h-full border-[#828FA3] py-24 pr-24 pl-8 flex items-center justify-center ">Kanban</div>
            <ol className="flex justify-between w-full box-border">
                <li><h1 className="text-2xl font-bold">{board?.name}</h1></li>
                <button
                    type="button"
                    onClick={onAddTask}
                    disabled={!columns?.length}
                    className="rounded-3xl bg-[#635FC7] h-12 w-48 text-white cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
                >
                    Add new task
                </button>
                <div className="relative ml-4">
                    <button type="button" disabled={!board} onClick={() => setIsBoardMenuOpen((current) => !current)} aria-label="Board options" className="p-3 disabled:opacity-40">
                        <Image src={ellipsisIcon} alt="" width={20} height={20} />
                    </button>
                    {isBoardMenuOpen && board && (
                        <div className="absolute right-0 top-12 z-40 w-48 rounded-md bg-white py-2 shadow-lg">
                            <button
                                type="button"
                                onClick={() => {
                                    setIsBoardMenuOpen(false);
                                    onDeleteBoard();
                                }}
                                className="w-full px-4 py-2 text-left text-red-500 hover:bg-gray-100"
                            >
                                Delete Board
                            </button>
                        </div>
                    )}
                </div>
            </ol>
        </nav>
    );
}

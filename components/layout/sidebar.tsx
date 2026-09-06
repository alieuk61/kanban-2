"use client";

import { useAppContext } from "@/context/kanban-context";
type sidebarProps = {
    isActive: boolean;
    setIsAddBoardOpen: React.Dispatch<React.SetStateAction<boolean>>;
    onBoardSelected: () => void;
}

export default function Sidebar({isActive, setIsAddBoardOpen, onBoardSelected} : sidebarProps) {
    const { AllBoards, chosenBoardId, getBoard, getColumns } = useAppContext();

    async function handleBoardClick(boardId: number) {
        await getBoard(boardId);
        await getColumns(boardId);
        onBoardSelected();
    }

    return (
        <aside
            className={`left-0 top-0 z-50 h-screen w-70 bg-white p-6 absolute ${isActive ? "block" : "hidden"
                }`}
        >
            <h2 className="mb-6 text-sm font-bold uppercase tracking-[2px] text-gray-400">
                All Boards ({AllBoards?.length ?? 0})
            </h2>

            <div className="flex flex-col gap-2">
                {AllBoards?.map((board) => {
                    const isActive = String(board.id) === String(chosenBoardId);

                    return (
                        <button
                            key={board.id}
                            type="button"
                            onClick={() => handleBoardClick(Number(board.id))}
                            className={`rounded-r-full px-4 py-3 text-left font-medium ${isActive
                                ? "bg-purple-600 text-white"
                                : "text-gray-500 hover:bg-purple-100 hover:text-purple-600"
                                }`}
                        >
                            {board.name}
                        </button>
                    );
                })}

                <button 
                    type="button"
                    onClick={() => setIsAddBoardOpen(prev => !prev)}
                    className="text-purple-600 font-semibold cursor-pointer">
                    +Create New Board
                </button>
            </div>
        </aside>
    );
}

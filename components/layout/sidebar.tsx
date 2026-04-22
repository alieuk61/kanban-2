import { useAppContext } from "@/context/kanban-context"
import { Board } from "@/types/types";

export default function Navbar (){
    const {AllBoards} = useAppContext();

    return(
        <div className="absolute left-0 top-0 bg-white w-75 border-r-2">
            <h1>Kanban</h1>

            <div>
                <h2>All Boards ({AllBoards?.length})</h2>

                <div className="flex flex-row">
                    {AllBoards?.map((value: Board) => {
                        return(
                            <div key={value.id}>
                                <button>{value.name}</button>
                            </div>
                        );
                    })}
                    <button> + Create New Board </button>
                </div>
            </div>
        </div>
    )
}
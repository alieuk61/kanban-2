import { useState } from "react"
import { useAppContext } from "@/context/kanban-context";

export default function AddNewBoardModal () {

    const {columns} = useAppContext();
    const [name, setName] = useState('');

    return(
        <div>
            <h1>Add New Board</h1>
            <form>
                <label htmlFor="boardName">Board name</label>

                <input
                    id="boardName"
                    type="text"
                    value={name}
                    placeholder="e.g. Web Design"
                    onChange={(event) => setName(event.target.value)}
                />

                {/* <div>
                    <label htmlFor="columns">Columns</label>
                    
                    <input 
                    type="text"
                    id="columns" />
                </div> */}

                <button 
                type="submit">
                    Create New Board
                </button>
            </form>
        </div>
    )
}
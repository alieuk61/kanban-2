import { Board } from "@/types/types"

export default function DeleteBoardModal (selectedboard: Board) {
    
    return(
        <div className="bg-white rounded-md w-120 h-58">
            <h1 className="text-[#EA5555]">Delete this Board?</h1>
            <p>Are you sure you want to delete the ‘{selectedboard.name}’ task and its subtasks? This action cannot be reversed.</p>
            <section>
                two buttons go here (delete and cancel)
            </section>
        </div>
    )
}


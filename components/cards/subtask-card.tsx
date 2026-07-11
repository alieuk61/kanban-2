import { Subtask } from "@/types/types"

export default function SubtaskCard (){

    return (
        <div className=" bg-white">
            <h2>{/* Subtask title */} title</h2>
            <section>{/* Subtask description */}</section>
            <div className="subtasks">
                <h6>{/* completed subtask count */} out of {/*subtasks.length*/}</h6>
                <div>{/* Subtask list.map(inside here we will map the subtask array) */}</div>
            </div>

            {/*imported status dropdown*/}
        </div>
    )
}
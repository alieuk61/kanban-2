

export default function Subtaskcard() {
    return (
        <div>
            <h2>{/* Subtask title */}</h2>
            <section>{/* Subtask description */}</section>
            <div className="subtasks">
                <h6>{/* completed subtask count */} out of {/*subtasks.length*/}</h6>
                <div>{/* Subtask list.map(inside here we will map the subtask array) */}</div>
            </div>

            {/*imported status dropdown*/}
        </div>
    )
}

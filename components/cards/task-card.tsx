

export default function TaskCard({ title, subtasks }: { title: string; subtasks: string[] }) {
    return(
        <div>
            <h2>{title}</h2>
            <p>completed subtasks out of{subtasks.length}</p>
        </div>
    )
}




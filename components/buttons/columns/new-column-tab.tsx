
type NewColumnTabProps = {
    onClick: () => void
}

export function NewColumnTab ({ onClick }: NewColumnTabProps) {

    return(
        <button
        type="button"
            onClick={onClick}
            className="w-70 h-screen bg-[#828FA3] flex justify-center items-center cursor-pointer"
        >
            <p>+ New Column</p>
        </button>
    )
}

export default function TaskActionsDropdown({
    toggleEdit,
    toggleDelete,
}: {
    toggleEdit: () => void;
    toggleDelete: () => void;
}) {
    return (
        <div className="flex w-48 flex-col rounded-md bg-white py-2 shadow-md">
            <button
                type="button"
                className="px-4 py-2 text-left text-gray-400 hover:bg-gray-100"
                onClick={toggleEdit}
            >
                Edit Task
            </button>

            <button
                type="button"
                className="px-4 py-2 text-left text-red-400 hover:bg-gray-100"
                onClick={toggleDelete}
            >
                Delete Task
            </button>
        </div>
    );
}


export function AddColumnButton () {

        return (
            <div className="flex flex-col items-center justify-center gap-2 h-full">
                <h3 className="text-gray-600">This board is empty. Create a new column to get started.</h3>
                <button className="w-44 h-12 rounded-full bg-purple-600 text-white">
                    + Add New Column
                </button>
            </div>
        );
    }

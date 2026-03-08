import { createContext, useState, useEffect } from 'react';
import type { ReactNode } from "react";
import { Subtask, Task, Column, Board } from '@/types/types';
import axios from 'axios';

type AppContextValue = {
    board: Board[] | null;
    setBoard: React.Dispatch<React.SetStateAction<Board[] | null>>;
    getAllBoards: () => Promise<void>;
    getBoard: (id: number) => Promise<void>;
    createBoard: (newboard: Board) => Promise<void>
    deleteBoard: (id: number) => Promise<void>;
    createColumn: (boardId: number, newColumn: Column) => Promise<void>;
    deleteColumn: (boardId: number, columnId: number) => Promise<void>;
    addColumn: (boardId: number, newColumn: Column) => Promise<void>;
    getColumn: (boardId: number, columnId: number) => Promise<void>;
};

export const AppContext = createContext<AppContextValue | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
    const [board, setBoard] = useState<Board[] | null>(null)

    // boards
    const getAllBoards = async() : Promise<void> => {
        try {
            const response = await axios.get('/api/boards');
            console.log(response.data)
            // boards might be an array of boards

        } catch (error) {
            throw('There was an error when trying to fetch the data: ' + error);
        }
    }

    const getBoard = async(id: number): Promise<void> => {
        await axios.get(`/api/boards/${id}`);
    }

    const createBoard = async(newBoard: Board): Promise<void> => {
        try {
            await axios.post(`/api/boards`)
        } catch (error) {
            throw('error when trying to create board')
        }
    }

    const deleteBoard = async(id: number): Promise<void> => {
    try {
       await axios.delete(`/api/boards/${id}`);
    } catch (error) {
        throw('Error when trying to delete board')
    }
 }    

//  columns
    const createColumn = async(boardId: number, newColumn: Column): Promise<void> => {
        await axios.post(`/api/boards/${boardId}/columns`, newColumn)
    }

    const deleteColumn = async (boardId: number, columnId: number): Promise<void> => {
        await axios.delete(`/api/boards/${boardId}/columns/${columnId}`)
    }

    const addColumn = async(boardId: number, newColumn: Column): Promise<void> => {
        await axios.post(`/api/boards/${boardId}/columns`, newColumn)
    }

    const getColumn = async(boardId: number, columnId: number): Promise<void> => {
        const requestedColumn = await axios.get(`/api/boards/${boardId}/columns/${columnId}`)
    }

    return(
        <AppContext.Provider value={{
            board, setBoard,
            getAllBoards, deleteBoard,
            getBoard, createBoard,
            createColumn, deleteColumn,
            getColumn, addColumn

        }}>
            {children}
        </AppContext.Provider>
    )
}
"use client";

import React, { createContext, useState, useContext } from 'react';
import type { ReactNode } from "react";
import { Subtask, Task, Column, Board } from '@/types/types';
import axios from 'axios';

type AppContextValue = {
    board: Board | null;
    setBoard: React.Dispatch<React.SetStateAction<Board | null>>;
    AllBoards: Board[] | null;
    setAllBoards: React.Dispatch<React.SetStateAction<Board[] | null>>;
    chosenBoardId: string | null;
    setChosenBoardId: React.Dispatch<React.SetStateAction<string | null>>;
    columns: Column[] | null;
    setColumns: React.Dispatch<React.SetStateAction<Column[] | null>>;
    getAllBoards: () => Promise<void>;
    getBoard: (boardId: number) => Promise<void>;
    createBoard: (newBoard: Pick<Board, "name">) => Promise<Board>;
    deleteBoard: (boardId: number) => Promise<void>;
    createColumn: (boardId: number, newColumn: Pick<Column, "name">) => Promise<Column>;
    deleteColumn: (boardId: number, columnId: number) => Promise<void>;
    getColumn: (boardId: number, columnId: number) => Promise<void>;
    getColumns: (boardId: number) => Promise<void>;
    getTasksByColumn: (boardId: number, columnId: number) => Promise<Task[]>;
    updateTask: (boardId: number, columnId: number, taskId: number, updatedTask: Task) => Promise<Task | null>;
    deleteTask: (boardId: number, columnId: number, taskId: number) => Promise<void>;
    getSubtasksByTask: (boardId: number, columnId: number, taskId: number) => Promise<Subtask[]>;
    
};

export const AppContext = createContext<AppContextValue | undefined>(undefined);

export function useAppContext() {
    const context = useContext(AppContext);

    if (!context) {
        throw new Error("useAppContext must be used within an AppProvider");
    }

    return context;
}

export const AppProvider = ({ children }: { children: ReactNode }) => {
    const [board, setBoard] = useState<Board | null>(null);
    const [AllBoards, setAllBoards] = useState<Board[] | null>(null);
    const [chosenBoardId, setChosenBoardId] = useState<string | null>(null);
    const [columns, setColumns] = useState<Column[] | null>([]);

    // boards
    const getAllBoards = async() : Promise<void> => {
        try {
            const response = await axios.get('/api/boards');
            console.log('here are all the boards: ', response.data)
            // boards might be an array of boards
            setAllBoards(response.data);
            console.log('all boards: ', response.data)

        } catch (error) {
            throw('There was an error when trying to fetch the data: ' + error);
        }
    }

    const getBoard = async(boardId: number): Promise<void> => {
        try {
            const result = await axios.get(`/api/boards/${boardId}`);
            console.log('here is the chosen board: ', result.data)
            setBoard(result.data);
            setChosenBoardId(result.data.id);
            console.log('board Id: ', chosenBoardId)
        } catch (error) {
            console.log(error)
        }
    }

    const createBoard = async (
        newBoard: Pick<Board, "name">
        // creates new board and only requires name to be included in the new board
    ): Promise<Board> => {
        const response = await axios.post("/api/boards", newBoard);
        return response.data;
    };

    const deleteBoard = async(boardId: number): Promise<void> => {
    try {
       await axios.delete(`/api/boards/${boardId}`);
    } catch (error) {
        throw('Error when trying to delete board')
    }
 }    

//  columns
    const createColumn = async(boardId: number, newColumn: Pick<Column, "name">): Promise<Column> => {
        const response = await axios.post(`/api/boards/${boardId}/columns`, newColumn)
        return response.data;
    }

    const deleteColumn = async (boardId: number, columnId: number): Promise<void> => {
        await axios.delete(`/api/boards/${boardId}/columns/${columnId}`)
    }

    const getColumn = async(boardId: number, columnId: number): Promise<void> => {
        const requestedColumn = await axios.get(`/api/boards/${boardId}/columns/${columnId}`);
        console.log(requestedColumn);
        setColumns(requestedColumn.data);
    }

    const getColumns = async (boardId: number): Promise<void> => {
        const columns = await axios.get(`/api/boards/${boardId}/columns`);
        console.log("columns: ", columns.data);
        setColumns(columns.data);
    }

    const getTasksByColumn = async (boardId: number, columnId: number): Promise<Task[]> => {
        try {
            const response = await axios.get(`/api/boards/${boardId}/columns/${columnId}/tasks`);
            return response.data;
        } catch (error) {
            console.log(error);
            return [];
        }
    };

    const updateTask = async (
        boardId: number,
        columnId: number,
        taskId: number,
        updatedTask: Task
    ): Promise<Task | null> => {
        try {
            console.log("updateTask request ids:", {
                boardId,
                columnId,
                taskId,
            });
            console.log("updated task: ", updatedTask);
            const response = await axios.put(
                `/api/boards/${boardId}/columns/${columnId}/tasks/${taskId}`,
                updatedTask
            );

            return response.data;
        } catch (error) {
            console.log("there was an error when trying to update the task", error);
            throw error;
        }
    };

    const deleteTask = async (
        boardId: number,
        columnId: number,
        taskId: number
    ): Promise<void> => {
        try {
            await axios.delete(`/api/boards/${boardId}/columns/${columnId}/tasks/${taskId}`);
        } catch (error) {
            console.log("Error deleting task:", error);
            throw error;
        }
    };

    const getSubtasksByTask = async (boardId: number, columnId: number, taskId: number): Promise<Subtask[]> => {
        try {
            const response = await axios.get(`/api/boards/${boardId}/columns/${columnId}/tasks/${taskId}/subtasks`);
            return response.data;
        } catch (error) {
            console.log(error);
            return [];
        }
    };

    return(
        <AppContext.Provider value={{
            board, setBoard,
            columns, setColumns,
            getTasksByColumn,
            getColumns,
            chosenBoardId, setChosenBoardId,
            AllBoards, setAllBoards,
            getAllBoards, deleteBoard,
            getBoard, createBoard,
            createColumn, deleteColumn,
            getColumn,
            updateTask, getSubtasksByTask,
            deleteTask

        }}>
            {children}
        </AppContext.Provider>
    )
}

"use client";

import React, { createContext, useState, useContext } from 'react';
import type { ReactNode } from "react";
import { Subtask, Task, Column, Board } from '@/types/types';
import axios from 'axios';

type AppContextValue = {
    board: Board[] | null;
    setBoard: React.Dispatch<React.SetStateAction<Board[] | null>>;
    AllBoards: Board[] | null;
    setAllBoards: React.Dispatch<React.SetStateAction<Board[] | null>>;
    chosenBoardId: string | null;
    setChosenBoardId: React.Dispatch<React.SetStateAction<string | null>>;
    column: Board[] | null;
    setColumn: React.Dispatch<React.SetStateAction<Board[] | null>>;
    getAllBoards: () => Promise<void>;
    getBoard: (boardId: number) => Promise<void>;
    createBoard: (newboard: Board) => Promise<void>
    deleteBoard: (boardId: number) => Promise<void>;
    createColumn: (boardId: number, newColumn: Column) => Promise<void>;
    deleteColumn: (boardId: number, columnId: number) => Promise<void>;
    addColumn: (boardId: number, newColumn: Column) => Promise<void>;
    getColumn: (boardId: number, columnId: number) => Promise<void>;
    getColumns: (boardId: number) => Promise<void>;
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
    const [board, setBoard] = useState<Board[] | null>(null);
    const [AllBoards, setAllBoards] = useState<Board[] | null>(null);
    const [chosenBoardId, setChosenBoardId] = useState<string | null>(null);
    const [column, setColumn] = useState<Board[] | null>(null)

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
        } catch (error) {
            console.log(error)
        }
    }

    const createBoard = async(newBoard: Board): Promise<void> => {
        try {
            await axios.post(`/api/boards`)
        } catch (error) {
            throw('error when trying to create board')
        }
    }

    const deleteBoard = async(boardId: number): Promise<void> => {
    try {
       await axios.delete(`/api/boards/${boardId}`);
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
        const requestedColumn = await axios.get(`/api/boards/${boardId}/columns/${columnId}`);
        console.log(requestedColumn);
        setColumn(requestedColumn.data);
    }

    const getColumns = async (boardId: number): Promise<void> => {
        const columns = await axios.get(`/api/boards/${boardId}`);
        console.log(columns.data);
        setColumn(columns.data);
    }

    return(
        <AppContext.Provider value={{
            board, setBoard,
            column, setColumn,
            getColumns,
            chosenBoardId, setChosenBoardId,
            AllBoards, setAllBoards,
            getAllBoards, deleteBoard,
            getBoard, createBoard,
            createColumn, deleteColumn,
            getColumn, addColumn

        }}>
            {children}
        </AppContext.Provider>
    )
}
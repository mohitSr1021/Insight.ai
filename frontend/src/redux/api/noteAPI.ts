import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../axiosConfig/axios";

// Fetch notes API thunk
export const fetchNotes = createAsyncThunk(
  "notes/fetchNotes",
  async (userId: string, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/notes/u/${userId}`);
      return response.data;
    } catch (error: any) {
      if (error.response) {
        return rejectWithValue(error.response.data);
      } else {
        return rejectWithValue({ message: "Network error, please try again." });
      }
    }
  }
);

// Create a new note API thunk
export const createNewNote = createAsyncThunk(
  "notes/createNewNote",
  async (noteData: { content: string; link?: string }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/notes/create", noteData);
      return response.data;
    } catch (error: any) {
      if (error.response) {
        return rejectWithValue(error.response.data);
      } else {
        return rejectWithValue({ message: "Network error, please try again." });
      }
    }
  }
);

// Update an existing note API thunk
export const updateExistingNote = createAsyncThunk(
  "notes/updateExistingNote",
  async (
    noteData: { noteId: string; title: string; content: string; link: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await axiosInstance.put(
        `/update/${noteData.noteId}`,
        noteData
      );
      return response.data;
    } catch (error: any) {
      if (error.response) {
        return rejectWithValue(error.response.data);
      } else {
        return rejectWithValue({ message: "Network error, please try again." });
      }
    }
  }
);

// Delete an existing note API thunk
export const deleteExistingNote = createAsyncThunk(
  "notes/deleteExistingNote",
  async (noteId: string, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.delete(`/notes/remove/${noteId}`);
      return response.data;
    } catch (error: any) {
      if (error.response) {
        return rejectWithValue(error.response.data);
      } else {
        return rejectWithValue({ message: "Network error, please try again." });
      }
    }
  }
);

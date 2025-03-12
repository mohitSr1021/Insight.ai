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

// ===================================================================================================================================
// ===================================================================================================================================
// ===================================================================================================================================

export const fetchNote = createAsyncThunk(
  "notes/fetchNote",
  async (noteId: string, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/notes/${noteId}`);
      return {
        note: response.data.note,
        suggestions: {
          relatedTopics: response.data.suggestions?.relatedTopics || [],
          relatedArticles: response.data.suggestions?.relatedArticles || [],
          relatedVideos: response.data.suggestions?.relatedVideos || [],
          relatedImages: response.data.suggestions?.relatedImages || [],
          relatedWebsites: response.data.suggestions?.relatedWebsites || [],
          relatedBlogs: response.data.suggestions?.relatedBlogs || [],
          relatedLinks: response.data.suggestions?.relatedLinks || [],
        },
        keywords: response.data.note.content || "",
      };
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to load note"
      );
    }
  }
);

// =================================================================================================================================
// =================================================================================================================================
// =================================================================================================================================

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
        `/notes/update/${noteData.noteId}`,
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

// Adding/Removing Favorite
export const toggleNoteFavorite = createAsyncThunk(
  "notes/toggleFavorite",
  async (
    { noteId, userId }: { noteId: string; userId: string },
    { rejectWithValue }: { rejectWithValue: any }
  ) => {
    try {
      const response = await axiosInstance.post("/notes/favorite", {
        noteId,
        userId,
      });
      return response.data;
    } catch (error: any) {
      if (error.response) {
        return rejectWithValue(
          error.response.data || "Failed to toggle favorite"
        );
      } else {
        return rejectWithValue(error.response?.data);
      }
    }
  }
);

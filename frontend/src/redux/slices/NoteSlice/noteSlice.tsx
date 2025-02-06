import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { fetchNotes, createNewNote, updateExistingNote, deleteExistingNote } from "../../api/noteAPI";
import { NotesState } from "./noteSlice.types";

const initialState: NotesState = {
  notes: [],
  isLoading: false,
  error: null,
  selectedNote: null,
  isEditModalOpen: false,
  sortOrder: "desc",
};

const notesSlice = createSlice({
  name: "notes",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    resetNotesState: () => initialState,
    openEditModal: (state, action: PayloadAction<string>) => {
      const note = state.notes.find((n) => n._id === action.payload);
      if (note) {
        state.selectedNote = note;
        state.isEditModalOpen = true;
      }
    },
    closeEditModal: (state) => {
      state.selectedNote = null;
      state.isEditModalOpen = false;
    },
    toggleSortOrder: (state) => {
      state.sortOrder = state.sortOrder === "asc" ? "desc" : "asc";
      state.notes.sort((a, b) =>
        state.sortOrder === "asc"
          ? new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          : new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotes.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchNotes.fulfilled, (state, action) => {
        state.isLoading = false;
        state.notes = action.payload.notes.sort((a, b) =>
          state.sortOrder === "asc"
            ? new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
            : new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        state.error = null;
      })
      .addCase(fetchNotes.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || "Failed to fetch notes";
      })
      .addCase(createNewNote.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createNewNote.fulfilled, (state, action) => {
        state.isLoading = false;
        state.notes.push(action.payload.note);
        state.error = null;
      })
      .addCase(createNewNote.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || "Failed to create note";
      })
      .addCase(updateExistingNote.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateExistingNote.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.notes.findIndex((note) => note._id === action.payload._id);
        if (index !== -1) {
          state.notes[index] = action.payload;
        }
        state.selectedNote = null;
        state.isEditModalOpen = false;
        state.error = null;
      })
      .addCase(updateExistingNote.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || "Failed to update note";
      })
      .addCase(deleteExistingNote.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteExistingNote.fulfilled, (state, action) => {
        state.isLoading = false;
        state.notes = state.notes.filter((note) => note._id !== action.payload.deletedNoteId);
        state.error = null;
      })
      .addCase(deleteExistingNote.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || "Failed to delete note";
      });
  },
});

export const { clearError, resetNotesState, openEditModal, closeEditModal, toggleSortOrder } = notesSlice.actions;

export const selectAllNotes = (state: { notes: NotesState }) => state.notes.notes;
export const selectIsLoading = (state: { notes: NotesState }) => state.notes.isLoading;
export const selectError = (state: { notes: NotesState }) => state.notes.error;
export const selectSelectedNote = (state: { notes: NotesState }) => state.notes.selectedNote;
export const selectIsEditModalOpen = (state: { notes: NotesState }) => state.notes.isEditModalOpen;
export const selectSortOrder = (state: { notes: NotesState }) => state.notes.sortOrder;

export default notesSlice.reducer;

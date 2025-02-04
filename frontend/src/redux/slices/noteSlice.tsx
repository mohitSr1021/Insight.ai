import { createSlice, type PayloadAction } from "@reduxjs/toolkit"
import { fetchNotes, createNewNote, updateExistingNote, deleteExistingNote } from "../api/noteAPI"

export interface Note {
  _id: string
  title: string
  content: string
  userId: string
  createdAt: string
  updatedAt: string
  __v: number
}

interface NotesState {
  byId: { [key: string]: Note }
  allIds: string[]
  notes: Note[]
  isLoading: boolean
  error: string | null
  lastUpdated: number | null
}

interface ApiResponse {
  message: string
  notes: Note[]
}

interface ApiError {
  message: string
  statusCode?: number
}

const initialState: NotesState = {
  byId: {},
  allIds: [],
  notes: [],
  isLoading: false,
  error: null,
  lastUpdated: null,
}

const notesSlice = createSlice({
  name: "notes",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
    resetNotesState: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      // Fetch notes
      .addCase(fetchNotes.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchNotes.fulfilled, (state, action: PayloadAction<ApiResponse>) => {
        state.isLoading = false
        state.error = null
        state.lastUpdated = Date.now()

        // Update normalized structure
        state.byId = {}
        state.allIds = []
        action.payload.notes.forEach((note) => {
          state.byId[note._id] = note
          if (!state.allIds.includes(note._id)) {
            state.allIds.push(note._id)
          }
        })

        // Update array structure
        state.notes = action.payload.notes
      })
      .addCase(fetchNotes.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload ? (action.payload as ApiError).message : "Failed to fetch notes"
      })
      // Create note
      .addCase(createNewNote.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(createNewNote.fulfilled, (state, action: PayloadAction<Note>) => {
        state.isLoading = false
        state.error = null
        state.lastUpdated = Date.now()

        const note = action.payload

        // Update normalized structure
        state.byId[note._id] = note
        if (!state.allIds.includes(note._id)) {
          state.allIds.push(note._id)
        }

        // Update array structure
        state.notes.push(note)
      })
      .addCase(createNewNote.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload ? (action.payload as ApiError).message : "Failed to create note"
      })
      // Update note
      .addCase(updateExistingNote.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(updateExistingNote.fulfilled, (state, action: PayloadAction<Note>) => {
        state.isLoading = false
        state.error = null
        state.lastUpdated = Date.now()

        const note = action.payload

        // Update normalized structure
        if (state.byId[note._id]) {
          state.byId[note._id] = note
        }

        // Update array structure
        const noteIndex = state.notes.findIndex((n) => n._id === note._id)
        if (noteIndex !== -1) {
          state.notes[noteIndex] = note
        }
      })
      .addCase(updateExistingNote.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload ? (action.payload as ApiError).message : "Failed to update note"
      })
      // Delete note
      .addCase(deleteExistingNote.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(deleteExistingNote.fulfilled, (state, action: PayloadAction<{ _id: string }>) => {
        state.isLoading = false
        state.error = null
        state.lastUpdated = Date.now()

        const { _id } = action.payload

        // Update normalized structure
        delete state.byId[_id]
        state.allIds = state.allIds.filter((id) => id !== _id)

        // Update array structure
        state.notes = state.notes.filter((note) => note._id !== _id)
      })
      .addCase(deleteExistingNote.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload ? (action.payload as ApiError).message : "Failed to delete note"
      })
  },
})

// Selectors
export const selectAllNotes = (state: { notes: NotesState }): Note[] => state.notes.notes

export const selectNoteById = (state: { notes: NotesState }, id: string): Note | undefined => state.notes.byId[id]

export const selectIsLoading = (state: { notes: NotesState }): boolean => state.notes.isLoading

export const selectError = (state: { notes: NotesState }): string | null => state.notes.error

export const { clearError, resetNotesState } = notesSlice.actions

export default notesSlice.reducer


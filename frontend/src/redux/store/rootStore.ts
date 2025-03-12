import { configureStore } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import authReducer from "../slices/AuthSlice/authSlice.tsx";
import noteReducer from "../slices/NoteSlice/noteSlice.tsx";
import notesReducer from "../slices/NotesSlice/notesSlice.tsx";
import voiceReducer from "../slices/NoteSlice/speechTranscriptSlice.tsx";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    note: noteReducer,
    notes: notesReducer,
    voice: voiceReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

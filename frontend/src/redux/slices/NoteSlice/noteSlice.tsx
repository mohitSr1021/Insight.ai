import { createSlice, } from "@reduxjs/toolkit";
import { fetchNote } from "../../api/noteAPI";
import { NoteState } from "./noteSlice.types";

const noteSlice = createSlice({
    name: "notes",
    initialState: {
      note: null,
      suggestions: {
        relatedTopics: [],
        relatedArticles: [],
        relatedVideos: [],
        relatedImages: [],
        relatedWebsites: [],
        relatedBlogs: [],
        relatedLinks: [],
      },
    //   keywords: "",
      loading: false,
      error: null,
    } as NoteState,
    reducers: {},
    extraReducers: (builder) => {
      builder
        .addCase(fetchNote.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(fetchNote.fulfilled, (state, action) => {
          state.loading = false;
          state.note = action.payload.note;
          state.suggestions = action.payload.suggestions;
        //   state.keywords = action.payload.keywords;
        })
        .addCase(fetchNote.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload as string;
        });
    },
  });
  
  export default noteSlice.reducer;
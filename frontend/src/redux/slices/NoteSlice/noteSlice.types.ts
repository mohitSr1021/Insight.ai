export interface Note {
  _id: string;
  title: string;
  content: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface NotesState {
  notes: Note[];
  isLoading: boolean;
  error: string | null;
  selectedNote: Note | null;
  isEditModalOpen: boolean;
  sortOrder: "asc" | "desc";
}

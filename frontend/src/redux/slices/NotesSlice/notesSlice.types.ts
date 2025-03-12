export interface Note {
  _id: string;
  title: string;
  content: string;
  link?: string;
  isFavourite: boolean;
  userId: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface NotesState {
  notes: Note[];
  filteredNotes: Note[];
  isLoading: boolean;
  pMsg: string | null;
  error: string | null;
  selectedNote: Note | null;
  isEditModalOpen: boolean;
  sortOrder: "asc" | "desc";
}

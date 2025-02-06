export interface Note {
  _id: string;
  title: string;
  content: string;
  link?: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface NoteCardProps {
  note: Note;
}

export const formatDate = (isoString: string) => {
  const date = new Date(isoString);
  return date.toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });
};

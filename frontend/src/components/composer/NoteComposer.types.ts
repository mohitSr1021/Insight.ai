export interface NoteComposerProps {
  onSave?: (note: {
    content: string;
    type: "text" | "recording";
    url?: string;
    image?: File;
  }) => void;
}

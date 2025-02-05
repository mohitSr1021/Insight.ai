export interface Note {
  _id: string;
  title: string;
  content: string;
  timestamp: Date;
  duration?: string;
  imageCount?: number;
  type: "audio" | "text";
  userId: string;
  link?: string;
}

export const getGridLayout = (current: string) => {
  switch (current) {
    case "xs":
      return "grid-cols-1";
    case "sm":
      return "grid-cols-2";
    case "md":
      return "grid-cols-2";
    case "lg":
      return "grid-cols-3";
    case "xl":
      return "grid-cols-4";
    case "2xl":
      return "grid-cols-4";
    default:
      return "grid-cols-1";
  }
};

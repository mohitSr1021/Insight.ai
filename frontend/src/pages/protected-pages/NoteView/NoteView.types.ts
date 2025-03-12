// Define proper TypeScript interfaces
export interface Note {
  id: string;
  title: string;
  content: string;
  link?: string;
  createdAt: string;
  updatedAt: string;
}

interface RelatedArticle {
  title: string;
  url: string;
  analysis: string;
}

interface RelatedWebsite {
  title: string;
  url: string;
  description: string;
}

interface RelatedVideo {
  title: string;
  url: string;
  description: string;
}

export interface Suggestions {
  relatedTopics?: string[];
  relatedArticles?: RelatedArticle[];
  relatedWebsites?: RelatedWebsite[];
  relatedVideos?: RelatedVideo[];
}

export type TabType = "articles" | "websites" | "videos";
export const disabledClasses =
  "bg-white/25 text-slate-300 cursor-not-allowed opacity-50 grayscale pointer-events-none flex items-center";
export const baseClasses =
  "p-2 text-slate-500 hover:text-primary rounded-full hover:bg-slate-100 transition-colors";

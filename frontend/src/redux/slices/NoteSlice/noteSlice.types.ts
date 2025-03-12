export interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
}

export interface NoteState {
  note: Note | null;
  suggestions: {
    relatedTopics: string[];
    relatedArticles: RelatedArticle[];
    relatedVideos: RelatedVideo[];
    relatedImages: RelatedImage[];
    relatedWebsites: RelatedWebsite[];
    relatedBlogs: RelatedBlog[];
    relatedLinks: RelatedLink[];
  };
  // keywords: string;
  loading: boolean;
  error: string | null;
}

export interface RelatedArticle {
  title: string;
  analysis: string;
  url: string;
}

export interface RelatedVideo {
  title: string;
  url: string;
  description: string;
}

export interface RelatedImage {
  description: string;
  url: string;
}

export interface RelatedWebsite {
  title: string;
  url: string;
  description: string;
}

export interface RelatedBlog {
  title: string;
  url: string;
  description: string;
}

export interface RelatedLink {
  title: string;
  url: string;
  description: string;
}

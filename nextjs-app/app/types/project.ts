export type Project = {
    title: string;
    slug: { current: string };
    projectNumber?: string | null;
    category?: string | null;
    thumbnail?: any;
    projectInfo?: {
      year?: { value?: string } | null;
      location?: { value?: { ca: string; es: string; en: string } } | null;
      program?: { value?: { ca: string; es: string; en: string } } | null;
      area?: { value?: string } | null;
    };
  };
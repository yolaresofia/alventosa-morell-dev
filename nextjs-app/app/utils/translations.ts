import { PortableTextBlock } from "next-sanity";

export type LocalizedField = {
  ca?: string;
  es?: string;
  en?: string;
};

export type LocalizedPortableText = {
  ca?: PortableTextBlock[];
  es?: PortableTextBlock[];
  en?: PortableTextBlock[];
};

export const getTranslation = (
  field: LocalizedField | undefined,
  language: 'ca' | 'es' | 'en'
): string => {
  return field?.[language] || field?.en || '';
};

export const getPortableTextTranslation = (
  field: LocalizedPortableText | undefined,
  language: 'ca' | 'es' | 'en'
): PortableTextBlock[] => {
  return field?.[language] || field?.en || [];
};

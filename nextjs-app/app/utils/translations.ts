export type LocalizedField = {
    ca?: string
    es?: string
    en?: string
  }
  
  export const getTranslation = (
    field: LocalizedField | undefined,
    language: 'ca' | 'es' | 'en'
  ): string => {
    return field?.[language] || field?.en || ''
  }
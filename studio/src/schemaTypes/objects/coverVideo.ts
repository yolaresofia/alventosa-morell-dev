import { defineField, defineType } from 'sanity'
import { VideoIcon } from '@sanity/icons'

export const coverVideo = defineType({
  name: 'coverVideo',
  title: 'Vídeo a pantalla completa',
  type: 'object',
  icon: VideoIcon,
  fields: [
    defineField({
      name: 'vimeoUrl',
      title: 'Vimeo URL',
      type: 'url',
      validation: (Rule) =>
        Rule.uri({
          scheme: ['https'],
        }).error('Introdueix una URL vàlida de Vimeo'),
    }),
    defineField({
      name: 'altText',
      title: 'Text alternatiu',
      type: 'object',
      fields: [
        defineField({ name: 'ca', title: 'Català', type: 'string' }),
        defineField({ name: 'es', title: 'Español', type: 'string' }),
        defineField({ name: 'en', title: 'English', type: 'string' }),
      ],
      validation: (Rule) =>
        Rule.required().error('El text alternatiu és obligatori'),
    }),
  ],
  preview: {
    select: {
      title: 'altText.ca',
    },
    prepare({ title }) {
      return {
        title: title || 'Vídeo a pantalla completa',
        subtitle: title ? '' : 'Sense text alternatiu',
        media: VideoIcon,
      }
    },
  },
})

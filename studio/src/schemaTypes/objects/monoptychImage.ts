import {defineField, defineType} from 'sanity'
import {ImageIcon} from '@sanity/icons'

export const monoptychImage = defineType({
  name: 'monoptychImage',
  title: 'Imatge única',
  type: 'object',
  icon: ImageIcon,
  fields: [
    defineField({
      name: 'image',
      title: 'Imatge',
      type: 'image',
      options: {hotspot: true},
    }),
    defineField({
      name: 'altText',
      title: 'Text alternatiu',
      type: 'object',
      fields: [
        defineField({name: 'ca', title: 'Català', type: 'string'}),
        defineField({name: 'es', title: 'Español', type: 'string'}),
        defineField({name: 'en', title: 'English', type: 'string'}),
      ],
      validation: (Rule) => Rule.required().error('El text alternatiu és obligatori'),
    }),
  ],
  preview: {
    select: {
      media: 'image',
    },
    prepare({media}) {
      return {
        title: 'Imatge única',
        subtitle: '1 imatge amb text alternatiu',
        media: media || ImageIcon,
      }
    },
  },
})

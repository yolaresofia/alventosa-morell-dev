import {defineField, defineType} from 'sanity'
import {ImageIcon} from '@sanity/icons'

export const coverImage = defineType({
  name: 'coverImage',
  title: 'Imatge a pantalla completa',
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
      title: 'altText.ca',
    },
    prepare({media, title}) {
      return {
        title: title || 'Imatge a pantalla completa',
        subtitle: title ? '' : 'Sense text alternatiu',
        media: media || ImageIcon,
      }
    },
  },
})

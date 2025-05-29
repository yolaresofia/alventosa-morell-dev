import { defineField, defineType } from 'sanity'
import { ImagesIcon } from '@sanity/icons'

export const diptychImage = defineType({
  name: 'diptychImage',
  title: 'Díptic',
  type: 'object',
  icon: ImagesIcon,
  fields: [
    defineField({
      name: 'leftImage',
      title: 'Imatge esquerra',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'leftImageOnHover',
      title: 'Imatge esquerra en hover',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'leftAltText',
      title: 'Text alternatiu de la imatge esquerra',
      type: 'object',
      fields: [
        defineField({ name: 'ca', title: 'Català', type: 'string' }),
        defineField({ name: 'es', title: 'Español', type: 'string' }),
        defineField({ name: 'en', title: 'English', type: 'string' }),
      ],
      validation: (Rule) =>
        Rule.required().error('El text alternatiu és obligatori'),
    }),
    defineField({
      name: 'rightImage',
      title: 'Imatge dreta',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'rightImageOnHover',
      title: 'Imatge dreta en hover',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'rightAltText',
      title: 'Text alternatiu de la imatge dreta',
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
      media: 'leftImage',
    },
    prepare({ media }) {
      return {
        title: 'Díptic',
        subtitle: '2 imatges amb text alternatiu',
        media: media || ImagesIcon,
      }
    },
  },
})

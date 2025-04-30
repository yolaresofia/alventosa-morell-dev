import {defineField, defineType} from 'sanity'
import {ImagesIcon} from '@sanity/icons'

export const imageCarousel = defineType({
  name: 'imageCarousel',
  title: 'Carrusel d’imatges',
  type: 'object',
  icon: ImagesIcon,
  fields: [
    defineField({
      name: 'images',
      title: 'Imatges',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'imageWithAltText',
          title: 'Imatge amb text alternatiu',
          fields: [
            defineField({
              name: 'image',
              title: 'Imatge',
              type: 'image',
              options: {hotspot: true},
              validation: (Rule) => Rule.required(),
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
              validation: (Rule) =>
                Rule.required().error('El text alternatiu és obligatori'),
            }),
          ],
          preview: {
            select: {
              media: 'image',
              title: 'altText.ca',
            },
            prepare({media, title}) {
              return {
                title: title || 'Imatge del carrusel',
                media: media || ImagesIcon,
              }
            },
          },
        },
      ],
      validation: (Rule) =>
        Rule.required().min(2).error('Afegeix almenys dues imatges'),
    }),
  ],
  preview: {
    select: {
      media: 'images.0.image',
    },
    prepare({media}) {
      return {
        title: 'Carrusel d’imatges',
        subtitle: 'Conjunt d’imatges amb text alternatiu',
        media: media || ImagesIcon,
      }
    },
  },
})

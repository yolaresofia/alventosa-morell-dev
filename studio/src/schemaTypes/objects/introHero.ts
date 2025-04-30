import {defineField, defineType} from 'sanity'
import {TextIcon} from '@sanity/icons'

export const introHero = defineType({
  name: 'introHero',
  title: 'Intro Hero',
  type: 'object',
  icon: TextIcon,
  fields: [
    defineField({
      name: 'desktopBackgroundImages',
      title: 'Imágenes de fondo (Escritorio)',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({
              name: 'image',
              title: 'Imagen',
              type: 'image',
            }),
            defineField({
              name: 'altText',
              title: 'Texto alternativo',
              type: 'string',
              description: 'Texto alternativo para accesibilidad y SEO',
            }),
          ],
          preview: {
            select: {
              title: 'altText',
              media: 'image',
            },
            prepare({title, media}) {
              return {
                title: title || 'Sin texto alternativo',
                subtitle: 'Imagen de fondo (Escritorio)',
                media: media || TextIcon,
              }
            },
          },
        },
      ],
    }),
    defineField({
      name: 'mobileBackgroundImages',
      title: 'Imágenes de fondo (Móvil)',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({
              name: 'image',
              title: 'Imagen',
              type: 'image',
            }),
            defineField({
              name: 'altText',
              title: 'Texto alternativo',
              type: 'string',
              description: 'Texto alternativo para accesibilidad y SEO',
            }),
          ],
          preview: {
            select: {
              title: 'altText',
              media: 'image',
            },
            prepare({title, media}) {
              return {
                title: title || 'Sin texto alternativo',
                subtitle: 'Imagen de fondo (Móvil)',
                media: media || TextIcon,
              }
            },
          },
        },
      ],
    }),
    defineField({
      name: 'logo',
      title: 'Logo',
      type: 'image',
    }),
    defineField({
      name: 'logoAltText',
      title: 'Logo Alt Text',
      type: 'string',
    }),
    defineField({
      name: 'filter',
      title: 'Activar filtro',
      type: 'boolean',
      description: 'Activa o desactiva el filtro de fondo del logo',
      initialValue: false,
    }),
  ],
  preview: {
    select: {
      backgroundImage: 'desktopBackgroundImages.0.image',
    },
    prepare({backgroundImage}) {
      return {
        title: 'Intro Hero',
        media: backgroundImage || TextIcon,
      }
    },
  },
})

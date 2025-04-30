import {defineField, defineType} from 'sanity'
import {ImagesIcon} from '@sanity/icons'

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
      options: {hotspot: true},
    }),
    defineField({
      name: 'leftAltText',
      title: 'Text alternatiu de la imatge esquerra',
      type: 'object',
      fields: [
        defineField({name: 'ca', title: 'Català', type: 'string'}),
        defineField({name: 'es', title: 'Español', type: 'string'}),
        defineField({name: 'en', title: 'English', type: 'string'}),
      ],
      validation: (Rule) => Rule.required().error('El text alternatiu és obligatori'),
    }),
    defineField({
      name: 'rightImage',
      title: 'Imatge dreta',
      type: 'image',
      options: {hotspot: true},
    }),
    defineField({
      name: 'rightAltText',
      title: 'Text alternatiu de la imatge dreta',
      type: 'object',
      fields: [
        defineField({name: 'ca', title: 'Català', type: 'string'}),
        defineField({name: 'es', title: 'Español', type: 'string'}),
        defineField({name: 'en', title: 'English', type: 'string'}),
      ],
      validation: (Rule) => Rule.required().error('El text alternatiu és obligatori'),
    }),
    defineField({
      name: 'paddingTop',
      title: 'Espai superior',
      type: 'string',
      options: {
        list: [
          {title: '0', value: '0'},
          {title: '4', value: '4'},
          {title: '8', value: '8'},
          {title: '12', value: '12'},
          {title: '16', value: '16'},
          {title: '20', value: '20'},
          {title: '24', value: '24'},
          {title: '32', value: '32'},
          {title: '40', value: '40'},
          {title: '48', value: '48'},
          {title: '56', value: '56'},
          {title: '64', value: '64'},
        ],
      },
    }),
    defineField({
      name: 'paddingBottom',
      title: 'Espai inferior',
      type: 'string',
      options: {
        list: [
          {title: '0', value: '0'},
          {title: '4', value: '4'},
          {title: '8', value: '8'},
          {title: '12', value: '12'},
          {title: '16', value: '16'},
          {title: '20', value: '20'},
          {title: '24', value: '24'},
          {title: '32', value: '32'},
          {title: '40', value: '40'},
          {title: '48', value: '48'},
          {title: '56', value: '56'},
          {title: '64', value: '64'},
        ],
      },
    }),
  ],
  preview: {
    select: {
      media: 'leftImage',
    },
    prepare({media}) {
      return {
        title: 'Díptic',
        subtitle: '2 imatges amb text alternatiu',
        media: media || ImagesIcon,
      }
    },
  },
})

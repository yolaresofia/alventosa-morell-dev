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
      validation: (Rule) =>
        Rule.required().error('El text alternatiu és obligatori'),
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
      initialValue: '0',
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
      initialValue: '0',
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

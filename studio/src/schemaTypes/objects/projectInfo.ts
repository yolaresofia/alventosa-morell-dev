import {defineField, defineType} from 'sanity'
import {DocumentIcon} from '@sanity/icons'

export const projectInfo = defineType({
  name: 'projectInfo',
  title: 'Informació del projecte',
  type: 'object',
  icon: DocumentIcon,
  fields: [
    defineField({
      name: 'description',
      title: 'Descripció',
      type: 'object',
      fields: [
        defineField({name: 'ca', title: 'Català', type: 'text'}),
        defineField({name: 'es', title: 'Español', type: 'text'}),
        defineField({name: 'en', title: 'English', type: 'text'}),
      ],
    }),

    defineField({
      name: 'project',
      title: 'Projecte',
      type: 'object',
      fields: [
        defineField({name: 'label', title: 'Etiqueta', type: 'object', fields: [
          defineField({name: 'ca', title: 'Català', type: 'string'}),
          defineField({name: 'es', title: 'Español', type: 'string'}),
          defineField({name: 'en', title: 'English', type: 'string'}),
        ]}),
        defineField({name: 'value', title: 'Valor', type: 'object', fields: [
          defineField({name: 'ca', title: 'Català', type: 'string'}),
          defineField({name: 'es', title: 'Español', type: 'string'}),
          defineField({name: 'en', title: 'English', type: 'string'}),
        ]}),
      ],
    }),

    defineField({
      name: 'year',
      title: 'Any',
      type: 'object',
      fields: [
        defineField({name: 'label', title: 'Etiqueta', type: 'object', fields: [
          defineField({name: 'ca', title: 'Català', type: 'string'}),
          defineField({name: 'es', title: 'Español', type: 'string'}),
          defineField({name: 'en', title: 'English', type: 'string'}),
        ]}),
        defineField({name: 'value', title: 'Valor', type: 'string'}),
      ],
    }),

    defineField({
      name: 'location',
      title: 'Ubicació',
      type: 'object',
      fields: [
        defineField({name: 'label', title: 'Etiqueta', type: 'object', fields: [
          defineField({name: 'ca', title: 'Català', type: 'string'}),
          defineField({name: 'es', title: 'Español', type: 'string'}),
          defineField({name: 'en', title: 'English', type: 'string'}),
        ]}),
        defineField({name: 'value', title: 'Valor', type: 'object', fields: [
          defineField({name: 'ca', title: 'Català', type: 'string'}),
          defineField({name: 'es', title: 'Español', type: 'string'}),
          defineField({name: 'en', title: 'English', type: 'string'}),
        ]}),
      ],
    }),

    defineField({
      name: 'program',
      title: 'Programa',
      type: 'object',
      fields: [
        defineField({name: 'label', title: 'Etiqueta', type: 'object', fields: [
          defineField({name: 'ca', title: 'Català', type: 'string'}),
          defineField({name: 'es', title: 'Español', type: 'string'}),
          defineField({name: 'en', title: 'English', type: 'string'}),
        ]}),
        defineField({name: 'value', title: 'Valor', type: 'object', fields: [
          defineField({name: 'ca', title: 'Català', type: 'string'}),
          defineField({name: 'es', title: 'Español', type: 'string'}),
          defineField({name: 'en', title: 'English', type: 'string'}),
        ]}),
      ],
    }),

    defineField({
      name: 'area',
      title: 'Superfície',
      type: 'object',
      fields: [
        defineField({name: 'label', title: 'Etiqueta', type: 'object', fields: [
          defineField({name: 'ca', title: 'Català', type: 'string'}),
          defineField({name: 'es', title: 'Español', type: 'string'}),
          defineField({name: 'en', title: 'English', type: 'string'}),
        ]}),
        defineField({name: 'value', title: 'Valor', type: 'string'}),
      ],
    }),

    defineField({
      name: 'authors',
      title: 'Autors',
      type: 'object',
      fields: [
        defineField({name: 'label', title: 'Etiqueta', type: 'object', fields: [
          defineField({name: 'ca', title: 'Català', type: 'string'}),
          defineField({name: 'es', title: 'Español', type: 'string'}),
          defineField({name: 'en', title: 'English', type: 'string'}),
        ]}),
        defineField({name: 'value', title: 'Valor', type: 'object', fields: [
          defineField({name: 'ca', title: 'Català', type: 'string'}),
          defineField({name: 'es', title: 'Español', type: 'string'}),
          defineField({name: 'en', title: 'English', type: 'string'}),
        ]}),
      ],
    }),

    defineField({
      name: 'team',
      title: 'Equip',
      type: 'object',
      fields: [
        defineField({name: 'label', title: 'Etiqueta', type: 'object', fields: [
          defineField({name: 'ca', title: 'Català', type: 'string'}),
          defineField({name: 'es', title: 'Español', type: 'string'}),
          defineField({name: 'en', title: 'English', type: 'string'}),
        ]}),
        defineField({name: 'value', title: 'Valor', type: 'object', fields: [
          defineField({name: 'ca', title: 'Català', type: 'string'}),
          defineField({name: 'es', title: 'Español', type: 'string'}),
          defineField({name: 'en', title: 'English', type: 'string'}),
        ]}),
      ],
    }),

    defineField({
      name: 'photographer',
      title: 'Fotògraf',
      type: 'object',
      fields: [
        defineField({name: 'label', title: 'Etiqueta', type: 'object', fields: [
          defineField({name: 'ca', title: 'Català', type: 'string'}),
          defineField({name: 'es', title: 'Español', type: 'string'}),
          defineField({name: 'en', title: 'English', type: 'string'}),
        ]}),
        defineField({name: 'value', title: 'Valor', type: 'string'}),
      ],
    }),
  ],
  preview: {
    select: {
      title: 'project.value.ca',
      subtitle: 'location.value.ca',
    },
    prepare({title, subtitle}) {
      return {
        title: title || 'Informació del projecte',
        subtitle: subtitle || '',
      }
    },
  },
})

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
      description: "Aquest camp és opcional. Si no s'afegeix cap text, no es mostrarà.",
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
        defineField({
          name: 'label',
          title: 'Etiqueta',
          type: 'object',
          fields: [
            defineField({name: 'ca', title: 'Català', type: 'string'}),
            defineField({name: 'es', title: 'Español', type: 'string'}),
            defineField({name: 'en', title: 'English', type: 'string'}),
          ],
        }),
        defineField({
          name: 'value',
          title: 'Valor',
          type: 'object',
          fields: [
            defineField({name: 'ca', title: 'Català', type: 'string'}),
            defineField({name: 'es', title: 'Español', type: 'string'}),
            defineField({name: 'en', title: 'English', type: 'string'}),
          ],
        }),
      ],
    }),

    defineField({
      name: 'year',
      title: 'Any',
      type: 'object',
      fields: [
        defineField({
          name: 'label',
          title: 'Etiqueta',
          type: 'object',
          fields: [
            defineField({name: 'ca', title: 'Català', type: 'string'}),
            defineField({name: 'es', title: 'Español', type: 'string'}),
            defineField({name: 'en', title: 'English', type: 'string'}),
          ],
        }),
        defineField({name: 'value', title: 'Valor', type: 'string'}),
      ],
    }),

    defineField({
      name: 'location',
      title: 'Ubicació',
      type: 'object',
      fields: [
        defineField({
          name: 'label',
          title: 'Etiqueta',
          type: 'object',
          fields: [
            defineField({name: 'ca', title: 'Català', type: 'string'}),
            defineField({name: 'es', title: 'Español', type: 'string'}),
            defineField({name: 'en', title: 'English', type: 'string'}),
          ],
        }),
        defineField({
          name: 'value',
          title: 'Valor',
          type: 'object',
          fields: [
            defineField({name: 'ca', title: 'Català', type: 'string'}),
            defineField({name: 'es', title: 'Español', type: 'string'}),
            defineField({name: 'en', title: 'English', type: 'string'}),
          ],
        }),
      ],
    }),

    defineField({
      name: 'program',
      title: 'Programa',
      type: 'object',
      fields: [
        defineField({
          name: 'label',
          title: 'Etiqueta',
          type: 'object',
          fields: [
            defineField({name: 'ca', title: 'Català', type: 'string'}),
            defineField({name: 'es', title: 'Español', type: 'string'}),
            defineField({name: 'en', title: 'English', type: 'string'}),
          ],
        }),
        defineField({
          name: 'value',
          title: 'Valor',
          type: 'object',
          fields: [
            defineField({name: 'ca', title: 'Català', type: 'string'}),
            defineField({name: 'es', title: 'Español', type: 'string'}),
            defineField({name: 'en', title: 'English', type: 'string'}),
          ],
        }),
      ],
    }),

    defineField({
      name: 'area',
      title: 'Superfície',
      type: 'object',
      fields: [
        defineField({
          name: 'label',
          title: 'Etiqueta',
          type: 'object',
          fields: [
            defineField({name: 'ca', title: 'Català', type: 'string'}),
            defineField({name: 'es', title: 'Español', type: 'string'}),
            defineField({name: 'en', title: 'English', type: 'string'}),
          ],
        }),
        defineField({name: 'value', title: 'Valor', type: 'string'}),
      ],
    }),

    defineField({
      name: 'authors',
      title: 'Autors',
      type: 'object',
      fields: [
        defineField({
          name: 'label',
          title: 'Etiqueta',
          type: 'object',
          fields: [
            defineField({name: 'ca', title: 'Català', type: 'string'}),
            defineField({name: 'es', title: 'Español', type: 'string'}),
            defineField({name: 'en', title: 'English', type: 'string'}),
          ],
        }),
        defineField({
          name: 'value',
          title: 'Valor',
          type: 'object',
          fields: [
            defineField({name: 'ca', title: 'Català', type: 'string'}),
            defineField({name: 'es', title: 'Español', type: 'string'}),
            defineField({name: 'en', title: 'English', type: 'string'}),
          ],
        }),
      ],
    }),
    defineField({
      name: 'team',
      title: 'Equip',
      type: 'object',
      fields: [
        defineField({
          name: 'label',
          title: 'Etiqueta',
          type: 'object',
          fields: [
            defineField({name: 'ca', title: 'Català', type: 'string'}),
            defineField({name: 'es', title: 'Español', type: 'string'}),
            defineField({name: 'en', title: 'English', type: 'string'}),
          ],
        }),
        defineField({
          name: 'value',
          title: 'Valor',
          type: 'object',
          fields: [
            defineField({name: 'ca', title: 'Català', type: 'string'}),
            defineField({name: 'es', title: 'Español', type: 'string'}),
            defineField({name: 'en', title: 'English', type: 'string'}),
          ],
        }),
      ],
    }),
    defineField({
      name: 'photographer',
      title: 'Fotògraf',
      type: 'object',
      fields: [
        defineField({
          name: 'label',
          title: 'Etiqueta',
          type: 'object',
          fields: [
            defineField({name: 'ca', title: 'Català', type: 'string'}),
            defineField({name: 'es', title: 'Español', type: 'string'}),
            defineField({name: 'en', title: 'English', type: 'string'}),
          ],
        }),
        defineField({name: 'value', title: 'Valor', type: 'string'}),
      ],
    }),
    defineField({
      name: 'awards',
      title: 'Premis',
      type: 'object',
      fields: [
        defineField({
          name: 'label',
          title: 'Etiqueta',
          type: 'object',
          fields: [
            defineField({name: 'ca', title: 'Català', type: 'string', initialValue: 'Premis'}),
            defineField({name: 'es', title: 'Español', type: 'string', initialValue: 'Premios'}),
            defineField({name: 'en', title: 'English', type: 'string', initialValue: 'Awards'}),
          ],
        }),
        defineField({
          name: 'value',
          title: 'Valor',
          type: 'object',
          fields: [
            defineField({
              name: 'ca',
              title: 'Català',
              type: 'array',
              of: [{type: 'string'}],
            }),
            defineField({
              name: 'es',
              title: 'Español',
              type: 'array',
              of: [{type: 'string'}],
            }),
            defineField({
              name: 'en',
              title: 'English',
              type: 'array',
              of: [{type: 'string'}],
            }),
          ],
          description: 'Llista de premis o reconeixements obtinguts pel projecte en diversos idiomes.',
        }),
        
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

import { ListIcon } from '@sanity/icons'
import {defineField, defineType} from 'sanity'

export const projectSummary = defineType({
  name: 'projectSummary',
  title: 'Resum de projecte',
  type: 'object',
  icon: ListIcon,
  fields: [
    defineField({
      name: 'number',
      title: 'Número',
      type: 'string',
    }),
    defineField({
      name: 'title',
      title: 'Títol',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Descripció',
      type: 'text',
      rows: 4,
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'number',
    },
    prepare({title, subtitle}) {
      return {
        title,
        subtitle: subtitle ? `Projecte ${subtitle}` : undefined,
      }
    },
  },
})

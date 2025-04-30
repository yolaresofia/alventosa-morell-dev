import {TextIcon} from '@sanity/icons'
import {defineType, defineField} from 'sanity'

export const textBlock = defineType({
  name: 'textBlock',
  title: 'Text Block',
  type: 'object',
  icon: TextIcon,
  fields: [
    defineField({
      name: 'text',
      title: 'Text',
      type: 'object',
      fields: [
        defineField({name: 'ca', title: 'Català', type: 'text', rows: 6}),
        defineField({name: 'es', title: 'Español', type: 'text', rows: 6}),
        defineField({name: 'en', title: 'English', type: 'text', rows: 6}),
      ],
      validation: (Rule) => Rule.required().error('El text és obligatori'),
    }),
    defineField({
      name: 'alignment',
      title: 'Text Alignment',
      type: 'string',
      initialValue: 'left',
      options: {
        list: [
          {title: 'Left', value: 'left'},
          {title: 'Right', value: 'right'},
        ],
        layout: 'radio',
      },
    }),
  ],
  preview: {
    select: {
      title: 'text',
      subtitle: 'alignment',
    },
    prepare({title, subtitle}) {
      const short = title?.length > 50 ? title.slice(0, 47) + '…' : title
      return {
        title: short || 'Text Block',
        subtitle: `Aligned ${subtitle || 'left'}`,
      }
    },
  },
})

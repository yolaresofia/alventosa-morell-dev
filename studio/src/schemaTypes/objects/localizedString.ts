import {defineField, defineType} from 'sanity'

export const localizedString = defineType({
  name: 'localizedString',
  title: 'Localized string',
  type: 'object',
  fields: [
    defineField({name: 'ca', title: 'Català', type: 'string'}),
    defineField({name: 'es', title: 'Español', type: 'string'}),
    defineField({name: 'en', title: 'English', type: 'string'}),
  ],
})

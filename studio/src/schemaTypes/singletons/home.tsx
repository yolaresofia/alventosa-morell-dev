import {HomeIcon} from '@sanity/icons'
import {defineArrayMember, defineField, defineType} from 'sanity'

export const home = defineType({
  name: 'home',
  title: 'Pàgina d’inici',
  type: 'document',
  icon: HomeIcon,
  fields: [
    defineField({
      name: 'featuredProjects',
      title: 'Projectes destacats',
      type: 'array',
      of: [
        defineArrayMember({
          name: 'project',
          type: 'reference',
          to: [{type: 'project'}],
        }),
      ],
      description: 'Projectes que es mostraran destacats a la pàgina inicial.',
    }),
  ],

  preview: {
    prepare() {
      return {
        title: '🏠 Home',
        subtitle: 'Configuració de la pàgina d’inici',
      }
    },
  },
})

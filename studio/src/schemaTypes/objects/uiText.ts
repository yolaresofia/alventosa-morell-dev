import {defineField, defineType} from 'sanity'

export const uiText = defineType({
  name: 'uiText',
  title: 'Textos d\'interfície',
  type: 'object',
  options: {collapsible: true, collapsed: true},
  fields: [
    defineField({
      name: 'notFound',
      title: '404 / Pàgina no trobada',
      type: 'object',
      options: {collapsible: true, collapsed: true},
      fields: [
        defineField({
          name: 'pageTitle',
          title: 'Títol pàgina no trobada',
          description: 'Ex.: "Pàgina no trobada"',
          type: 'localizedString',
        }),
        defineField({
          name: 'projectTitle',
          title: 'Títol projecte no trobat',
          description: 'Ex.: "Projecte no trobat"',
          type: 'localizedString',
        }),
      ],
    }),
    defineField({
      name: 'navigation',
      title: 'Navegació',
      type: 'object',
      options: {collapsible: true, collapsed: true},
      fields: [
        defineField({name: 'home', title: 'Inici', type: 'localizedString'}),
        defineField({name: 'projects', title: 'Projectes', type: 'localizedString'}),
        defineField({name: 'projectsIndex', title: 'Índex de projectes', type: 'localizedString'}),
        defineField({name: 'about', title: 'Sobre nosaltres', type: 'localizedString'}),
        defineField({name: 'allProjects', title: 'Tots els projectes', type: 'localizedString'}),
      ],
    }),
    defineField({
      name: 'projectCategories',
      title: 'Categories de projectes',
      type: 'object',
      options: {collapsible: true, collapsed: true},
      fields: [
        defineField({name: 'all', title: 'Tots', type: 'localizedString'}),
        defineField({name: 'uni', title: 'Unifamiliar', type: 'localizedString'}),
        defineField({name: 'pluri', title: 'Plurifamiliar', type: 'localizedString'}),
        defineField({name: 'equip', title: 'Equipaments', type: 'localizedString'}),
      ],
    }),
    defineField({
      name: 'common',
      title: 'Comú',
      type: 'object',
      options: {collapsible: true, collapsed: true},
      fields: [
        defineField({
          name: 'viewProjects',
          title: 'Veure projectes (CTA)',
          description: 'Enllaç de la pàgina About cap a /projects',
          type: 'localizedString',
        }),
      ],
    }),
  ],
})

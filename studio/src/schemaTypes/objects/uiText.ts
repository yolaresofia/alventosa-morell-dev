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
        defineField({
          name: 'projectDescription',
          title: 'Descripció meta projecte no trobat',
          description: 'Meta description quan el projecte no existeix (SEO). Ex.: "El projecte sol·licitat no s\'ha pogut trobar."',
          type: 'localizedString',
        }),
      ],
    }),
    defineField({
      name: 'pageTitles',
      title: 'Títols de pàgina (fallback)',
      description: 'Títols utilitzats com a h1 i fallback SEO quan no hi ha un títol SEO específic configurat.',
      type: 'object',
      options: {collapsible: true, collapsed: true},
      fields: [
        defineField({
          name: 'home',
          title: 'Home (h1)',
          description: 'h1 invisible de la home per a SEO i accessibilitat. Ex.: "Alventosa Morell Arquitectes"',
          type: 'localizedString',
        }),
        defineField({
          name: 'about',
          title: 'About',
          description: 'Títol SEO i h1 de /about. Ex.: "Sobre Nosaltres"',
          type: 'localizedString',
        }),
        defineField({
          name: 'projects',
          title: 'Projectes',
          description: 'Títol SEO i h1 de /projects quan no hi ha un seoTitle específic. Ex.: "Projectes"',
          type: 'localizedString',
        }),
        defineField({
          name: 'projectsIndex',
          title: 'Índex de projectes',
          description: 'Títol SEO i h1 de /projects/index. Ex.: "Índex de Projectes"',
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
      name: 'projectsIndexColumns',
      title: 'Columnes de l\'índex de projectes',
      description: 'Capçaleres de la taula /projects/index.',
      type: 'object',
      options: {collapsible: true, collapsed: true},
      fields: [
        defineField({name: 'project', title: 'Projecte', type: 'localizedString'}),
        defineField({name: 'program', title: 'Programa', type: 'localizedString'}),
        defineField({name: 'location', title: 'Ubicació', type: 'localizedString'}),
        defineField({name: 'area', title: 'Àrea', type: 'localizedString'}),
        defineField({name: 'year', title: 'Any', type: 'localizedString'}),
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

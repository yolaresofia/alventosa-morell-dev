import {defineType, defineField} from 'sanity'

export const project = defineType({
  name: 'project',
  title: 'Projecte',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Títol',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {source: 'title'},
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'featuredImage',
      title: 'Imatge destacada',
      type: 'image',
      options: {hotspot: true},
      fields: [
        defineField({
          name: 'altText',
          title: 'Text alternatiu',
          type: 'object',
          fields: [
            defineField({name: 'ca', title: 'Català', type: 'string'}),
            defineField({name: 'es', title: 'Español', type: 'string'}),
            defineField({name: 'en', title: 'English', type: 'string'}),
          ],
          validation: (Rule) => Rule.required().error('El text alternatiu és obligatori'),
        }),
      ],
    }),
    defineField({
      name: 'mobileFeaturedImage',
      title: 'Imatge destacada móvil',
      type: 'image',
      options: {hotspot: true},
      fields: [
        defineField({
          name: 'altText',
          title: 'Text alternatiu',
          type: 'object',
          fields: [
            defineField({name: 'ca', title: 'Català', type: 'string'}),
            defineField({name: 'es', title: 'Español', type: 'string'}),
            defineField({name: 'en', title: 'English', type: 'string'}),
          ],
          validation: (Rule) => Rule.required().error('El text alternatiu és obligatori'),
        }),
      ],
    }),
    defineField({
      name: 'thumbnail',
      title: 'Imatge miniatura',
      type: 'image',
      options: {hotspot: true},
      fields: [
        defineField({
          name: 'altText',
          title: 'Text alternatiu',
          type: 'object',
          fields: [
            defineField({name: 'ca', title: 'Català', type: 'string'}),
            defineField({name: 'es', title: 'Español', type: 'string'}),
            defineField({name: 'en', title: 'English', type: 'string'}),
          ],
          validation: (Rule) => Rule.required().error('El text alternatiu és obligatori'),
        }),
      ],
    }),
    defineField({
      name: 'notClickableInIndex',
      title: 'No clicable a l’índex',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'projectNumber',
      title: 'Número de projecte',
      type: 'string',
    }),
    defineField({
      name: 'projectYear',
      title: 'Any de projecte',
      type: 'string',
    }),
    defineField({
      name: 'category',
      title: 'Categoria',
      type: 'string',
      options: {
        list: [
          {title: 'Tots', value: 'all'},
          {title: 'Unifamiliar', value: 'uni'},
          {title: 'Plurifamiliar', value: 'pluri'},
          {title: 'Equipaments', value: 'equip'},
        ],
      },
    }),
    defineField({
      name: 'builder',
      title: 'Constructor de pàgina',
      type: 'array',
      of: [
        {type: 'coverImage'},
        {type: 'projectSummary'},
        {type: 'diptychImage'},
        {type: 'textBlock'},
        {type: 'imageCarousel'},
        {type: 'projectInfo'},
        {type: 'monoptychImage'},
        {type: 'coverVideo'},
      ],
    }),
  ],
})

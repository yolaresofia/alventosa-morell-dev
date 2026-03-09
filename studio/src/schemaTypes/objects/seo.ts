import {defineType, defineField} from 'sanity'

export const seo = defineType({
  name: 'seo',
  title: 'SEO',
  type: 'object',
  options: {
    collapsible: true,
    collapsed: true,
  },
  fields: [
    defineField({
      name: 'seoTitle',
      title: 'Títol SEO',
      type: 'object',
      description:
        'Títol per a cercadors i xarxes socials. Recomanat: 50–60 caràcters.',
      fields: [
        defineField({name: 'ca', title: 'Català', type: 'string', validation: (Rule) => Rule.max(60).warning('El títol hauria de tenir menys de 60 caràcters.')}),
        defineField({name: 'es', title: 'Español', type: 'string', validation: (Rule) => Rule.max(60).warning('El título debería tener menos de 60 caracteres.')}),
        defineField({name: 'en', title: 'English', type: 'string', validation: (Rule) => Rule.max(60).warning('Title should be under 60 characters.')}),
      ],
    }),
    defineField({
      name: 'seoDescription',
      title: 'Descripció SEO',
      type: 'object',
      description:
        'Descripció per a cercadors i xarxes socials. Recomanat: 120–155 caràcters.',
      fields: [
        defineField({name: 'ca', title: 'Català', type: 'string', validation: (Rule) => Rule.max(155).warning('La descripció hauria de tenir menys de 155 caràcters.')}),
        defineField({name: 'es', title: 'Español', type: 'string', validation: (Rule) => Rule.max(155).warning('La descripción debería tener menos de 155 caracteres.')}),
        defineField({name: 'en', title: 'English', type: 'string', validation: (Rule) => Rule.max(155).warning('Description should be under 155 characters.')}),
      ],
    }),
    defineField({
      name: 'seoImage',
      title: 'Imatge SEO / Open Graph',
      type: 'image',
      description: 'Imatge que es mostra a les xarxes socials. Recomanat: 1200×630px.',
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
        }),
      ],
    }),
  ],
})

import {defineType, defineField} from 'sanity'

export const seo = defineType({
  name: 'seo',
  title: 'SEO',
  type: 'object',
  fields: [
    defineField({
      name: 'seoTitle',
      title: 'Títol SEO',
      type: 'string',
      description:
        'Títol per a cercadors i xarxes socials. Recomanat: 50–60 caràcters.',
      validation: (Rule) =>
        Rule.max(60).warning('El títol hauria de tenir menys de 60 caràcters.'),
    }),
    defineField({
      name: 'seoDescription',
      title: 'Descripció SEO',
      type: 'string',
      description:
        'Descripció per a cercadors i xarxes socials. Recomanat: 120–155 caràcters.',
      validation: (Rule) =>
        Rule.max(155).warning(
          'La descripció hauria de tenir menys de 155 caràcters.',
        ),
    }),
    defineField({
      name: 'seoImage',
      title: 'Imatge SEO / Open Graph',
      type: 'image',
      description: 'Imatge que es mostra a les xarxes socials. Recomanat: 1200×630px.',
      options: {hotspot: true},
      fields: [
        defineField({
          name: 'alt',
          title: 'Text alternatiu',
          type: 'string',
        }),
      ],
    }),
  ],
})

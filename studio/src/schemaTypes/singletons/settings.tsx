import {defineArrayMember, defineField, defineType} from 'sanity'

export const settings = defineType({
  name: 'settings',
  title: 'Settings',
  type: 'document',
  fields: [
    defineField({
      name: 'siteTitle',
      title: 'Site Title',
      type: 'string',
    }),
    defineField({
      name: 'description',
      description: 'Used both for the <meta> description tag for SEO, and the site subheader.',
      title: 'Description',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'block',
          options: {},
          styles: [],
          lists: [],
          marks: {
            decorators: [],
            annotations: [
              defineField({
                type: 'object',
                name: 'link',
                fields: [
                  {
                    type: 'string',
                    name: 'href',
                    title: 'URL',
                    validation: (rule) => rule.required(),
                  },
                ],
              }),
            ],
          },
        }),
      ],
    }),
    defineField({
      name: 'ogImage',
      title: 'Open Graph Image',
      type: 'image',
      description: 'Displayed on social cards and search engine results.',
      options: {
        hotspot: true,
        aiAssist: {
          imageDescriptionField: 'alt',
        },
      },
      fields: [
        defineField({
          name: 'alt',
          description: 'Important for accessibility and SEO.',
          title: 'Alternative text',
          type: 'string',
          validation: (rule) => {
            return rule.custom((alt, context) => {
              if ((context.document?.ogImage as any)?.asset?._ref && !alt) {
                return 'Required'
              }
              return true
            })
          },
        }),
        defineField({
          name: 'metadataBase',
          type: 'url',
          description: (
            <a
              href="https://nextjs.org/docs/app/api-reference/functions/generate-metadata#metadatabase"
              rel="noreferrer noopener"
            >
              More information
            </a>
          ),
        }),
      ],
    }),
    defineField({
      name: 'logo',
      title: 'Logo',
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
      name: 'navLinks',
      title: 'Navigation Links',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            {
              name: 'label',
              title: 'Label (Localized)',
              type: 'object',
              fields: [
                {name: 'ca', type: 'string', title: 'Catalan'},
                {name: 'es', type: 'string', title: 'Spanish'},
                {name: 'en', type: 'string', title: 'English'},
              ],
            },
            {
              name: 'href',
              title: 'Href',
              type: 'string',
              validation: (rule) => rule.required(),
            },
          ],
        }),
      ],
    }),
    defineField({
      name: 'projectsPageSeo',
      title: 'SEO pàgina de projectes',
      type: 'seo',
      description: 'SEO per a les pàgines /projects i /projects/index',
    }),
    defineField({
      name: 'languages',
      title: 'Available Languages',
      type: 'array',
      of: [{type: 'string'}],
      initialValue: ['ca', 'es', 'en'],
    }),
  ],
})

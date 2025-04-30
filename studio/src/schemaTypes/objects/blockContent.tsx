import {defineArrayMember, defineType, defineField} from 'sanity'

export const blockContent = defineType({
  title: 'Block Content',
  name: 'blockContent',
  type: 'array',
  of: [
    defineArrayMember({
      type: 'block',
      marks: {
        annotations: [
          {
            name: 'link',
            type: 'object',
            title: 'Link',
            fields: [
              defineField({
                name: 'linkType',
                title: 'Link Type',
                type: 'string',
                initialValue: 'href',
                options: {
                  list: [
                    { title: 'URL', value: 'href' },
                  ],
                  layout: 'radio',
                },
              }),
              defineField({
                name: 'urlTitle',
                title: 'URL Title',
                type: 'string',
                hidden: ({ parent }) => parent?.linkType !== 'href',
              }),
              defineField({
                name: 'href',
                title: 'URL',
                type: 'url',
                hidden: ({ parent }) => parent?.linkType !== 'href',
                validation: (Rule) =>
                  Rule.custom((value, context: any) => {
                    if (context.parent?.linkType === 'href' && !value) {
                      return 'URL is required when Link Type is URL';
                    }
                    return true;
                  }),
              }),
              defineField({
                name: 'openType',
                title: 'Open Type',
                type: 'string',
                hidden: ({ parent }) => parent?.linkType !== 'href',
                options: {
                  list: [
                    { title: 'Open in new tab', value: 'newTab' },
                    { title: 'Open modal', value: 'modal' },
                  ],
                  layout: 'radio',
                },
                initialValue: 'newTab',
              }),
            ],
          },
        ],
      },
    }),
  ],
})

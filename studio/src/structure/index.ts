import {CogIcon, HomeIcon, UsersIcon} from '@sanity/icons'
import type {StructureBuilder, StructureResolver} from 'sanity/structure'
import pluralize from 'pluralize-esm'

const DISABLED_TYPES = ['home', 'settings', 'about', 'assist.instruction.context']

export const structure: StructureResolver = (S: StructureBuilder) =>
  S.list()
    .title('Website Content')
    .items([
      S.listItem()
        .title('Home')
        .child(S.document().schemaType('home').documentId('siteHome'))
        .icon(HomeIcon),
      S.divider(),
      ...S.documentTypeListItems()
        .filter((listItem: any) => !DISABLED_TYPES.includes(listItem.getId()))
        .map((listItem) => {
          return listItem.title(pluralize(listItem.getTitle() as string))
        }),

      S.listItem()
        .title('Info')
        .child(S.document().schemaType('about').documentId('siteAbout'))
        .icon(UsersIcon),
      S.listItem()
        .title('Configuració')
        .child(S.document().schemaType('settings').documentId('siteSettings'))
        .icon(CogIcon),
    ])

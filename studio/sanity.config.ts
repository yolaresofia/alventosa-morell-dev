import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { visionTool } from '@sanity/vision';
import { schemaTypes } from './src/schemaTypes';
import { structure } from './src/structure';
import { unsplashImageAsset } from 'sanity-plugin-asset-source-unsplash';
import {
  presentationTool,
  defineDocuments,
  defineLocations,
  type DocumentLocation,
} from 'sanity/presentation';
import { assist } from '@sanity/assist';
import { colorInput } from '@sanity/color-input';

const projectId = process.env.SANITY_STUDIO_PROJECT_ID || 'your-projectID';
const dataset = process.env.SANITY_STUDIO_DATASET || 'staging';

const SANITY_STUDIO_PREVIEW_URL =
  process.env.SANITY_STUDIO_PREVIEW_URL || 'http://localhost:3000';

const homeLocation = {
  title: 'Home',
  href: '/',
} satisfies DocumentLocation;

function resolveHref(documentType?: string, slug?: string): string | undefined {
  switch (documentType) {
    case 'settings':
      return '/';
    case 'project':
      return slug ? `/projects/${slug}` : undefined;
    default:
      console.warn('Invalid document type:', documentType);
      return undefined;
  }
}

export default defineConfig({
  name: 'default',
  title: 'ALVENTOSA MORELL dev studio',

  projectId,
  dataset,

  plugins: [
    presentationTool({
      previewUrl: {
        origin: SANITY_STUDIO_PREVIEW_URL,
        previewMode: {
          enable: '/api/draft-mode/enable',
        },
      },
      resolve: {
        mainDocuments: defineDocuments([
          {
            route: '/',
            filter: `_type == "settings"`,
          },
          {
            route: '/projects/:slug',
            filter: `_type == "project" && slug.current == $slug || _id == $slug`,
          },
        ]),
        locations: {
          settings: defineLocations({
            locations: [homeLocation],
            message: 'This document is used as your homepage',
            tone: 'positive',
          }),
          project: defineLocations({
            select: {
              name: 'title',
              slug: 'slug.current',
            },
            resolve: (doc) => ({
              locations: [
                {
                  title: doc?.name || 'Projecte sense títol',
                  href: resolveHref('project', doc?.slug)!,
                },
              ],
            }),
          }),
        },
      },
    }),
    structureTool({
      structure,
    }),
    unsplashImageAsset(),
    assist(),
    visionTool(),
    colorInput(),
  ],

  schema: {
    types: schemaTypes,
  },
});

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
import { vercelDeployTool } from 'sanity-plugin-vercel-deploy';
import { muxInput } from 'sanity-plugin-mux-input'; // ✅ Mux plugin added

const projectId = process.env.SANITY_STUDIO_PROJECT_ID || 'your-projectID';
const dataset = process.env.SANITY_STUDIO_DATASET || 'production';

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
    structureTool({
      structure,
    }),
    unsplashImageAsset(),
    vercelDeployTool(),
    assist(),
    colorInput(),
    muxInput(),
  ],

  schema: {
    types: schemaTypes,
  },
});

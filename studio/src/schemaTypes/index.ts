import {settings} from './singletons/settings'
import {link} from './objects/link'
import {blockContent} from './objects/blockContent'
import { about } from './singletons/about'
import { coverImage } from './objects/coverImage'
import { projectSummary } from './objects/projectSummary'
import { diptychImage } from './objects/diptychImage'
import { imageCarousel } from './objects/imageCarousel'
import { textBlock } from './objects/textBlock'
import { projectInfo } from './objects/projectInfo'
import { project } from './documents/project'
import { home } from './singletons/home'
import { monoptychImage } from './objects/monoptychImage'
import { coverVideo } from './objects/coverVideo'
import { seo } from './objects/seo'

export const schemaTypes = [
  // Singletons
  settings,
  home,
  // Objects
  seo,
  blockContent,
  link,
  about,
  coverImage,
  projectSummary,
  diptychImage,
  imageCarousel,
  textBlock,
  projectInfo,
  project,
  monoptychImage,
  coverVideo
]

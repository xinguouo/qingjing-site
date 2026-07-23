'use client'

import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'

import {apiVersion, dataset, projectId, studioBasePath} from './src/sanity/env'
import {schemaTypes} from './src/sanity/schemaTypes'
import {structure} from './src/sanity/structure'

export default defineConfig({
  name: 'default',
  title: 'Qingjing Site',
  projectId,
  dataset,
  basePath: studioBasePath,
  apiVersion,
  plugins: [structureTool({structure})],
  schema: {
    types: schemaTypes,
  },
  document: {
    newDocumentOptions: (prev) => {
      const singletonTemplateIds = new Set([
        'siteSettings',
        'homePage',
        'aboutMissionPage',
        'aboutContactPage',
        'contactPage',
        'residencyPage',
      ])

      return prev.filter((templateItem) => !singletonTemplateIds.has(templateItem.templateId))
    },
  },
})

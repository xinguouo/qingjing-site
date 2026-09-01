"use client";

import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";

import {artCategoryFallbacks} from "./src/config/artCategories";
import {
  apiVersion,
  dataset,
  projectId,
  studioBasePath,
} from "./src/sanity/env";
import { schemaTypes } from "./src/sanity/schemaTypes";
import { structure } from "./src/sanity/structure";

export default defineConfig({
  name: "default",
  title: "Qingjing Site",
  projectId,
  dataset,
  basePath: studioBasePath,
  apiVersion,
  plugins: [structureTool({ structure })],
  schema: {
    types: schemaTypes,
    templates: (prev) => [
      ...prev,
      {
        id: "artCategory-sculpture",
        title: "sculpture 分类页面标题 / Art Category Page Title",
        schemaType: "artCategory",
        value: {
          categoryType: "sculpture",
          titleZh: artCategoryFallbacks.sculpture.titleZh,
          titleEn: artCategoryFallbacks.sculpture.titleEn,
        },
      },
      {
        id: "artCategory-installation-art",
        title: "installation-art 分类页面标题 / Art Category Page Title",
        schemaType: "artCategory",
        value: {
          categoryType: "installation-art",
          titleZh: artCategoryFallbacks["installation-art"].titleZh,
          titleEn: artCategoryFallbacks["installation-art"].titleEn,
        },
      },
      {
        id: "artCategory-public-art",
        title: "public-art 分类页面标题 / Art Category Page Title",
        schemaType: "artCategory",
        value: {
          categoryType: "public-art",
          titleZh: artCategoryFallbacks["public-art"].titleZh,
          titleEn: artCategoryFallbacks["public-art"].titleEn,
        },
      },
    ],
  },
  document: {
    actions: (prev, context) => {
      if (context.schemaType === "artProject") {
        return prev;
      }

      return prev;
    },
    newDocumentOptions: (prev) => {
      const singletonTemplateIds = new Set([
        "homePage",
        "aboutMissionPage",
        "aboutContactPage",
        "contactPage",
        "residencyPage",
        "artCategory-sculpture",
        "artCategory-installation-art",
        "artCategory-public-art",
      ]);

      return prev.filter(
        (templateItem) => !singletonTemplateIds.has(templateItem.templateId),
      );
    },
  },
});

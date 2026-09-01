"use client";

import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";

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
        title: "玻璃架上艺术页面标题 / Glass Easel Art Page Title",
        schemaType: "artCategory",
        value: {
          categoryType: "sculpture",
          titleZh: "玻璃架上艺术",
          titleEn: "GLASS EASEL ART",
        },
      },
      {
        id: "artCategory-installation-art",
        title: "玻璃装置艺术页面标题 / Glass Installation Art Page Title",
        schemaType: "artCategory",
        value: {
          categoryType: "installation-art",
          titleZh: "玻璃装置艺术",
          titleEn: "GLASS INSTALLATION ART",
        },
      },
      {
        id: "artCategory-public-art",
        title: "玻璃公共艺术页面标题 / Glass Public Art Page Title",
        schemaType: "artCategory",
        value: {
          categoryType: "public-art",
          titleZh: "玻璃公共艺术",
          titleEn: "GLASS PUBLIC ART",
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

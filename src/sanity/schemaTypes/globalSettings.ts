import { defineField, defineType } from "sanity";

export const globalSettings = defineType({
  name: "globalSettings",
  title: "全局设置 / Global Settings",
  type: "document",
  fields: [
    defineField({
      name: "whiteSidebarLogo",
      title: "白色 Sidebar Logo PNG / White Sidebar Logo",
      type: "image",
      description: "用于深色主题 / Dark Theme",
      options: { hotspot: false },
    }),
    defineField({
      name: "blackSidebarLogo",
      title: "黑色 Sidebar Logo PNG / Black Sidebar Logo",
      type: "image",
      description: "用于浅色及其他明亮主题 / Light Themes",
      options: { hotspot: false },
    }),
  ],
  preview: {
    prepare: () => ({
      title: "全局设置 / Global Settings",
    }),
  },
});

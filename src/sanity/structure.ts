import {orderableDocumentListDeskItem} from '@sanity/orderable-document-list'
import type {StructureResolver} from 'sanity/structure'

export const structure: StructureResolver = (S, context) => {
  const singleton = ({
    id,
    title,
    formTitle = title,
    schemaType,
    documentId,
  }: {
    id: string
    title: string
    formTitle?: string
    schemaType: string
    documentId: string
  }) =>
    S.document()
      .id(id)
      .schemaType(schemaType)
      .documentId(documentId)
      .title(title)
      .views([S.view.form().id(`${id}Form`).title(formTitle)])

  const typedList = ({
    id,
    title,
    schemaType,
    filter,
  }: {
    id: string
    title: string
    schemaType: string
    filter?: string
  }) => {
    const list = S.documentTypeList(schemaType).id(id).title(title)
    return filter ? list.filter(filter) : list
  }

  const typedListItem = ({
    id,
    title,
    schemaType,
    filter,
  }: {
    id: string
    title: string
    schemaType: string
    filter?: string
  }) =>
    S.listItem()
      .id(id)
      .title(title)
      .schemaType(schemaType)
      .child(
        typedList({
          id: `${id}List`,
          title,
          schemaType,
          filter,
        }),
      )

  const orderableArtProjectListItem = ({
    id,
    title,
    category,
  }: {
    id: string
    title: string
    category: string
  }) =>
    orderableDocumentListDeskItem({
      type: 'artProject',
      id,
      title,
      filter: '_type == "artProject" && coalesce(category, projectType) == $category',
      params: {category},
      S,
      context,
    })

  const orderableProductListItem = ({
    id,
    title,
    schemaType,
    filter,
  }: {
    id: string
    title: string
    schemaType: string
    filter: string
  }) =>
    orderableDocumentListDeskItem({
      type: schemaType,
      id,
      title,
      filter,
      S,
      context,
    })

  return S.list()
    .id('content')
    .title('内容管理 / Content')
    .items([
      S.listItem()
        .id('siteSettings')
        .title('网站设置 / Site Settings')
        .schemaType('siteSettings')
        .child(
          singleton({
            id: 'siteSettingsDocument',
            title: '网站设置 / Site Settings',
            schemaType: 'siteSettings',
            documentId: 'siteSettings',
          }),
        ),
      S.listItem()
        .id('homePage')
        .title('首页 / Home Page')
        .schemaType('homePage')
        .child(
          singleton({
            id: 'homePageDocument',
            title: '首页 / Home Page',
            schemaType: 'homePage',
            documentId: 'homePage',
          }),
        ),
      S.listItem()
        .id('about')
        .title('关于我们 / About')
        .child(
          S.list()
            .id('aboutEntries')
            .title('关于我们 / About')
            .items([
              S.listItem()
                .id('aboutMissionVision')
                .title('使命愿景 / Mission & Vision')
                .schemaType('aboutMissionPage')
                .child(
                  singleton({
                    id: 'aboutMissionVisionDocument',
                    title: '使命愿景 / Mission & Vision',
                    schemaType: 'aboutMissionPage',
                    documentId: 'aboutMissionPage',
                  }),
                ),
              S.listItem()
                .id('aboutTeamMembers')
                .title('团队成员 / Team Members')
                .schemaType('teamPage')
                .child(
                  S.list()
                    .id('aboutTeamMembersEntries')
                    .title('团队成员 / Team Members')
                    .items([
                      S.listItem()
                        .id('aboutTeamPageTitle')
                        .title('页面标题 / Page Title')
                        .schemaType('teamPage')
                        .child(
                          singleton({
                            id: 'aboutTeamPageTitleDocument',
                            title: '团队成员 / Team Members',
                            schemaType: 'teamPage',
                            documentId: 'teamPage',
                          }),
                        ),
                      typedListItem({
                        id: 'aboutTeamMembersListItem',
                        title: '团队成员列表 / Team Member List',
                        schemaType: 'teamMember',
                      }),
                    ]),
                ),
              S.listItem()
                .id('aboutContact')
                .title('联系我们 / Contact')
                .schemaType('contactPage')
                .child(
                  singleton({
                    id: 'aboutContactDocument',
                    title: '联系我们 / Contact',
                    schemaType: 'contactPage',
                    documentId: 'contactPage',
                  }),
                ),
            ]),
        ),
      S.listItem()
        .id('residency')
        .title('驻地计划 / Residency')
        .child(
          S.list()
            .id('residencyPageEntries')
            .title('驻地计划 / Residency')
            .items([
              S.listItem()
                .id('studyMasterclassPage')
                .title('国际大师班页面 / International Masterclass Page')
                .schemaType('studyMasterclassPage')
                .child(
                  singleton({
                    id: 'studyMasterclassPageDocument',
                    title: '国际大师班页面 / International Masterclass Page',
                    schemaType: 'studyMasterclassPage',
                    documentId: 'studyMasterclassPage',
                  }),
                ),
              typedListItem({
                id: 'residencyResidentArtists',
                title: '驻地艺术家（暂不上线） / Resident Artists (Not Launched)',
                schemaType: 'artist',
                filter: '_type == "artist" && isResidentArtist == true',
              }),
              S.listItem()
                .id('residencyApplication')
                .title('驻地申请（暂不上线） / Residency Application (Not Launched)')
                .schemaType('residencyPage')
                .child(
                  singleton({
                    id: 'residencyApplicationDocument',
                    title: '驻地申请（暂不上线） / Residency Application (Not Launched)',
                    schemaType: 'residencyPage',
                    documentId: 'residencyPage',
                  }),
                ),
            ]),
        ),
      S.listItem()
        .id('study')
        .title('研学 / Study')
        .schemaType('studyProgram')
        .child(
          S.list()
            .id('studyPageEntries')
            .title('研学 / Study')
            .items([
              typedListItem({
                id: 'studyInternationalMasterclass',
                title: '国际大师班 / International Masterclass',
                schemaType: 'studyProgram',
                filter: '_type == "studyProgram" && programType == "international-masterclass"',
              }),
              typedListItem({
                id: 'studyInternationalStudy',
                title: '国际研学（暂不上线） / International Study (Not Launched)',
                schemaType: 'studyProgram',
                filter: '_type == "studyProgram" && programType == "international-study"',
              }),
            ]),
        ),
      S.listItem()
        .id('events')
        .title('活动 / Events')
        .schemaType('event')
        .child(
          S.list()
            .id('eventPageEntries')
            .title('活动 / Events')
            .items([
              S.listItem()
                .id('eventsOfflineExperience')
                .title('线下体验 / Offline Experience')
                .schemaType('offlineExperiencePage')
                .child(
                  singleton({
                    id: 'eventsOfflineExperienceDocument',
                    title: '线下体验 / Offline Experience',
                    schemaType: 'offlineExperiencePage',
                    documentId: 'offlineExperiencePage',
                  }),
                ),
              typedListItem({
                id: 'eventsOpenClass',
                title: '艺术公开课（暂不上线） / Open Class (Not Launched)',
                schemaType: 'event',
                filter: '_type == "event" && eventType == "open-class"',
              }),
              typedListItem({
                id: 'eventsActivity',
                title: '活动（暂不上线） / Activity (Not Launched)',
                schemaType: 'event',
                filter: '_type == "event" && eventType == "activity"',
              }),
            ]),
        ),
      S.listItem()
        .id('artCreation')
        .title('艺术创作 / Art Creation')
        .schemaType('artProject')
        .child(
          S.list()
            .id('artCreationPageEntries')
            .title('艺术创作 / Art Creation')
            .items([
              orderableArtProjectListItem({
                id: 'artCreationGlassArt',
                title: '玻璃艺术 / Glass Art',
                category: 'glass-art',
              }),
              orderableArtProjectListItem({
                id: 'artCreationInstallationArt',
                title: '装置艺术 / Installation Art',
                category: 'installation-art',
              }),
              orderableArtProjectListItem({
                id: 'artCreationPublicArt',
                title: '公共艺术 / Public Art',
                category: 'public-art',
              }),
              orderableArtProjectListItem({
                id: 'artCreationSculptureArt',
                title: '雕塑艺术 / Sculpture Art',
                category: 'sculpture-art',
              }),
            ]),
        ),
      S.listItem()
        .id('shop')
        .title('商店 / Shop')
        .schemaType('productCollection')
        .child(
          S.list()
            .id('shopPageEntries')
            .title('商店 / Shop')
            .items([
              orderableProductListItem({
                id: 'shopAvailableArtworkDetail',
                title: '在售艺术商品 / Available Art Goods',
                schemaType: 'productDetail',
                filter: '_type == "productDetail"',
              }),
              orderableProductListItem({
                id: 'shopArtDerivativeDetail',
                title: '艺术衍生品 / Art Derivatives',
                schemaType: 'artDerivativeDetail',
                filter: '_type == "artDerivativeDetail"',
              }),
              S.listItem()
                .id('shopArtDerivativePackaging')
                .title('包装 / Packaging')
                .schemaType('artDerivativePackagingPage')
                .child(
                  singleton({
                    id: 'shopArtDerivativePackagingDocument',
                    title: '包装 / Packaging',
                    schemaType: 'artDerivativePackagingPage',
                    documentId: 'artDerivativePackagingPage',
                  }),
                ),
              typedListItem({
                id: 'shopCulturalProductDetail',
                title: '文创品 / Cultural Products',
                schemaType: 'productCollection',
                filter: '_type == "productCollection" && category == "cultural"',
              }),
            ]),
        ),
    ])
}

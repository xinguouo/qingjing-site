import { defineQuery } from "next-sanity";

const imageFields = `
  asset,
  crop,
  hotspot,
  captionZh,
  captionEn,
  "caption": select(
    $locale == "en" && defined(captionEn) && captionEn != "" => captionEn,
    defined(captionZh) && captionZh != "" => captionZh,
    caption
  )
`;

const artworkImageItemFields = `
  _key,
  _type,
  descriptionZh,
  descriptionEn,
  "description": select(
    $locale == "en" && defined(descriptionEn) && descriptionEn != "" => descriptionEn,
    defined(descriptionZh) && descriptionZh != "" => descriptionZh,
    defined(description) && description != "" => description,
    $locale == "en" && defined(image.captionEn) && image.captionEn != "" => image.captionEn,
    defined(image.captionZh) && image.captionZh != "" => image.captionZh,
    defined(image.caption) && image.caption != "" => image.caption,
    $locale == "en" && defined(captionEn) && captionEn != "" => captionEn,
    defined(captionZh) && captionZh != "" => captionZh,
    caption
  ),
  "image": select(
    defined(image.asset) => image{${imageFields}},
    defined(asset) => {${imageFields}}
  )
`;

const localizedText = (enField: string, zhField: string) =>
  `select($locale == "en" && defined(${enField}) && ${enField} != "" => ${enField}, ${zhField})`;

const shopTaxonomyFields = `
  craftCategory,
  "craftCategories": select(
    defined(craftCategory[0]) => craftCategory,
    defined(craftCategory) && craftCategory != "" => [craftCategory],
    []
  ),
  "series": series->{
    _id,
    titleZh,
    titleEn,
    "title": ${localizedText("titleEn", "titleZh")},
    "slug": slug.current,
    order
  },
  "seriesBranch": seriesBranch->{
    _id,
    titleZh,
    titleEn,
    "title": ${localizedText("titleEn", "titleZh")},
    "slug": slug.current,
    "seriesId": series._ref,
    order
  },
  "seriesId": series._ref,
  "seriesSlug": series->slug.current,
  "seriesTitle": select(
    $locale == "en" && defined(series->titleEn) && series->titleEn != "" => series->titleEn,
    series->titleZh
  ),
  "seriesBranchId": seriesBranch._ref,
  "seriesBranchSlug": seriesBranch->slug.current,
  "seriesBranchTitle": select(
    $locale == "en" && defined(seriesBranch->titleEn) && seriesBranch->titleEn != "" => seriesBranch->titleEn,
    seriesBranch->titleZh
  )
`;

const publishedDocumentFilter = `
  !(_id in path("drafts.**")) &&
  !(_id in path("versions.**"))
`;

const publishedProductDetailFilter = `
  _type == "productDetail" &&
  defined(slug.current) &&
  ${publishedDocumentFilter}
`;

const canonicalProductDetailFilter = `
  ${publishedProductDetailFilter} &&
  !defined(*[
    ${publishedProductDetailFilter} &&
    (
      slug.current == ^.slug.current ||
      (
        defined(basicInfo.productNumber) &&
        basicInfo.productNumber != "" &&
        basicInfo.productNumber == ^.basicInfo.productNumber
      )
    ) &&
    _updatedAt > ^._updatedAt
  ][0])
`;

const artworkVideoItemFields = `
  _key,
  videoFile{
    asset->{
      _id,
      url,
      mimeType,
      originalFilename
    }
  },
  captionZh,
  captionEn,
  "caption": ${localizedText("captionEn", "captionZh")},
  autoplay,
  muted,
  loop
`;

const productVideoFields = `
  asset->{
    _id,
    url,
    mimeType,
    originalFilename
  }
`;

const siteSettingsFields = `
  siteNameZh,
  siteNameEn,
  "siteName": ${localizedText("siteNameEn", "siteNameZh")},
  logo{${imageFields}},
  email,
  phone,
  addressZh,
  addressEn,
  "address": ${localizedText("addressEn", "addressZh")},
  footerTextZh,
  footerTextEn,
  "footerText": ${localizedText("footerTextEn", "footerTextZh")},
  socialLinks[]{
    _key,
    platform,
    label,
    url
  }
`;

const studyProgramCardFields = `
  _id,
  titleZh,
  titleEn,
  "title": ${localizedText("titleEn", "titleZh")},
  "slug": slug.current,
  programType,
  courseSection,
  "coverImage": select(defined(heroImage.asset) => heroImage{${imageFields}}, coverImage{${imageFields}}),
  "courseIntro": ${localizedText("courseIntroEn", "courseIntroZh")},
  "description": ${localizedText("courseIntroEn", "courseIntroZh")},
  "shortDescription": select(
    $locale == "en" && defined(courseIntroEn) && courseIntroEn != "" => courseIntroEn,
    courseIntroZh
  ),
  "academicHost": ${localizedText("academicHostEn", "academicHostZh")},
  "academicSupport": ${localizedText("academicHostEn", "academicHostZh")},
  order
`;

const eventCardFields = `
  _id,
  titleZh,
  titleEn,
  "title": ${localizedText("titleEn", "titleZh")},
  "slug": slug.current,
  "eventType": select(eventType == "event" => "activity", eventType),
  coverImage{${imageFields}},
  posterImage{${imageFields}},
  courseIntroZh,
  courseIntroEn,
  "courseIntro": ${localizedText("courseIntroEn", "courseIntroZh")},
  facultyZh,
  facultyEn,
  "faculty": ${localizedText("facultyEn", "facultyZh")},
  contentZh,
  contentEn,
  "content": ${localizedText("contentEn", "contentZh")},
  order
`;

const offlineWorkshopCardFields = `
  _id,
  titleZh,
  titleEn,
  "title": ${localizedText("titleEn", "titleZh")},
  "slug": slug.current,
  coverImage{${imageFields}},
  shortDescriptionZh,
  shortDescriptionEn,
  "shortDescription": ${localizedText("shortDescriptionEn", "shortDescriptionZh")},
  category,
  tagZh,
  tagEn,
  "tag": ${localizedText("tagEn", "tagZh")},
  suitableAudienceZh,
  suitableAudienceEn,
  "suitableAudience": ${localizedText("suitableAudienceEn", "suitableAudienceZh")},
  scheduleZh,
  scheduleEn,
  "schedule": ${localizedText("scheduleEn", "scheduleZh")},
  price,
  contact,
  order
`;

const experienceCourseFields = `
  _id,
  titleZh,
  titleEn,
  "title": ${localizedText("titleEn", "titleZh")},
  "slug": slug.current,
  heroImage{${imageFields}},
  coverImage{${imageFields}},
  galleryImages[]{${imageFields}},
  descriptionZh,
  descriptionEn,
  "description": ${localizedText("descriptionEn", "descriptionZh")},
  "shortDescription": ${localizedText("descriptionEn", "descriptionZh")},
  teacher,
  academicSupport,
  "academicHost": coalesce(academicSupport, teacher),
  category,
  suitableAudience,
  schedule,
  location,
  contact,
  order
`;

const offlineExperiencePageFields = `
  pageTitleZh,
  pageTitleEn,
  "pageTitle": ${localizedText("pageTitleEn", "pageTitleZh")},
  bannerTitleZh,
  bannerTitleEn,
  "bannerTitle": ${localizedText("bannerTitleEn", "bannerTitleZh")},
  bannerImage{${imageFields}},
  courses[]{
    _key,
    titleZh,
    titleEn,
    "title": ${localizedText("titleEn", "titleZh")},
    coverImage{${imageFields}},
    descriptionZh,
    descriptionEn,
    "description": ${localizedText("descriptionEn", "descriptionZh")},
    "shortDescription": ${localizedText("descriptionEn", "descriptionZh")},
    supportTeacher,
    "academicHost": supportTeacher,
    "academicSupport": supportTeacher
  },
  pastReviewItems[]{
    _key,
    image{${imageFields}},
    titleZh,
    titleEn,
    "title": ${localizedText("titleEn", "titleZh")},
    year,
    descriptionZh,
    descriptionEn,
    "description": ${localizedText("descriptionEn", "descriptionZh")}
  }
`;

const artWorkCardFields = `
  _id,
  "_type": _type,
  titleZh,
  titleEn,
  "title": ${localizedText("titleEn", "titleZh")},
  "slug": slug.current,
  "category": coalesce(category, workType, projectType),
  "workType": coalesce(category, workType, projectType),
  "coverImage": coalesce(coverImage{${imageFields}}, galleryImages[0].image{${imageFields}}, galleryImages[0]{${imageFields}}, images[0].image{${imageFields}}, images[0]{${imageFields}}),
  "images": coalesce(galleryImages[]{${artworkImageItemFields}}, images[]{${artworkImageItemFields}}),
  "artworkVideos": artworkVideos[]{${artworkVideoItemFields}},
  galleryImages[]{${imageFields}},
  artist,
  year,
  descriptionZh,
  descriptionEn,
  "description": ${localizedText("descriptionEn", "descriptionZh")},
  "size": coalesce(size, dimensions),
  dimensions,
  quantity,
  price,
  sourceUrl,
  importSource,
  needsReview,
  importNotes,
  "orderRank": _orderRank,
  order
`;

const publishedArtWorkFilter = `
  !(
    needsReview == true &&
    importSource == "old-qingjing-site" &&
    defined(sourceUrl)
  )
`;

const artCategoryFields = `
  _id,
  titleZh,
  titleEn,
  "title": ${localizedText("titleEn", "titleZh")},
  categoryType,
  artworks[]{
    _key,
    titleZh,
    titleEn,
    "title": ${localizedText("titleEn", "titleZh")},
    "slug": slug.current,
    images[]{${imageFields}},
    "coverImage": images[0]{${imageFields}},
    dimensions,
    descriptionZh,
    descriptionEn,
    "description": ${localizedText("descriptionEn", "descriptionZh")}
  },
  order
`;

const homeArtWorkCardFields = `
  _id,
  "_type": _type,
  titleZh,
  titleEn,
  "title": ${localizedText("titleEn", "titleZh")},
  "slug": slug.current,
  "category": coalesce(category, workType, projectType),
  "workType": coalesce(category, workType, projectType),
  "coverImage": coalesce(coverImage{${imageFields}}, galleryImages[0].image{${imageFields}}, galleryImages[0]{${imageFields}}, images[0].image{${imageFields}}, images[0]{${imageFields}}),
  "size": coalesce(size, dimensions),
  dimensions
`;

const productCardFields = `
  _id,
  titleZh,
  titleEn,
  "title": ${localizedText("titleEn", "titleZh")},
  "slug": slug.current,
  "productType": select(
    productType in ["available-artworks", "artworks"] => "artworks",
    productType in ["art-derivatives", "art-merchandise"] => "derivatives",
    productType == "cultural-products" => "cultural",
    productType
  ),
  productNumber,
  derivativeCategory,
  artworkCategory,
  "subcategory": derivativeCategory,
  coverImage{${imageFields}},
  images[]{${imageFields}},
  galleryImages[]{${imageFields}},
  video{${productVideoFields}},
  price,
  "size": coalesce(size, dimensions),
  dimensions,
  material,
  descriptionZh,
  descriptionEn,
  "description": ${localizedText("descriptionEn", "descriptionZh")},
  stockStatus,
  sourceUrl,
  importSource,
  needsReview,
  importNotes,
  ${shopTaxonomyFields},
  "orderRank": _orderRank,
  order
`;

const homeProductReferenceFields = `
  _id,
  "_type": _type,
  "titleZh": select(
    _type == "productDetail" => basicInfo.titleZh,
    titleZh
  ),
  "titleEn": select(
    _type == "productDetail" => basicInfo.titleEn,
    titleEn
  ),
  "title": select(
    _type == "productDetail" => ${localizedText("basicInfo.titleEn", "basicInfo.titleZh")},
    ${localizedText("titleEn", "titleZh")}
  ),
  "slug": slug.current,
  "productType": select(
    _type == "productDetail" => "artworks",
    _type == "artworkProduct" => "artworks",
    _type == "artDerivativeDetail" => "derivatives",
    _type == "derivativeProduct" => "derivatives",
    _type == "culturalProduct" => "cultural",
    _type == "productCollection" && category == "artwork" => "artworks",
    _type == "productCollection" && category == "derivative" => "derivatives",
    _type == "productCollection" && category == "cultural" => "cultural",
    productType in ["available-artworks", "artworks"] => "artworks",
    productType in ["derivatives", "art-derivatives", "art-merchandise"] => "derivatives",
    productType in ["cultural", "cultural-products"] => "cultural",
    productType
  ),
  "derivativeCategory": select(
    _type == "productCollection" => subcategory,
    derivativeCategory
  ),
  "productNumber": select(
    _type == "productDetail" => basicInfo.productNumber,
    productNumber
  ),
  "artworkCategory": select(
    _type == "productDetail" => basicInfo.category,
    _type == "productCollection" => artworkCategory,
    _type == "artworkProduct" => artworkCategory,
    artworkCategory
  ),
  "subcategory": select(
    _type == "productCollection" => subcategory,
    derivativeCategory
  ),
  "coverImage": select(
    _type == "productDetail" => coalesce(media.mainImage{${imageFields}}, media.galleryImages[0]{${imageFields}}),
    _type == "artDerivativeDetail" => coalesce(mainImage{${imageFields}}, galleryImages[0]{${imageFields}}),
    _type == "artworkProduct" => images[0]{${imageFields}},
    _type == "culturalProduct" => image{${imageFields}},
    coverImage{${imageFields}}
  ),
  "images": select(
    _type == "artworkProduct" => images[]{${imageFields}},
    images[]{${imageFields}}
  ),
  "galleryImages": select(
    _type == "productDetail" => media.galleryImages[]{${imageFields}},
    _type == "derivativeProduct" => gallery[]{${imageFields}},
    galleryImages[]{${imageFields}}
  ),
  "video": select(
    _type == "productDetail" => media.video{${productVideoFields}},
    video{${productVideoFields}}
  ),
  "price": select(
    _type == "productDetail" => commerce.price,
    price
  ),
  "size": coalesce(size, dimensions, productInfo.dimensions),
  dimensions,
  material,
  descriptionZh,
  descriptionEn,
  "description": select(
    _type == "productDetail" => ${localizedText("productInfo.descriptionEn", "productInfo.descriptionZh")},
    _type == "derivativeProduct" => ${localizedText("descriptionEn", "descriptionZh")},
    ${localizedText("descriptionEn", "descriptionZh")}
  ),
  stockStatus,
  sourceUrl,
  importSource,
  needsReview,
  importNotes,
  ${shopTaxonomyFields},
  "orderRank": _orderRank,
  order
`;

const artworkProductFields = `
  _id,
  "category": "artwork",
  "productType": "artworks",
  titleZh,
  titleEn,
  "title": ${localizedText("titleEn", "titleZh")},
  "slug": slug.current,
  productNumber,
  artworkCategory,
  images[]{${imageFields}},
  "coverImage": images[0]{${imageFields}},
  video{${productVideoFields}},
  dimensions,
  quantity,
  descriptionZh,
  descriptionEn,
  "description": ${localizedText("descriptionEn", "descriptionZh")},
  ${shopTaxonomyFields},
  "orderRank": _orderRank,
  order
`;

const derivativeProductFields = `
  _id,
  titleZh,
  titleEn,
  "title": ${localizedText("titleEn", "titleZh")},
  "slug": slug.current,
  coverImage{${imageFields}},
  gallery[]{${imageFields}},
  video{${productVideoFields}},
  descriptionZh,
  descriptionEn,
  "description": ${localizedText("descriptionEn", "descriptionZh")},
  specificationZh,
  specificationEn,
  "specification": ${localizedText("specificationEn", "specificationZh")},
  price,
  sourceUrl,
  importSource,
  needsReview,
  importNotes,
  ${shopTaxonomyFields},
  order
`;

const culturalProductFields = `
  _id,
  titleZh,
  titleEn,
  "title": ${localizedText("titleEn", "titleZh")},
  "slug": slug.current,
  image{${imageFields}},
  category,
  order
`;

const productCollectionFields = `
  _id,
  titleZh,
  titleEn,
  "title": ${localizedText("titleEn", "titleZh")},
  "slug": slug.current,
  category,
  productNumber,
  artworkCategory,
  "productType": select(
    category == "artwork" => "artworks",
    category == "derivative" => "derivatives",
    category
  ),
  subcategory,
  coverImage{${imageFields}},
  galleryImages[]{${imageFields}},
  video{${productVideoFields}},
  descriptionZh,
  descriptionEn,
  "description": ${localizedText("descriptionEn", "descriptionZh")},
  price,
  status,
  needsReview,
  ${shopTaxonomyFields},
  "orderRank": _orderRank,
  order
`;

const productDetailFields = `
  _id,
  "slug": slug.current,
  basicInfo{
    category,
    productNumber,
    titleZh,
    titleEn,
    "title": ${localizedText("titleEn", "titleZh")}
  },
  productInfo{
    dimensions,
    material,
    descriptionZh,
    descriptionEn,
    "description": ${localizedText("descriptionEn", "descriptionZh")}
  },
  commerce{
    price
  },
  media{
    mainImage{${imageFields}},
    galleryImages[]{${imageFields}},
    video{${productVideoFields}}
  },
  ${shopTaxonomyFields},
  relatedProducts[]->{
    _id,
    "slug": slug.current,
    basicInfo{
      category,
      productNumber,
      titleZh,
      titleEn,
      "title": ${localizedText("titleEn", "titleZh")}
    },
    commerce{
      price
    },
    media{
      mainImage{${imageFields}},
      galleryImages[]{${imageFields}}
    },
    ${shopTaxonomyFields}
  },
  "orderRank": _orderRank,
  order
`;

const artDerivativeDetailFields = `
  _id,
  titleZh,
  titleEn,
  "title": ${localizedText("titleEn", "titleZh")},
  "slug": slug.current,
  category,
  dimensions,
  descriptionZh,
  descriptionEn,
  "description": ${localizedText("descriptionEn", "descriptionZh")},
  mainImage{${imageFields}},
  galleryImages[]{${imageFields}},
  packagingImages[]{${imageFields}},
  video{${productVideoFields}},
  ${shopTaxonomyFields},
  "orderRank": _orderRank,
  order
`;

const artDerivativeDetailCardFields = `
  _id,
  titleZh,
  titleEn,
  "title": ${localizedText("titleEn", "titleZh")},
  "slug": slug.current,
  "productType": "derivatives",
  "category": "derivative",
  "subcategory": select(
    category == "器物" => "vessel",
    category == "肖物" => "wearable",
    category == "玩物" => "toy",
    category == "饰物" => "ornament",
    category == "境物" => "object",
    category == "包装" => "packaging",
    category
  ),
  "derivativeCategory": select(
    category == "器物" => "vessel",
    category == "肖物" => "wearable",
    category == "玩物" => "toy",
    category == "饰物" => "ornament",
    category == "境物" => "object",
    category == "包装" => "packaging",
    category
  ),
  "coverImage": select(defined(mainImage.asset) => mainImage{${imageFields}}, galleryImages[0]{${imageFields}}),
  galleryImages[]{${imageFields}},
  dimensions,
  "size": dimensions,
  descriptionZh,
  descriptionEn,
  "description": ${localizedText("descriptionEn", "descriptionZh")},
  ${shopTaxonomyFields},
  "orderRank": _orderRank,
  order
`;

const artDerivativePackagingPageFields = `
  _id,
  titleZh,
  titleEn,
  "title": ${localizedText("titleEn", "titleZh")},
  descriptionZh,
  descriptionEn,
  "description": ${localizedText("descriptionEn", "descriptionZh")},
  images[]{${imageFields}}
`;

const artistFields = `
  _id,
  nameZh,
  nameEn,
  "name": ${localizedText("nameEn", "nameZh")},
  "slug": slug.current,
  detailTitleZh,
  detailTitleEn,
  "detailPageTitleZh": detailTitleZh,
  "detailPageTitleEn": detailTitleEn,
  titleZh,
  titleEn,
  "title": ${localizedText("titleEn", "titleZh")},
  "profileTitle": ${localizedText("titleEn", "titleZh")},
  bioZh,
  bioEn,
  "bio": ${localizedText("bioEn", "bioZh")},
  portrait{${imageFields}},
  educationExperienceZh,
  educationExperienceEn,
  "educationExperience": ${localizedText("educationExperienceEn", "educationExperienceZh")},
  honorsZh,
  honorsEn,
  "honors": ${localizedText("honorsEn", "honorsZh")},
  "honorsCollections": ${localizedText("honorsEn", "honorsZh")},
  publicationsZh,
  publicationsEn,
  "publications": ${localizedText("publicationsEn", "publicationsZh")},
  exhibitionsZh,
  exhibitionsEn,
  "exhibitions": ${localizedText("exhibitionsEn", "exhibitionsZh")},
  "isTeamArtist": coalesce(isTeamArtist, isTeamMember, false),
  isResidentArtist,
  order
`;

const teamMemberDetailFields = `
  _id,
  nameZh,
  nameEn,
  "name": ${localizedText("nameEn", "nameZh")},
  "slug": slug.current,
  detailPageTitleZh,
  detailPageTitleEn,
  roleZh,
  roleEn,
  "role": ${localizedText("roleEn", "roleZh")},
  "profileTitle": ${localizedText("roleEn", "roleZh")},
  genderZh,
  genderEn,
  "gender": ${localizedText("genderEn", "genderZh")},
  birthDateTextZh,
  birthDateTextEn,
  "birthDateText": ${localizedText("birthDateTextEn", "birthDateTextZh")},
  "title": ${localizedText("roleEn", "roleZh")},
  shortBioZh,
  shortBioEn,
  detailBioZh,
  detailBioEn,
  bioZh,
  bioEn,
  "bio": select(
    $locale == "en" && defined(bioEn) && bioEn != "" => bioEn,
    defined(bioZh) && bioZh != "" => bioZh,
    $locale == "en" && defined(detailBioEn) && detailBioEn != "" => detailBioEn,
    defined(detailBioZh) && detailBioZh != "" => detailBioZh,
    $locale == "en" && defined(shortBioEn) && shortBioEn != "" => shortBioEn,
    shortBioZh
  ),
  portrait{${imageFields}},
  educationExperienceZh,
  educationExperienceEn,
  "educationExperience": ${localizedText("educationExperienceEn", "educationExperienceZh")},
  honorsCollectionsZh,
  honorsCollectionsEn,
  "honorsCollections": select(
    $locale == "en" && defined(honorsCollectionsEn) && honorsCollectionsEn != "" => honorsCollectionsEn,
    defined(honorsCollectionsZh) && honorsCollectionsZh != "" => honorsCollectionsZh,
    $locale == "en" && defined(honorsEn) && honorsEn != "" => honorsEn,
    honorsZh
  ),
  honorsZh,
  honorsEn,
  "honors": select(
    $locale == "en" && defined(honorsCollectionsEn) && honorsCollectionsEn != "" => honorsCollectionsEn,
    defined(honorsCollectionsZh) && honorsCollectionsZh != "" => honorsCollectionsZh,
    $locale == "en" && defined(honorsEn) && honorsEn != "" => honorsEn,
    honorsZh
  ),
  researchProjectsZh,
  researchProjectsEn,
  "researchProjects": ${localizedText("researchProjectsEn", "researchProjectsZh")},
  writingsZh,
  writingsEn,
  "writings": ${localizedText("writingsEn", "writingsZh")},
  publicationsZh,
  publicationsEn,
  "publications": ${localizedText("publicationsEn", "publicationsZh")},
  exhibitionsZh,
  exhibitionsEn,
  "exhibitions": ${localizedText("exhibitionsEn", "exhibitionsZh")},
  galleryImages[]{${imageFields}},
  isFeatured,
  order
`;

const aboutMissionPageTitleZh =
  'coalesce(*[_type == "aboutMissionPage" && _id == "aboutMissionPage"][0].pageTitleZh, *[_type == "aboutMissionPage" && _id == "aboutMissionPage"][0].titleZh)';
const aboutMissionPageTitleEn =
  'coalesce(*[_type == "aboutMissionPage" && _id == "aboutMissionPage"][0].pageTitleEn, *[_type == "aboutMissionPage" && _id == "aboutMissionPage"][0].titleEn)';
const aboutMissionBodyZh =
  '*[_type == "aboutMissionPage" && _id == "aboutMissionPage"][0].bodyZh';
const aboutMissionBodyEn =
  '*[_type == "aboutMissionPage" && _id == "aboutMissionPage"][0].bodyEn';
const teamPageTitleZh =
  'coalesce(*[_type == "teamPage" && _id == "teamPage"][0].pageTitleZh, *[_type == "teamPage" && _id == "teamPage"][0].titleZh)';
const teamPageTitleEn =
  'coalesce(*[_type == "teamPage" && _id == "teamPage"][0].pageTitleEn, *[_type == "teamPage" && _id == "teamPage"][0].titleEn)';

export const siteSettingsQuery = defineQuery(`*[
  _type == "siteSettings" &&
  _id == "siteSettings"
][0]{
  ${siteSettingsFields}
}`);

export const homePageQuery = defineQuery(`*[
  _type == "homePage" &&
  _id == "homePage" &&
  !(_id in path("drafts.**"))
][0]{
  heroTitleZh,
  heroTitleEn,
  "heroTitle": ${localizedText("heroTitleEn", "heroTitleZh")},
  heroSubtitleZh,
  heroSubtitleEn,
  "heroSubtitle": ${localizedText("heroSubtitleEn", "heroSubtitleZh")},
  heroImage{${imageFields}},
  heroImages[]{
    ${imageFields},
    alt,
    titleLogoWhite{${imageFields}},
    titleLogoBlack{${imageFields}},
    titleLogo{${imageFields}},
    titleColorMode
  },
  introTitleZh,
  introTitleEn,
  "introTitle": ${localizedText("introTitleEn", "introTitleZh")},
  introTextZh,
  introTextEn,
  "introText": ${localizedText("introTextEn", "introTextZh")},
  quickEntries[]{
    _key,
    titleZh,
    titleEn,
    "title": ${localizedText("titleEn", "titleZh")},
    descriptionZh,
    descriptionEn,
    "description": ${localizedText("descriptionEn", "descriptionZh")},
    href
  },
  featuredStudyProgramsTitleZh,
  featuredStudyProgramsTitleEn,
  "featuredStudyProgramsTitle": ${localizedText("featuredStudyProgramsTitleEn", "featuredStudyProgramsTitleZh")},
  featuredStudyPrograms[]->{${studyProgramCardFields}},
  featuredEventsTitleZh,
  featuredEventsTitleEn,
  "featuredEventsTitle": ${localizedText("featuredEventsTitleEn", "featuredEventsTitleZh")},
  featuredEvents[]->{${eventCardFields}},
  featuredPastEventsTitleZh,
  featuredPastEventsTitleEn,
  "featuredPastEventsTitle": ${localizedText("featuredPastEventsTitleEn", "featuredPastEventsTitleZh")},
  featuredPastEvents[]->{${eventCardFields}},
  pastReviewItems[]{
    _key,
    image{${imageFields}},
    titleZh,
    titleEn,
    "title": ${localizedText("titleEn", "titleZh")},
    year,
    descriptionZh,
    descriptionEn,
    "description": ${localizedText("descriptionEn", "descriptionZh")}
  },
  featuredArtWorksTitleZh,
  featuredArtWorksTitleEn,
  "featuredArtWorksTitle": ${localizedText("featuredArtWorksTitleEn", "featuredArtWorksTitleZh")},
  featuredArtWorks[]->{${homeArtWorkCardFields}},
  featuredProducts[]->{${homeProductReferenceFields}}
}`);

export const aboutMissionPageQuery = defineQuery(`{
  "pageTitleZh": ${aboutMissionPageTitleZh},
  "pageTitleEn": ${aboutMissionPageTitleEn},
  "bodyZh": ${aboutMissionBodyZh},
  "bodyEn": ${aboutMissionBodyEn},
  "body": select(
    $locale == "en" && defined(${aboutMissionBodyEn}) && ${aboutMissionBodyEn} != "" => ${aboutMissionBodyEn},
    ${aboutMissionBodyZh}
  ),
  "image": *[_type == "aboutMissionPage" && _id == "aboutMissionPage"][0].image{${imageFields}}
}`);

export const contactPageQuery = defineQuery(`{
  "pageTitleZh": coalesce(*[_type == "contactPage" && _id == "contactPage"][0].pageTitleZh, *[_type == "contactPage" && _id == "contactPage"][0].titleZh),
  "pageTitleEn": coalesce(*[_type == "contactPage" && _id == "contactPage"][0].pageTitleEn, *[_type == "contactPage" && _id == "contactPage"][0].titleEn),
  "address": select(
    defined(*[_type == "contactPage" && _id == "contactPage"][0].address) =>
      *[_type == "contactPage" && _id == "contactPage"][0].address{
        titleZh,
        titleEn,
        "title": ${localizedText("titleEn", "titleZh")},
        contentZh,
        contentEn,
        "content": ${localizedText("contentEn", "contentZh")},
        mapImage{${imageFields}}
      },
    null
  ),
  "phones": select(
    count(coalesce(*[_type == "contactPage" && _id == "contactPage"][0].phones, [])) > 0 =>
      *[_type == "contactPage" && _id == "contactPage"][0].phones[]{
        _key,
        numberZh,
        numberEn,
        "number": ${localizedText("numberEn", "numberZh")}
      },
    []
  ),
  "emails": select(
    count(coalesce(*[_type == "contactPage" && _id == "contactPage"][0].emails, [])) > 0 =>
      *[_type == "contactPage" && _id == "contactPage"][0].emails[]{
        _key,
        email
      },
    []
  ),
  "openingHoursZh": *[_type == "contactPage" && _id == "contactPage"][0].openingHoursZh,
  "openingHoursEn": *[_type == "contactPage" && _id == "contactPage"][0].openingHoursEn,
  "openingHours": select(
    $locale == "en" &&
      defined(*[_type == "contactPage" && _id == "contactPage"][0].openingHoursEn) &&
      *[_type == "contactPage" && _id == "contactPage"][0].openingHoursEn != "" =>
        *[_type == "contactPage" && _id == "contactPage"][0].openingHoursEn,
    *[_type == "contactPage" && _id == "contactPage"][0].openingHoursZh
  )
}`);

export const teamPageQuery = defineQuery(`{
  "pageTitleZh": ${teamPageTitleZh},
  "pageTitleEn": ${teamPageTitleEn}
}`);

export const teamMembersQuery =
  defineQuery(`*[_type == "teamMember"] | order(order asc) {
  _id,
  nameZh,
  nameEn,
  "name": ${localizedText("nameEn", "nameZh")},
  "slug": slug.current,
  roleZh,
  roleEn,
  "role": ${localizedText("roleEn", "roleZh")},
  shortBioZh,
  shortBioEn,
  bioZh,
  bioEn,
  "bio": select(
    $locale == "en" && defined(shortBioEn) && shortBioEn != "" => shortBioEn,
    defined(shortBioZh) && shortBioZh != "" => shortBioZh,
    $locale == "en" && defined(bioEn) && bioEn != "" => bioEn,
    bioZh
  ),
  portrait{${imageFields}},
  linkedArtist->{_id, nameZh, nameEn, "name": ${localizedText("nameEn", "nameZh")}, "slug": slug.current},
  order
}`);

export const teamMemberBySlugQuery = defineQuery(`*[
  _type == "teamMember" &&
  slug.current == $slug
][0]{
  ${teamMemberDetailFields}
}`);

export const artistsQuery =
  defineQuery(`*[_type == "artist"] | order(order asc) {
  ${artistFields}
}`);

export const teamArtistsQuery = defineQuery(`*[
  _type == "artist" &&
  coalesce(isTeamArtist, isTeamMember, false) == true
] | order(order asc) {
  ${artistFields}
}`);

export const residentArtistsQuery = defineQuery(`*[
  _type == "artist" &&
  isResidentArtist == true
] | order(order asc) {
  ${artistFields}
}`);

export const artistBySlugQuery = defineQuery(`*[
  _type == "artist" &&
  slug.current == $slug
][0]{
  ${artistFields}
}`);

export const residencyPageQuery = defineQuery(`*[_type == "residencyPage"][0]{
  titleZh,
  titleEn,
  "title": ${localizedText("titleEn", "titleZh")},
  introZh,
  introEn,
  "intro": ${localizedText("introEn", "introZh")},
  coverImage{${imageFields}},
  spaceTitleZh,
  spaceTitleEn,
  "spaceTitle": ${localizedText("spaceTitleEn", "spaceTitleZh")},
  spaceDescriptionZh,
  spaceDescriptionEn,
  "spaceDescription": ${localizedText("spaceDescriptionEn", "spaceDescriptionZh")},
  spaceImages[]{${imageFields}},
  applicationRequirementsZh,
  applicationRequirementsEn,
  "applicationRequirements": ${localizedText("applicationRequirementsEn", "applicationRequirementsZh")},
  feesAndRulesZh,
  feesAndRulesEn,
  "feesAndRules": ${localizedText("feesAndRulesEn", "feesAndRulesZh")},
  additionalServicesZh,
  additionalServicesEn,
  "additionalServices": ${localizedText("additionalServicesEn", "additionalServicesZh")}
}`);

export const studyProgramsQuery =
  defineQuery(`*[_type == "studyProgram"] | order(order asc) {
  ${studyProgramCardFields}
}`);

export const studyProgramsByTypeQuery = defineQuery(`*[
  _type == "studyProgram" &&
  programType == $programType
] | order(order asc) {
  ${studyProgramCardFields}
}`);

export const internationalMasterclassProgramsQuery = defineQuery(`*[
  _type == "studyProgram" &&
  programType == "international-masterclass"
] | order(order asc) {
  ${studyProgramCardFields}
}`);

export const studyMasterclassPageQuery = defineQuery(`*[
  _type == "studyMasterclassPage" &&
  _id == "studyMasterclassPage"
][0]{
  pastReviewTitleZh,
  pastReviewTitleEn,
  "pastReviewTitle": ${localizedText("pastReviewTitleEn", "pastReviewTitleZh")},
  pastReviewItems[]{
    _key,
    image{${imageFields}},
    titleZh,
    titleEn,
    "title": ${localizedText("titleEn", "titleZh")},
    year,
    descriptionZh,
    descriptionEn,
    "description": ${localizedText("descriptionEn", "descriptionZh")}
  }
}`);

export const internationalStudyProgramsQuery = defineQuery(`*[
  _type == "studyProgram" &&
  programType == "international-study"
] | order(order asc) {
  ${studyProgramCardFields}
}`);

export const studyProgramBySlugQuery = defineQuery(`*[
  _type == "studyProgram" &&
  slug.current == $slug
][0]{
  ${studyProgramCardFields},
  heroImage{${imageFields}},
  "courseIntro": ${localizedText("courseIntroEn", "courseIntroZh")},
  "targetAudience": ${localizedText("targetAudienceEn", "targetAudienceZh")},
  "academicAffairs": ${localizedText("academicAffairsEn", "academicAffairsZh")},
  "accommodation": ${localizedText("accommodationEn", "accommodationZh")},
  courseModules[]{
    _key,
    "number": moduleNumber,
    "title": ${localizedText("moduleTitleEn", "moduleTitleZh")},
    "description": ${localizedText("moduleContentEn", "moduleContentZh")},
    "images": moduleImages[]{${imageFields}}
  },
  "academicHost": ${localizedText("academicHostEn", "academicHostZh")},
  "academicSupport": ${localizedText("academicHostEn", "academicHostZh")},
  "teacherTeam": ${localizedText("teacherTeamEn", "teacherTeamZh")},
  "certificate": ${localizedText("certificateEn", "certificateZh")},
  "registrationPayment": ${localizedText("registrationPaymentEn", "registrationPaymentZh")},
  "contactInfo": ${localizedText("contactInfoEn", "contactInfoZh")},
  "relatedCourses": relatedCourses[]->{
    ${studyProgramCardFields}
  }
}`);

export const eventsQuery = defineQuery(`*[_type == "event"] | order(order asc) {
  ${eventCardFields}
}`);

export const eventsByTypeQuery = defineQuery(`*[
  _type == "event" &&
  (
    eventType == $eventType ||
    ($eventType == "activity" && eventType == "event")
  )
] | order(order asc) {
  ${eventCardFields}
}`);

export const offlineExperienceEventsQuery = defineQuery(`*[
  _type == "event" &&
  eventType == "offline-experience"
] | order(order asc) {
  ${eventCardFields}
}`);

export const openClassEventsQuery = defineQuery(`*[
  _type == "event" &&
  eventType == "open-class"
] | order(order asc) {
  ${eventCardFields}
}`);

export const activityEventsQuery = defineQuery(`*[
  _type == "event" &&
  (eventType == "activity" || eventType == "event")
] | order(order asc) {
  ${eventCardFields}
}`);

export const featuredEventsQuery = defineQuery(`*[
  _type == "event" &&
  isFeatured == true
] | order(order asc) {
  ${eventCardFields}
}`);

export const eventBySlugQuery = defineQuery(`*[
  _type == "event" &&
  slug.current == $slug
][0]{
  ${eventCardFields},
  teachingSpaceZh,
  teachingSpaceEn,
  "teachingSpace": ${localizedText("teachingSpaceEn", "teachingSpaceZh")},
  courseIntroZh,
  courseIntroEn,
  "courseIntro": ${localizedText("courseIntroEn", "courseIntroZh")},
  feesZh,
  feesEn,
  "fees": ${localizedText("feesEn", "feesZh")},
  facultyZh,
  facultyEn,
  "faculty": ${localizedText("facultyEn", "facultyZh")},
  outcomesZh,
  outcomesEn,
  "outcomes": ${localizedText("outcomesEn", "outcomesZh")},
  galleryImages[]{${imageFields}}
}`);

export const offlineWorkshopsQuery = defineQuery(`*[
  _type == "offlineWorkshop"
] | order(order asc) {
  ${offlineWorkshopCardFields}
}`);

export const offlineWorkshopBySlugQuery = defineQuery(`*[
  _type == "offlineWorkshop" &&
  slug.current == $slug
][0]{
  ${offlineWorkshopCardFields}
}`);

export const experienceCoursesQuery = defineQuery(`*[
  _type == "experienceCourse"
] | order(order asc) {
  ${experienceCourseFields}
}`);

export const experienceCourseBySlugQuery = defineQuery(`*[
  _type == "experienceCourse" &&
  slug.current == $slug
][0]{
  ${experienceCourseFields}
}`);

export const offlineExperiencePageQuery = defineQuery(`*[
  _type == "offlineExperiencePage" &&
  _id == "offlineExperiencePage"
][0]{
  ${offlineExperiencePageFields}
}`);

export const artWorksQuery = defineQuery(`*[
  (_type == "artWork" || _type == "artProject") &&
  ${publishedArtWorkFilter}
] | order(coalesce(_orderRank, "zzzzzzzzzz") asc, order asc) {
  ${artWorkCardFields}
}`);

export const artWorksByTypeQuery = defineQuery(`*[
  (_type == "artWork" || _type == "artProject") &&
  ${publishedArtWorkFilter} &&
  coalesce(category, workType, projectType) == $workType
] | order(coalesce(_orderRank, "zzzzzzzzzz") asc, order asc) {
  ${artWorkCardFields}
}`);

export const sculptureWorksQuery = defineQuery(`*[
  (_type == "artWork" || _type == "artProject") &&
  ${publishedArtWorkFilter} &&
  coalesce(category, workType, projectType) == "sculpture"
] | order(coalesce(_orderRank, "zzzzzzzzzz") asc, order asc) {
  ${artWorkCardFields}
}`);

export const installationArtWorksQuery = defineQuery(`*[
  (_type == "artWork" || _type == "artProject") &&
  ${publishedArtWorkFilter} &&
  coalesce(category, workType, projectType) == "installation-art"
] | order(coalesce(_orderRank, "zzzzzzzzzz") asc, order asc) {
  ${artWorkCardFields}
}`);

export const publicArtWorksQuery = defineQuery(`*[
  (_type == "artWork" || _type == "artProject") &&
  ${publishedArtWorkFilter} &&
  coalesce(category, workType, projectType) == "public-art"
] | order(coalesce(_orderRank, "zzzzzzzzzz") asc, order asc) {
  ${artWorkCardFields}
}`);

export const artWorkBySlugQuery = defineQuery(`*[
  (_type == "artWork" || _type == "artProject") &&
  ${publishedArtWorkFilter} &&
  slug.current == $slug
][0]{
  ${artWorkCardFields}
}`);

export const artCategoryByTypeQuery = defineQuery(`*[
  _type == "artCategory" &&
  categoryType == $categoryType
][0]{
  ${artCategoryFields}
}`);

export const artCategoryArtworkBySlugQuery = defineQuery(`*[
  _type == "artCategory" &&
  categoryType == $categoryType
][0]{
  _id,
  titleZh,
  titleEn,
  "title": ${localizedText("titleEn", "titleZh")},
  categoryType,
  "artwork": artworks[slug.current == $slug][0]{
    _key,
    titleZh,
    titleEn,
    "title": ${localizedText("titleEn", "titleZh")},
    "slug": slug.current,
    images[]{${imageFields}},
    "coverImage": images[0]{${imageFields}},
    dimensions,
    descriptionZh,
    descriptionEn,
    "description": ${localizedText("descriptionEn", "descriptionZh")}
  }
}`);

export const productsQuery = defineQuery(`*[
  _type == "product" &&
  coalesce(needsReview, false) != true
] | order(coalesce(_orderRank, "zzzzzzzzzz") asc, order asc) {
  ${productCardFields}
}`);

export const productsByTypeQuery = defineQuery(`*[
  _type == "product" &&
  coalesce(needsReview, false) != true &&
  (
    productType == $productType ||
    ($productType == "artworks" && productType in ["artworks", "available-artworks"]) ||
    ($productType == "cultural" && productType in ["cultural", "cultural-products"]) ||
    ($productType == "derivatives" && productType in ["derivatives", "art-derivatives", "art-merchandise"]) ||
    ($productType == "art-derivatives" && productType in ["derivatives", "art-derivatives", "art-merchandise"])
  )
] | order(coalesce(_orderRank, "zzzzzzzzzz") asc, order asc) {
  ${productCardFields}
}`);

export const productsByDerivativeCategoryQuery = defineQuery(`*[
  _type == "product" &&
  coalesce(needsReview, false) != true &&
  productType in ["derivatives", "art-derivatives", "art-merchandise"] &&
  derivativeCategory == $derivativeCategory
] | order(coalesce(_orderRank, "zzzzzzzzzz") asc, order asc) {
  ${productCardFields}
}`);

export const productBySlugQuery = defineQuery(`*[
  _type == "product" &&
  coalesce(needsReview, false) != true &&
  slug.current == $slug
][0]{
  ${productCardFields},
  detailZh,
  detailEn,
  "detail": ${localizedText("detailEn", "detailZh")}
}`);

export const derivativeProductSlugsQuery = defineQuery(`*[
  _type == "product" &&
  coalesce(needsReview, false) != true &&
  productType in ["derivatives", "art-derivatives", "art-merchandise"] &&
  defined(slug.current)
]{
  "slug": slug.current
}`);

export const artDerivativeDetailsForCardsQuery = defineQuery(`*[
  _type == "artDerivativeDetail" &&
  coalesce(needsReview, false) != true &&
  defined(slug.current)
] | order(coalesce(_orderRank, "zzzzzzzzzz") asc, order asc) {
  ${artDerivativeDetailCardFields}
}`);

export const artworkProductsQuery = defineQuery(`*[
  _type == "artworkProduct"
] | order(coalesce(_orderRank, "zzzzzzzzzz") asc, order asc) {
  ${artworkProductFields}
}`);

export const artworkProductBySlugQuery = defineQuery(`*[
  _type == "artworkProduct" &&
  slug.current == $slug
][0]{
  ${artworkProductFields}
}`);

export const derivativeProductsQuery = defineQuery(`*[
  _type == "derivativeProduct" &&
  coalesce(needsReview, false) != true
] | order(coalesce(_orderRank, "zzzzzzzzzz") asc, order asc) {
  ${derivativeProductFields}
}`);

export const derivativeProductBySlugQuery = defineQuery(`*[
  _type == "derivativeProduct" &&
  coalesce(needsReview, false) != true &&
  slug.current == $slug
][0]{
  ${derivativeProductFields}
}`);

export const culturalProductsQuery = defineQuery(`*[
  _type == "culturalProduct"
] | order(order asc) {
  ${culturalProductFields}
}`);

export const productCollectionsQuery = defineQuery(`*[
  _type == "productCollection" &&
  coalesce(needsReview, false) != true &&
  coalesce(status, "visible") != "hidden"
] | order(coalesce(_orderRank, "zzzzzzzzzz") asc, order asc) {
  ${productCollectionFields}
}`);

export const shopSeriesQuery = defineQuery(`*[
  _type == "shopSeries" &&
  !(_id in path("drafts.**")) &&
  defined(slug.current)
] | order(order asc, titleZh asc) {
  _id,
  titleZh,
  titleEn,
  "title": ${localizedText("titleEn", "titleZh")},
  "slug": slug.current,
  order,
  "branches": coalesce(
    branches[]->{
      _id,
      titleZh,
      titleEn,
      "title": ${localizedText("titleEn", "titleZh")},
      "slug": slug.current,
      "seriesId": series._ref,
      order
    },
    *[_type == "shopSeriesBranch" && !(_id in path("drafts.**")) && series._ref == ^._id] | order(order asc, titleZh asc) {
      _id,
      titleZh,
      titleEn,
      "title": ${localizedText("titleEn", "titleZh")},
      "slug": slug.current,
      "seriesId": series._ref,
      order
    }
  )
}`);

export const storeOverviewQuery = defineQuery(`{
  "cmsProducts": *[
    _type == "productCollection" &&
    coalesce(needsReview, false) != true &&
    coalesce(status, "visible") != "hidden"
  ] | order(coalesce(_orderRank, "zzzzzzzzzz") asc, order asc) {
    ${productCollectionFields}
  },
  "productDocuments": *[
    _type == "product" &&
    coalesce(needsReview, false) != true
  ] | order(coalesce(_orderRank, "zzzzzzzzzz") asc, order asc) {
    ${productCardFields}
  },
  "artDerivativeDetails": *[
    _type == "artDerivativeDetail" &&
    coalesce(needsReview, false) != true &&
    defined(slug.current)
  ] | order(coalesce(_orderRank, "zzzzzzzzzz") asc, order asc) {
    ${artDerivativeDetailCardFields}
  },
  "artworkDetailProducts": *[
    ${canonicalProductDetailFilter}
  ] | order(coalesce(_orderRank, "zzzzzzzzzz") asc, order asc) {
    _id,
    "category": "artwork",
    "productType": "artworks",
    "productNumber": basicInfo.productNumber,
    "description": select(
      defined(basicInfo.category) && basicInfo.category != "" => basicInfo.category,
      ${localizedText("productInfo.descriptionEn", "productInfo.descriptionZh")}
    ),
    "artworkCategory": basicInfo.category,
    "slug": slug.current,
    "coverImage": select(
      defined(media.mainImage) => media.mainImage{${imageFields}},
      media.galleryImages[0]{${imageFields}}
    ),
    "galleryImages": media.galleryImages[]{${imageFields}},
    "price": commerce.price,
    "title": ${localizedText("basicInfo.titleEn", "basicInfo.titleZh")},
    ${shopTaxonomyFields},
    "orderRank": _orderRank,
    order
  },
  "packagingPage": *[
    _type == "artDerivativePackagingPage" &&
    _id == "artDerivativePackagingPage"
  ][0]{
    ${artDerivativePackagingPageFields}
  },
  "seriesItems": *[
    _type == "shopSeries" &&
    !(_id in path("drafts.**")) &&
    defined(slug.current)
  ] | order(order asc, titleZh asc) {
    _id,
    titleZh,
    titleEn,
    "title": ${localizedText("titleEn", "titleZh")},
    "slug": slug.current,
    order,
    "branches": coalesce(
      branches[]->{
        _id,
        titleZh,
        titleEn,
        "title": ${localizedText("titleEn", "titleZh")},
        "slug": slug.current,
        "seriesId": series._ref,
        order
      },
      *[_type == "shopSeriesBranch" && !(_id in path("drafts.**")) && series._ref == ^._id] | order(order asc, titleZh asc) {
        _id,
        titleZh,
        titleEn,
        "title": ${localizedText("titleEn", "titleZh")},
        "slug": slug.current,
        "seriesId": series._ref,
        order
      }
    )
  }
}`);

export const productDetailBySlugQuery = defineQuery(`*[
  ${canonicalProductDetailFilter} &&
  slug.current == $slug
] | order(_updatedAt desc)[0]{
  ${productDetailFields}
}`);

export const productDetailsForCardsQuery = defineQuery(`*[
  ${canonicalProductDetailFilter}
] | order(coalesce(_orderRank, "zzzzzzzzzz") asc, order asc) {
  _id,
  "category": "artwork",
  "productType": "artworks",
  "productNumber": basicInfo.productNumber,
  "description": select(
    defined(basicInfo.category) && basicInfo.category != "" => basicInfo.category,
    ${localizedText("productInfo.descriptionEn", "productInfo.descriptionZh")}
  ),
  "artworkCategory": basicInfo.category,
  "slug": slug.current,
  "coverImage": select(
    defined(media.mainImage) => media.mainImage{${imageFields}},
    media.galleryImages[0]{${imageFields}}
  ),
  "galleryImages": media.galleryImages[]{${imageFields}},
  "price": commerce.price,
  "title": ${localizedText("basicInfo.titleEn", "basicInfo.titleZh")},
  ${shopTaxonomyFields},
  "orderRank": _orderRank,
  order
}`);

export const productDetailSlugsQuery = defineQuery(`*[
  ${canonicalProductDetailFilter}
]{
  "slug": slug.current
}`);

export const siteSearchContentQuery = defineQuery(`{
  "artworks": *[
    (_type == "artWork" || _type == "artProject") &&
    ${publishedDocumentFilter} &&
    ${publishedArtWorkFilter} &&
    defined(slug.current)
  ] | order(coalesce(_orderRank, "zzzzzzzzzz") asc, order asc) {
    _id,
    "_type": _type,
    titleZh,
    titleEn,
    "title": ${localizedText("titleEn", "titleZh")},
    "slug": slug.current,
    "category": coalesce(category, workType, projectType),
    "workType": coalesce(category, workType, projectType),
    artist,
    year,
    descriptionZh,
    descriptionEn,
    "description": ${localizedText("descriptionEn", "descriptionZh")},
    "coverImage": coalesce(coverImage{${imageFields}}, galleryImages[0].image{${imageFields}}, galleryImages[0]{${imageFields}}, images[0].image{${imageFields}}, images[0]{${imageFields}})
  },
  "events": *[
    _type == "event" &&
    ${publishedDocumentFilter}
  ] | order(order asc) {
    _id,
    titleZh,
    titleEn,
    "title": ${localizedText("titleEn", "titleZh")},
    "slug": slug.current,
    "eventType": select(eventType == "event" => "activity", eventType),
    courseIntroZh,
    courseIntroEn,
    "courseIntro": ${localizedText("courseIntroEn", "courseIntroZh")},
    facultyZh,
    facultyEn,
    "faculty": ${localizedText("facultyEn", "facultyZh")},
    contentZh,
    contentEn,
    "content": ${localizedText("contentEn", "contentZh")},
    coverImage{${imageFields}},
    posterImage{${imageFields}}
  },
  "studyPrograms": *[
    _type == "studyProgram" &&
    ${publishedDocumentFilter} &&
    defined(slug.current)
  ] | order(order asc) {
    _id,
    titleZh,
    titleEn,
    "title": ${localizedText("titleEn", "titleZh")},
    "slug": slug.current,
    programType,
    courseIntroZh,
    courseIntroEn,
    "courseIntro": ${localizedText("courseIntroEn", "courseIntroZh")},
    academicHostZh,
    academicHostEn,
    "academicHost": ${localizedText("academicHostEn", "academicHostZh")},
    teacherTeamZh,
    teacherTeamEn,
    "teacherTeam": ${localizedText("teacherTeamEn", "teacherTeamZh")},
    heroImage{${imageFields}},
    coverImage{${imageFields}}
  },
  "experienceCourses": *[
    _type == "experienceCourse" &&
    ${publishedDocumentFilter} &&
    defined(slug.current)
  ] | order(order asc) {
    _id,
    titleZh,
    titleEn,
    "title": ${localizedText("titleEn", "titleZh")},
    "slug": slug.current,
    descriptionZh,
    descriptionEn,
    "description": ${localizedText("descriptionEn", "descriptionZh")},
    teacher,
    academicSupport,
    category,
    heroImage{${imageFields}},
    coverImage{${imageFields}}
  },
  "offlineWorkshops": *[
    _type == "offlineWorkshop" &&
    ${publishedDocumentFilter} &&
    defined(slug.current)
  ] | order(order asc) {
    _id,
    titleZh,
    titleEn,
    "title": ${localizedText("titleEn", "titleZh")},
    "slug": slug.current,
    shortDescriptionZh,
    shortDescriptionEn,
    "shortDescription": ${localizedText("shortDescriptionEn", "shortDescriptionZh")},
    tagZh,
    tagEn,
    "tag": ${localizedText("tagEn", "tagZh")},
    category,
    coverImage{${imageFields}}
  },
  "productDetails": *[
    ${canonicalProductDetailFilter}
  ] | order(coalesce(_orderRank, "zzzzzzzzzz") asc, order asc) {
    _id,
    "slug": slug.current,
    "productType": "artworks",
    "titleZh": basicInfo.titleZh,
    "titleEn": basicInfo.titleEn,
    "title": ${localizedText("basicInfo.titleEn", "basicInfo.titleZh")},
    "productNumber": basicInfo.productNumber,
    "category": basicInfo.category,
    "descriptionZh": productInfo.descriptionZh,
    "descriptionEn": productInfo.descriptionEn,
    "description": ${localizedText("productInfo.descriptionEn", "productInfo.descriptionZh")},
    "coverImage": coalesce(media.mainImage{${imageFields}}, media.galleryImages[0]{${imageFields}}),
    ${shopTaxonomyFields}
  },
  "products": *[
    _type == "product" &&
    ${publishedDocumentFilter} &&
    coalesce(needsReview, false) != true &&
    defined(slug.current)
  ] | order(coalesce(_orderRank, "zzzzzzzzzz") asc, order asc) {
    ${productCardFields}
  },
  "derivativeProducts": *[
    _type == "derivativeProduct" &&
    ${publishedDocumentFilter} &&
    coalesce(needsReview, false) != true &&
    defined(slug.current)
  ] | order(order asc) {
    ${derivativeProductFields},
    "productType": "derivatives"
  },
  "artDerivativeDetails": *[
    _type == "artDerivativeDetail" &&
    ${publishedDocumentFilter} &&
    coalesce(needsReview, false) != true &&
    defined(slug.current)
  ] | order(coalesce(_orderRank, "zzzzzzzzzz") asc, order asc) {
    ${artDerivativeDetailCardFields}
  },
  "artworkProducts": *[
    _type == "artworkProduct" &&
    ${publishedDocumentFilter} &&
    defined(slug.current)
  ] | order(coalesce(_orderRank, "zzzzzzzzzz") asc, order asc) {
    ${artworkProductFields}
  },
  "teamMembers": *[
    _type == "teamMember" &&
    ${publishedDocumentFilter} &&
    defined(slug.current)
  ] | order(order asc) {
    _id,
    nameZh,
    nameEn,
    "name": ${localizedText("nameEn", "nameZh")},
    "slug": slug.current,
    roleZh,
    roleEn,
    "role": ${localizedText("roleEn", "roleZh")},
    shortBioZh,
    shortBioEn,
    bioZh,
    bioEn,
    "bio": select(
      $locale == "en" && defined(shortBioEn) && shortBioEn != "" => shortBioEn,
      defined(shortBioZh) && shortBioZh != "" => shortBioZh,
      $locale == "en" && defined(bioEn) && bioEn != "" => bioEn,
      bioZh
    ),
    portrait{${imageFields}}
  },
  "artists": *[
    _type == "artist" &&
    ${publishedDocumentFilter} &&
    defined(slug.current)
  ] | order(order asc) {
    _id,
    nameZh,
    nameEn,
    "name": ${localizedText("nameEn", "nameZh")},
    "slug": slug.current,
    titleZh,
    titleEn,
    "title": ${localizedText("titleEn", "titleZh")},
    bioZh,
    bioEn,
    "bio": ${localizedText("bioEn", "bioZh")},
    portrait{${imageFields}}
  }
}`);

export const artDerivativeDetailBySlugQuery = defineQuery(`*[
  _type == "artDerivativeDetail" &&
  slug.current == $slug
][0]{
  ${artDerivativeDetailFields}
}`);

export const artDerivativeDetailSlugsQuery = defineQuery(`*[
  _type == "artDerivativeDetail" &&
  defined(slug.current)
]{
  "slug": slug.current
}`);

export const artDerivativePackagingPageQuery = defineQuery(`*[
  _type == "artDerivativePackagingPage" &&
  _id == "artDerivativePackagingPage"
][0]{
  ${artDerivativePackagingPageFields}
}`);

export const culturalProductSlugsQuery = defineQuery(`*[
  _type == "culturalProduct" &&
  defined(slug.current)
]{
  "slug": slug.current
}`);

export const artProjectsQuery = artWorksQuery;
export const featuredArtProjectsQuery = defineQuery(`*[
  _type == "artProject" &&
  coalesce(needsReview, false) != true &&
  isFeatured == true
] | order(order asc) {
  ${artWorkCardFields}
}`);
export const artProjectBySlugQuery = artWorkBySlugQuery;

export {}

declare global {
  interface ReviewerBoxCenter {
    name: string
    profilePicture?: string
    date: string
    rating: number
    contains: string
  }

  interface BoxTarif {
    time: number
    price: number
  }

  interface CorporateValues {
    value: string
    image: string
    alt: string
    describe: string
  }

  interface INTRO_LINE {
    icon: string
    textIntro: string
  }

  interface BOX_CONTENT {
    category: string
    name: string
    mainTitle: string
    meta_description: string
    url_box: string
    bannerImage: string
    altBannerImage: string
    titlePage: string
    subtitle: string
    introduction: Array<INTRO_LINE>
    boxes: string[]
    corporateValues: Array<CorporateValues>
    tarifs: Array<BoxTarif>
    tools: string[]
    carouselPictures: string[]
    reviews: Array<ReviewerBoxCenter>
  }

  interface BOX_CATEGORIES {
    MECANIC_BOX: BOX_CONTENT
    WASHING_BOX: BOX_CONTENT
    DETAILING_BOX: BOX_CONTENT
  }
}

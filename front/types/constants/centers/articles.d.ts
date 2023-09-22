export {}

declare global {
  interface BlogArticle {
    title: string
    image: string
    alt: string
    content: string
  }

  interface BlogTopics {
    topic: string
    duration: Array<number>
    level: number
    intro: string
    image: string
    alt: string
    articles: Array<BlogArticle>
  }

  interface CONSTANT_BLOG_TOPICS {
    MECANIC: Array<BlogTopics>
    DETAILING: Array<BlogTopics>
    WASHING: Array<BlogTopics>
  }
}

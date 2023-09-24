export {}

declare global {
  interface IArtist {
    id: number
    name: string
  }

  interface IMusic {
    id: number
    authorId: number
    title: string
    pictureURL: string
    rating: number
  }
}

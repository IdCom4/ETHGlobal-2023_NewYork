export {}

declare global {
  interface IReview {
    _rating: number
    _date: string
    _message?: string
    _userId: string
    _userName: string
  }

  interface IReviewPayload {
    rating: number
    comment?: string
  }
}

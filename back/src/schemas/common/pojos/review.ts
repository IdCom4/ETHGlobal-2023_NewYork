import { Expose } from 'class-transformer'
import { prop } from '@typegoose/typegoose'

export class Review {
  @prop({ type: Number, required: true })
  @Expose()
  protected _rating!: number

  @prop({ type: Date, required: true })
  @Expose()
  protected _date!: Date

  @prop({ type: String })
  @Expose()
  protected _message?: string

  @prop({ required: true })
  @Expose()
  protected _userId!: string

  @prop({ type: String, required: true })
  @Expose()
  protected _userName!: string

  constructor(rating: number, date: Date, userId: string, userName: string, message?: string) {
    this._rating = rating
    this._date = date
    this._message = message
    this._userId = userId
    this._userName = userName
  }

  get rating(): number {
    return this._rating
  }

  get date(): Date {
    return this._date
  }

  get message(): string | undefined {
    return this._message
  }

  get userId(): string {
    return this._userId
  }

  get userName(): string {
    return this._userName
  }
}

export abstract class ClientReviewBlueprint extends Review {
  _rating!: number
  _date!: Date
  _message?: string
  _userId!: string
  _userName!: string
}

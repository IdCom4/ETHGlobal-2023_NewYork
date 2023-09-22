import { Expose } from 'class-transformer'
import { prop } from '@typegoose/typegoose'

export class Notification {
  @prop({ type: Number, required: true })
  @Expose()
  protected readonly _id!: number

  @prop({ type: String, required: true })
  @Expose()
  protected readonly _title!: string

  @prop({ type: String, required: true })
  @Expose()
  protected readonly _message!: string

  @prop({ type: String })
  @Expose()
  protected readonly _link?: string

  @prop({ type: Date, required: true })
  @Expose()
  protected readonly _createdAt!: Date

  @prop({ type: Date })
  @Expose()
  protected _seenAt?: Date

  constructor(id: number, title: string, message: string, link?: string) {
    this._id = id
    this._title = title
    this._message = message
    this._link = link
    this._createdAt = new Date()
  }

  hasBeenSeen(): boolean {
    return !!this._seenAt
  }

  isSeen(): void {
    this._seenAt = new Date()
  }

  get id(): number {
    return this._id
  }

  get title(): string {
    return this._title
  }

  get message(): string {
    return this._message
  }

  get link(): string | undefined {
    return this._link
  }

  get createdAt(): Date {
    return this._createdAt
  }

  get seenAt(): Date | undefined {
    return this._seenAt
  }
}

export abstract class NotificationBlueprint extends Notification {
  public _id!: number
  public _title!: string
  public _message!: string
  public _link?: string
  public _createdAt!: Date
  public _seenAt?: Date
}

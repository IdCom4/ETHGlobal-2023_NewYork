import { IllegalArgumentException } from '@/common/exceptions'
import { prop } from '@typegoose/typegoose'
import { PublicFile } from './public-file'
import { Expose } from 'class-transformer'

export class Message {
  /* eslint-disable prettier/prettier */
  @prop({ required: true, _id: false }) @Expose({ name: 'index' })        protected _index: number
  @prop({ required: false, _id: false }) @Expose({ name: 'content' })     protected _content?: string
  @prop({ required: false, _id: false }) @Expose({ name: 'attachment' })  protected _attachment?: PublicFile
  @prop({ required: false, _id: false }) @Expose({ name: 'senderId' })    protected _senderId?: string
  @prop({ required: false, _id: false }) @Expose({ name: 'receiverId' })  protected _receiverId?: string
  @prop({ required: true, _id: false }) @Expose({ name: 'bySystem' })     protected _bySystem: boolean
  @prop({ required: true, _id: false }) @Expose({ name: 'sentAt' })       protected _sentAt: Date = new Date()
  @prop({ required: true, _id: false }) @Expose({ name: 'seenByAt' })     protected _seenByAt: Record<string, Date>
  /* eslint-enable prettier/prettier */

  /* >==== INIT ====> */
  /**
   * @deprecated You should use static {@link of} method.
   * This constructor is used by class-transformation to convert plain objects to instance.
   */
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  constructor() {}

  public static of(
    index: number,
    content: string | undefined,
    attachment: PublicFile | undefined,
    bySystem: boolean,
    senderId?: string,
    receiverId?: string
  ): Message {
    if (!bySystem && (!senderId || !receiverId))
      throw new IllegalArgumentException('Un message envoyé par un utilisateur doit avoir un envoyeur et un destinataire')
    if (!content && !attachment) throw new IllegalArgumentException('Un message doit avoir au moins un contenu ou une pièce jointe')

    const message = new Message()

    message._index = index
    message._content = content
    message._attachment = attachment
    message._senderId = senderId
    message._receiverId = receiverId
    message._bySystem = bySystem

    message._seenByAt = {}

    return message
  }

  /* >==== GETTERS & SETTERS ====> */
  /* eslint-disable prettier/prettier */
  get index():        number                 { return this._index         }
  get content():      string | undefined     { return this._content       }
  get attachment():   PublicFile | undefined { return this._attachment    }
  get senderId():     string | undefined     { return this._senderId      }
  get receiverId():   string | undefined     { return this._receiverId    }
  get bySystem():     boolean                { return this._bySystem      }
  get sentAt():       Date                   { return this._sentAt        }
  get seenByAt():     Record<string, Date>   { return this._seenByAt      }
  /* eslint-enable prettier/prettier */

  /* >==== METHODS ====> */
  public sawBy(userWhoSawId: string): void {
    this._seenByAt[userWhoSawId] = new Date()
  }

  public hasUserSeen(userId: string): boolean {
    return !!this._seenByAt[userId]
  }
}

export class UserMessage extends Message {
  protected _senderId: string
  protected _receiverId: string

  protected _bySystem = false

  protected constructor() {
    super()
  }

  public static ofUserInputs(
    index: number,
    content: string | undefined,
    attachment: PublicFile | undefined,
    senderId: string,
    receiverId: string
  ): UserMessage {
    const message = Message.of(index, content, attachment, false, receiverId, senderId)

    return message as UserMessage
  }

  /* >==== GETTERS & SETTERS ====> */
  /* eslint-disable prettier/prettier */
  get senderId():     string    { return this._senderId     }
  get receiverId():   string    { return this._receiverId   }
  /* eslint-enable prettier/prettier */
}

export class SystemMessage extends Message {
  protected _senderId: undefined
  protected _receiverId: undefined

  protected _bySystem = false

  protected constructor() {
    super()
  }

  public static ofSystemInputs(index: number, content?: string, attachment?: PublicFile): SystemMessage {
    const message = Message.of(index, content, attachment, true)

    return message as SystemMessage
  }

  /* >==== GETTERS & SETTERS ====> */
  /* eslint-disable prettier/prettier */
  get senderId():     undefined    { return this._senderId     }
  get receiverId():   undefined    { return this._receiverId   }
  /* eslint-enable prettier/prettier */
}

export abstract class MessageBlueprint extends Message {
  public _index: number
  public _content: string
  public _senderId?: string
  public _receiverId?: string
  public _bySystem: boolean
  public _sentAt: Date
  public _seenByAt: Record<string, Date>
}

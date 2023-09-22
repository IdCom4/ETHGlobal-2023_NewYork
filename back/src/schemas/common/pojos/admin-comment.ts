import { Expose } from 'class-transformer'
import { prop } from '@typegoose/typegoose'
import { UserGroups } from '@/common/enums'
import { User } from '@/schemas/user'
import { ForbiddenException } from '@nestjs/common/exceptions'

export class AdminComment {
  @prop({ type: String })
  @Expose({ name: 'text', groups: [UserGroups.ADMIN_REQUEST] })
  protected _text: string

  @prop({ type: String })
  @Expose({ name: 'authorId', groups: [UserGroups.ADMIN_REQUEST] })
  protected _authorId: string

  @prop({ type: String })
  @Expose({ name: 'authorName', groups: [UserGroups.ADMIN_REQUEST] })
  protected _authorName: string

  @prop({ type: Date })
  @Expose({ name: 'date', groups: [UserGroups.ADMIN_REQUEST] })
  protected _date: Date

  /* >==== INIT ====> */
  /**
   * @deprecated You should use static {@link of} method.
   * This constructor is used by class-transformation to convert plain objects to instance.
   */
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  constructor() {}

  public static of(text: string, author: User, date: Date): AdminComment {
    if (!author.isAdmin) throw new ForbiddenException('Vous devez être un administateur')

    const note = new AdminComment()

    note._text = text
    note._authorId = author._id.toString()
    note._authorName = author.getFullName()
    note._date = date

    return note
  }

  /* >==== GETTERS && SETTERS ====> */
  /* eslint-disable prettier/prettier */
  get text():          string      { return this._text          }
  get authorId():      string      { return this._authorId      }
  get authorName():    string      { return this._authorName    }
  get date():          Date        { return this._date          }
  /* eslint-enable prettier/prettier */
}

export abstract class CommentBlueprint extends AdminComment {
  public _text: string
  public _authorId: string
  public _date: Date
}

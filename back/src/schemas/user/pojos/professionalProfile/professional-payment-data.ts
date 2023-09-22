import { UserGroups } from '@/common/enums'
import { prop } from '@typegoose/typegoose'
import { Expose } from 'class-transformer'

export enum ProfessionalPaymentDataStatus {
  EMPTY = 'EMPTY',
  PENDING = 'PENDING',
  SUCCESS = 'SUCCESS',
  FAILED = 'FAILED',
}

export class ProfessionalPaymentData {
  @prop({ type: String })
  @Expose({ name: 'iban', groups: [UserGroups.LOGGED_REQUEST, UserGroups.ADMIN_REQUEST] })
  protected _iban?: string

  @prop({ type: String })
  @Expose({ name: 'documentationType', groups: [UserGroups.LOGGED_REQUEST, UserGroups.ADMIN_REQUEST] })
  protected _documentationType?: string

  @prop({ type: Boolean })
  @Expose({ name: 'additionalDocumentation', groups: [UserGroups.LOGGED_REQUEST, UserGroups.ADMIN_REQUEST] })
  protected _additionalDocumentation?: boolean

  @prop({ required: true })
  @Expose({ name: 'pastDue', groups: [UserGroups.LOGGED_REQUEST, UserGroups.ADMIN_REQUEST] })
  protected _pastDue!: Array<string>

  @prop({ required: true })
  @Expose({ name: 'errors', groups: [UserGroups.LOGGED_REQUEST, UserGroups.ADMIN_REQUEST] })
  protected _errors!: Array<string>

  @prop({ type: String, required: true })
  @Expose({ name: 'status', groups: [UserGroups.LOGGED_REQUEST, UserGroups.ADMIN_REQUEST] })
  protected _status!: ProfessionalPaymentDataStatus

  @prop({ type: String, required: false })
  @Expose({ name: 'accountId', groups: [UserGroups.LOGGED_REQUEST, UserGroups.ADMIN_REQUEST] })
  protected _accountId?: string

  constructor() {
    this._pastDue = []
    this._errors = []
    this._status = ProfessionalPaymentDataStatus.EMPTY
  }

  /* >==== GETTERS && SETTERS ====> */
  /* eslint-disable prettier/prettier */
  get iban():                       string | undefined               { return this._iban                     }
  get documentationType():          string | undefined               { return this._documentationType        }
  get additionalDocumentation():    boolean | undefined              { return this._additionalDocumentation  }
  get pastDue():                    Array<string>                    { return this._pastDue                  }
  get errors():                     Array<string>                    { return this._errors                   }
  get status():                     ProfessionalPaymentDataStatus    { return this._status                   }
  get accountId():                  string | undefined               { return this._accountId                }
  /* eslint-enable prettier/prettier */

  public setAccountId(accountId: string): void {
    this._accountId = accountId
  }

  public setPastDue(pastDue: Array<string>): void {
    this._pastDue = pastDue
  }

  public setIban(iban: string): void {
    this._iban = iban
  }

  public addError(error: string): void {
    this._errors.push(error)
  }

  public clearErrors(): void {
    this._errors.length = 0
  }
}

export abstract class ProfessionalPaymentDataBlueprint extends ProfessionalPaymentData {
  _iban?: string
  _documentationType?: string
  _additionalDocumentation?: boolean
  _pastDue!: Array<string>
  _errors!: Array<string>
  _status!: ProfessionalPaymentDataStatus
}

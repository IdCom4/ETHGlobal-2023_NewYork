import { StrictAddress } from '@/schemas/common/pojos'
import { prop } from '@typegoose/typegoose'
import { Expose, Type } from 'class-transformer'
import { CompanyRequest } from '@/API/professionals/requests/update-professional-profile/pojos.dto'

export class Company {
  @prop({ type: String, required: true })
  @Expose({ name: 'siret' })
  protected _siret!: string

  @prop({ type: String, required: true })
  @Expose({ name: 'legalForm' })
  protected _legalForm!: string

  @prop({ type: String, required: true })
  @Expose({ name: 'denomination' })
  protected _denomination!: string

  @prop({ type: StrictAddress, required: true })
  @Type(() => StrictAddress)
  @Expose({ name: 'legalAddress' })
  protected _legalAddress!: StrictAddress

  @prop({ type: String, required: true })
  @Expose({ name: 'naf' })
  protected _naf!: string

  constructor(siret: string, legalForm: string, denomination: string, legalAddress: StrictAddress, naf: string) {
    this._siret = siret
    this._legalForm = legalForm
    this._denomination = denomination
    this._legalAddress = legalAddress
    this._naf = naf
  }

  static fromRequest(companyRequest: CompanyRequest): Company {
    return new Company(
      companyRequest.siret,
      companyRequest.legalForm,
      companyRequest.denomination,
      companyRequest.legalAddress.toStrictAddress(),
      companyRequest.naf
    )
  }

  get siret(): string {
    return this._siret
  }

  get legalForm(): string {
    return this._legalForm
  }

  get denomination(): string {
    return this._denomination
  }

  get legalAddress(): StrictAddress {
    return this._legalAddress
  }

  get naf(): string {
    return this._naf
  }
}

export abstract class CompanyBlueprint extends Company {
  _siret!: string
  _legalForm!: string
  _denomination!: string
  _legalAddress!: StrictAddress
  _naf!: string
}

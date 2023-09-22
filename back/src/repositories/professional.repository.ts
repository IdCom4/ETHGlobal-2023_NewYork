import { ProfessionalUser, User } from '@Schemas/user'
import { Injectable } from '@nestjs/common'
import { InjectModel } from 'nestjs-typegoose'
import { ReturnModelType } from '@typegoose/typegoose'
import { InstantiatingDataWrapper } from '@Common/classes'
import { AbstractSoftDeletableRepository } from '@/repositories/base/abstract.repository'
import { UserBlueprint } from '@Schemas/user/user.blueprint'
import { UserRepository } from './user.repository'

@Injectable()
export class ProfessionalRepository extends UserRepository {
  public static readonly PROFESSIONAL_FILTER: TDocumentMongoFilterQuery<UserBlueprint> = {
    _professionalProfile: { $nin: [null, undefined] },
  }
  public static readonly MISSION_READY_FILTER: TDocumentMongoFilterQuery<UserBlueprint> = {
    ...ProfessionalRepository.PROFESSIONAL_FILTER,
    // '_professionalProfile._completionScore': { $gte: 50 },
    '_professionalProfile._workAddress': { $nin: [null, undefined] },
    '_professionalProfile._shadowBanned': false,
  }

  public constructor(@InjectModel(User) model: ReturnModelType<typeof User>) {
    super(model)
  }

  public findProfessionalList(ids: string[]): InstantiatingDataWrapper<Promise<ProfessionalUser[]>, ProfessionalUser> {
    return this.findMany({ _id: { $in: ids }, ...ProfessionalRepository.PROFESSIONAL_FILTER }) as InstantiatingDataWrapper<
      Promise<ProfessionalUser[]>,
      ProfessionalUser
    >
  }

  public findManyActivesProfessionalsBy(
    query: TDocumentMongoFilterQuery<UserBlueprint>
  ): InstantiatingDataWrapper<Promise<ProfessionalUser[]>, ProfessionalUser> {
    return this.findManyActiveBy({ ...query, _professionalProfile: { $nin: [null, undefined] } }) as InstantiatingDataWrapper<
      Promise<ProfessionalUser[]>,
      ProfessionalUser
    >
  }

  public findManyMissionReadyProfessionalsBy(
    query: TDocumentMongoFilterQuery<UserBlueprint>
  ): InstantiatingDataWrapper<Promise<ProfessionalUser[]>, ProfessionalUser> {
    return this.findManyActivesProfessionalsBy({ ...query, ...ProfessionalRepository.MISSION_READY_FILTER })
  }

  public findActiveProfessionalById(professionalId: string): InstantiatingDataWrapper<Promise<ProfessionalUser>, ProfessionalUser> {
    return this.findActiveBy({
      _id: professionalId,
      _professionalProfile: { $nin: [null, undefined] },
      ...AbstractSoftDeletableRepository.ACTIVE_FILTER,
    }) as InstantiatingDataWrapper<Promise<ProfessionalUser>, ProfessionalUser>
  }

  public findProfessionalById(professionalId: string): InstantiatingDataWrapper<Promise<ProfessionalUser>, ProfessionalUser> {
    return this.findBy({
      _id: professionalId,
      _professionalProfile: { $nin: [null, undefined] },
    }) as InstantiatingDataWrapper<Promise<ProfessionalUser>, ProfessionalUser>
  }

  public findProfessionalByAccountId(accountId: string): InstantiatingDataWrapper<Promise<ProfessionalUser>, ProfessionalUser> {
    //TODO: see this with Idriss
    return this.findBy({
      '_professionalProfile._professionalPaymentData._accountId': accountId,
      _professionalProfile: { $nin: [null, undefined] },
    }) as InstantiatingDataWrapper<Promise<ProfessionalUser>, ProfessionalUser>
  }

  public findAllProfessionals(): InstantiatingDataWrapper<Promise<ProfessionalUser[]>, ProfessionalUser> {
    return this.findManyActiveBy({ professionalProfile: { $nin: [null, undefined] } }) as InstantiatingDataWrapper<
      Promise<ProfessionalUser[]>,
      ProfessionalUser
    >
  }
}

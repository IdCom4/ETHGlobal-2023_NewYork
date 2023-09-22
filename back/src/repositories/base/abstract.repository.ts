import { DBDocument, SoftDeletableDBDocument, SoftDeletableDBDocumentBlueprint } from '@Schemas/db-document.abstract-schema'
import { ReturnModelType } from '@typegoose/typegoose'
import { InstantiatingDataWrapper, TToInstanceOptions } from '@Common/classes'
import mongoose from 'mongoose'
import { Repository } from '@/repositories/base/repository'
import { InternalServerErrorException } from '@nestjs/common/exceptions'

export abstract class AbstractBaseRepository<TSchema extends DBDocument, TBlueprint extends TSchema> implements Repository<TSchema, TBlueprint> {
  protected constructor(
    protected readonly model: ReturnModelType<TClassConstructor<TSchema>>,
    protected readonly classConstructor: TClassConstructor<TSchema>
  ) {}

  /**
   * ***************** IMPORTANT *****************
   * **                                         **
   * When creating a polymorphic repository,
   * you'll have to override this method and
   * use the child model instead of the parent one.
   * When using the parent one, only the parent
   * properties will be saved and the child ones
   * will be ignored.
   * You'll have to use the child model to save
   * the child properties for each child type.
   * **                                         **
   * ***************** IMPORTANT *****************
   *
   * Creates a document from the given instance.
   *
   * @param instance - The instance to create the document from.
   * @returns A wrapped promise that resolves to the created document.
   */
  public async create(instance: TSchema): Promise<TSchema> {
    const savedDocument = await new this.model(instance).save()
    return await this.findById(savedDocument._id).getOrThrow(new InternalServerErrorException())
  }

  public async createMany(instances: TSchema[]): Promise<TSchema[]> {
    return (await this.model.insertMany(instances)) as TSchema[]
  }

  public async delete(id: string | mongoose.Types.ObjectId): Promise<boolean> {
    return !!(await this.model.deleteOne({ _id: id })).deletedCount
  }

  public async deleteList(ids: string[]): Promise<string[]> {
    const notDeletedInstances: string[] = []

    for (const id of ids) {
      if (!(await this.delete(id))) notDeletedInstances.push(id)
    }

    return notDeletedInstances
  }

  public async deleteMany(query: TMongoDeleteQuery<TBlueprint>): Promise<number> {
    return ((await this.model.deleteMany(query.filter, query.options)) as unknown as TMongoDeleteResult).deletedCount
  }

  public findAll(): InstantiatingDataWrapper<Promise<TSchema[]>, TSchema> {
    const data = this.model.find().lean().exec()

    return InstantiatingDataWrapper.fromData(data, { targetClass: this.classConstructor })
  }

  /**
   * ***************** IMPORTANT *****************
   * **                                         **
   * Note that this method shouldn't be used
   * with a parent object's repository.
   * In a polymorphic case, use findChildBy
   * to get the child instance with a
   * correct typing.<br/>
   * Please use  {@link findChildBy} instead.
   * **                                         **
   * ***************** IMPORTANT *****************
   *
   *
   * Finds a document that matches the given query.
   * If many documents match the query, only the first one will be returned.
   * If no document matches the query, the wrapped promise will resolve to `null`.
   *
   * @param query - The query to find the document with.
   * @returns A wrapped promise that resolves to the found document.
   */
  public findBy(query: TDocumentMongoFilterQuery<TBlueprint>): InstantiatingDataWrapper<Promise<TSchema>, TSchema> {
    const data = this.model
      .findOne({ ...query })
      .lean()
      .exec() as Promise<TSchema>

    return InstantiatingDataWrapper.fromData(data, { targetClass: this.classConstructor })
  }

  /**
   * ***************** IMPORTANT *****************
   * **                                         **
   * Note that this method shouldn't be used
   * with a parent object's repository.
   * In a polymorphic case, use findChildBy
   * to get the child instance with a
   * correct typing.<br/>
   * Please use  {@link findChildById} instead.
   * **                                         **
   * ***************** IMPORTANT *****************
   *
   * Finds a document by its id.
   * If no document matches the id, the wrapped promise will resolve to `null`.
   *
   * @param id - The id of the document to find.
   * @returns A wrapped promise that resolves to the found document.
   */
  public findById(id: string | mongoose.Types.ObjectId): InstantiatingDataWrapper<Promise<TSchema>, TSchema> {
    const data = this.model.findById(id).lean().exec() as Promise<TSchema>

    return InstantiatingDataWrapper.fromData(data, { targetClass: this.classConstructor })
  }

  public findList(ids: string[]): InstantiatingDataWrapper<Promise<TSchema[]>, TSchema> {
    const data = this.model
      .find({ _id: { $in: ids } })
      .lean()
      .exec()

    return InstantiatingDataWrapper.fromData(data, { targetClass: this.classConstructor })
  }

  /**
   * ***************** IMPORTANT *****************
   * **                                         **
   * Note that this method shouldn't be used
   * with a parent object's repository.
   * In a polymorphic case, use findChildBy
   * to get the child instance with a
   * correct typing.<br/>
   * Please use  {@link findManyChildren} instead.
   * **                                         **
   * ***************** IMPORTANT *****************
   *
   * Finds all documents that match the given query.
   * If no document matches the query, the wrapped promise will resolve to `null`
   *
   * @param query - The query to find the documents with.
   * @returns A wrapped promise that resolves to the found documents.
   */
  public findMany(query: TDocumentMongoFilterQuery<TBlueprint>): InstantiatingDataWrapper<Promise<TSchema[]>, TSchema> {
    const data = this.model
      .find({ ...query })
      .lean()
      .exec()

    return InstantiatingDataWrapper.fromData(data, { targetClass: this.classConstructor })
  }

  public async update(query: TMongoQuery<TBlueprint>): Promise<boolean> {
    const updateResult: TMongoUpdateResult = (await this.model
      .updateOne(query.filter, query.update, query.options)
      .lean()
      .exec()) as unknown as TMongoUpdateResult

    return !!updateResult.modifiedCount
  }

  public async updateAsIs(instance: TSchema): Promise<boolean> {
    const updateResult: TMongoUpdateResult = (await this.model
      .updateOne({ _id: instance._id }, instance)
      .lean()
      .exec()) as unknown as TMongoUpdateResult

    return !!updateResult.modifiedCount
  }

  public async updateMany(query: TMongoQuery<TBlueprint>): Promise<number> {
    return ((await this.model.updateMany(query.filter, query.update, query.options).lean().exec()) as unknown as TMongoUpdateResult).modifiedCount
  }
}

export abstract class AbstractPolymorphRepository<TSchema extends DBDocument, TBlueprint extends TSchema> extends AbstractBaseRepository<
  TSchema,
  TBlueprint
> {
  public findChildBy<K extends TSchema, KBlueprint extends K>(
    query: TDocumentMongoFilterQuery<KBlueprint>,
    options: TToInstanceOptions<K, TClassConstructor<K>, KBlueprint>
  ): InstantiatingDataWrapper<Promise<K>, K, TClassConstructor<K>, KBlueprint> {
    const data = this.model
      .findOne({ ...query })
      .lean()
      .exec() as Promise<K>

    return InstantiatingDataWrapper.fromData(data, options)
  }

  public findManyChildren<K extends TSchema, KBlueprint extends K>(
    query: TDocumentMongoFilterQuery<KBlueprint>,
    options: TToInstanceOptions<K, TClassConstructor<K>, KBlueprint>
  ): InstantiatingDataWrapper<Promise<K[]>, K, TClassConstructor<K>, KBlueprint> {
    const data = this.model
      .find({ ...query })
      .lean()
      .exec() as Promise<K[]>

    return InstantiatingDataWrapper.fromData(data, options)
  }

  public findChildById<K extends TSchema, KBlueprint extends K>(
    id: string,
    options: TToInstanceOptions<K, TClassConstructor<K>, KBlueprint>
  ): InstantiatingDataWrapper<Promise<K>, K, TClassConstructor<K>, KBlueprint> {
    // TODO: update type so that is accepts _id property
    // @ts-ignore
    return this.findChildBy({ _id: id }, options)
  }
}

export class AbstractSoftDeletableRepository<TSchema extends SoftDeletableDBDocument, TBlueprint extends TSchema> extends AbstractBaseRepository<
  TSchema,
  TBlueprint
> {
  protected static ACTIVE_FILTER = { _deletedAt: { $exists: false } }

  public findActiveById(id: string): InstantiatingDataWrapper<Promise<TSchema>, TSchema> {
    const query: TDocumentMongoFilterQuery<SoftDeletableDBDocumentBlueprint> = { _id: id, ...AbstractSoftDeletableRepository.ACTIVE_FILTER }
    return this.findBy(query as TDocumentMongoFilterQuery<TBlueprint>)
  }

  public findAllActives(): InstantiatingDataWrapper<Promise<TSchema[]>, TSchema> {
    const query: TDocumentMongoFilterQuery<SoftDeletableDBDocumentBlueprint> = { ...AbstractSoftDeletableRepository.ACTIVE_FILTER }
    return this.findManyActiveBy(query as TDocumentMongoFilterQuery<TBlueprint>)
  }

  public findActiveBy(query: TDocumentMongoFilterQuery<TBlueprint>): InstantiatingDataWrapper<Promise<TSchema>, TSchema> {
    return this.findBy({ ...AbstractSoftDeletableRepository.ACTIVE_FILTER, ...query })
  }

  public findManyActiveBy(query: TDocumentMongoFilterQuery<TBlueprint>): InstantiatingDataWrapper<Promise<TSchema[]>, TSchema> {
    return this.findMany({ ...AbstractSoftDeletableRepository.ACTIVE_FILTER, ...query })
  }
}

export class AbstractSoftDeletablePolymorphRepository<
  TSchema extends SoftDeletableDBDocument,
  TBlueprint extends TSchema
> extends AbstractPolymorphRepository<TSchema, TBlueprint> {
  protected static ACTIVE_FILTER = { _deletedAt: { $exists: false } }

  public findActiveChildById<K extends TSchema, KBlueprint extends K>(
    id: string,
    options: TToInstanceOptions<K, TClassConstructor<K>, KBlueprint>
  ): InstantiatingDataWrapper<Promise<K>, K, TClassConstructor<K>, KBlueprint> {
    // TODO: update type so that is accepts _id property
    // @ts-ignore
    return this.findActiveChildBy({ _id: id }, options)
  }

  public findAllActiveChildren<K extends TSchema, KBlueprint extends K>(
    options: TToInstanceOptions<K, TClassConstructor<K>, KBlueprint>
  ): InstantiatingDataWrapper<Promise<K[]>, K, TClassConstructor<K>, KBlueprint> {
    return this.findManyActiveChildrenBy({}, options)
  }

  public findActiveChildBy<K extends TSchema, KBlueprint extends K>(
    query: TDocumentMongoFilterQuery<KBlueprint>,
    options: TToInstanceOptions<K, TClassConstructor<K>, KBlueprint>
  ): InstantiatingDataWrapper<Promise<K>, K, TClassConstructor<K>, KBlueprint> {
    return this.findChildBy({ ...query, ...AbstractSoftDeletablePolymorphRepository.ACTIVE_FILTER }, options)
  }

  public findManyActiveChildrenBy<K extends TSchema, KBlueprint extends K>(
    query: TDocumentMongoFilterQuery<KBlueprint>,
    options: TToInstanceOptions<K, TClassConstructor<K>, KBlueprint>
  ): InstantiatingDataWrapper<Promise<K[]>, K, TClassConstructor<K>, KBlueprint> {
    return this.findManyChildren({ ...query, ...AbstractSoftDeletablePolymorphRepository.ACTIVE_FILTER }, options)
  }
}

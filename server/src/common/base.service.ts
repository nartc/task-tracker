import { InternalServerErrorException } from '@nestjs/common';
import { DocumentType, ReturnModelType } from '@typegoose/typegoose';
import { AnyParamConstructor } from '@typegoose/typegoose/lib/types';
import { MongoError } from 'mongodb';
import { DocumentQuery, FilterQuery, Query, Types } from 'mongoose';
import { BaseDocument } from './base.model';

type QueryList<T extends BaseDocument> = DocumentQuery<Array<DocumentType<T>>, DocumentType<T>>;
type QueryItem<T extends BaseDocument> = DocumentQuery<DocumentType<T>, DocumentType<T>>;

export abstract class BaseService<T extends BaseDocument> {
  protected model: ReturnModelType<AnyParamConstructor<T>>;

  protected constructor(_model: ReturnModelType<AnyParamConstructor<T>>) {
    this.model = _model;
  }

  protected static throwMongoError(err: MongoError): void {
    throw new InternalServerErrorException(err, err.errmsg);
  }

  protected static toObjectId(id: string): Types.ObjectId {
    try {
      return Types.ObjectId(id);
    } catch (e) {
      this.throwMongoError(e);
    }
  }

  protected get leanOptions() {
    return { virtuals: true, autopopulate: true };
  }

  createModel(doc?: Partial<T>): T {
    return new this.model(doc);
  }

  findAll(lean: boolean = false, autopopulate: boolean = false): QueryList<T> {
    const query = this.model.find();
    query.setOptions({ lean, autopopulate });
    return query;
  }

  findOne(lean: boolean = false, autopopulate: boolean = false): QueryItem<T> {
    let query = this.model.findOne();
    query = query.setOptions({ autopopulate });

    if (lean) {
      query = query.lean(this.leanOptions);
    }

    return query;
  }

  findById(id: string, lean: boolean = false, autopopulate: boolean = false): QueryItem<T> {
    const query = this.model.findById(BaseService.toObjectId(id));
    query.setOptions({ lean, autopopulate });
    return query;
  }

  async create(item: T): Promise<DocumentType<T>> {
    try {
      return await this.model.create(item);
    } catch (e) {
      BaseService.throwMongoError(e);
    }
  }

  delete(lean: boolean = false, autopopulate: boolean = false): QueryItem<T> {
    const query = this.model.findOneAndDelete();
    query.setOptions({ lean, autopopulate });
    return query;
  }

  deleteById(id: string, lean: boolean = false, autopopulate: boolean = false): QueryItem<T> {
    const query = this.model.findByIdAndDelete(BaseService.toObjectId(id));
    query.setOptions({ lean, autopopulate });
    return query;
  }

  update(item: T, lean: boolean = false, autopopulate: boolean = false): QueryItem<T> {
    return this.model
      .findByIdAndUpdate(BaseService.toObjectId(item.id), item, {
        new: true,
      })
      .setOptions({ lean, autopopulate });
  }

  count(filter: FilterQuery<DocumentType<T>> = {}): Query<number> {
    return this.model.count(filter);
  }

  async countAsync(filter: FilterQuery<DocumentType<T>> = {}): Promise<number> {
    try {
      return await this.count(filter);
    } catch (e) {
      BaseService.throwMongoError(e);
    }
  }
}

import { InternalServerErrorException } from '@nestjs/common';
import { DocumentType, ReturnModelType } from '@typegoose/typegoose';
import { AnyParamConstructor } from '@typegoose/typegoose/lib/types';
import { MongoError } from 'mongodb';
import { DocumentQuery, Query, Types } from 'mongoose';
import { BaseDocument } from './base.model';

export const _leanOptions = { virtuals: true, autopopulate: true };
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

  createModel(doc?: Partial<T>): T {
    return new this.model(doc);
  }

  findAll(filter = {}): QueryList<T> {
    return this.model.find(filter);
  }

  async findAllAsync(filter = {}): Promise<DocumentType<T>[]> {
    try {
      return await this.findAll(filter)
        .lean(_leanOptions)
        .exec();
    } catch (e) {
      BaseService.throwMongoError(e);
    }
  }

  findOne(filter = {}, disabledAutopopulate: boolean = false): QueryItem<T> {
    return this.model.findOne(filter, {}, { autopopulate: !disabledAutopopulate });
  }

  async findOneAsync(filter = {}): Promise<DocumentType<T>> {
    try {
      return await this.findOne(filter)
        .lean(_leanOptions)
        .exec();
    } catch (e) {
      BaseService.throwMongoError(e);
    }
  }

  findById(id: string): QueryItem<T> {
    return this.model.findById(BaseService.toObjectId(id));
  }

  async findByIdAsync(id: string): Promise<DocumentType<T>> {
    try {
      return await this.findById(id)
        .lean(_leanOptions)
        .exec();
    } catch (e) {
      BaseService.throwMongoError(e);
    }
  }

  async create(item: T): Promise<DocumentType<T>> {
    try {
      return await this.model.create(item);
    } catch (e) {
      BaseService.throwMongoError(e);
    }
  }

  delete(filter = {}): QueryItem<T> {
    return this.model.findOneAndDelete(filter);
  }

  async deleteAsync(filter = {}): Promise<DocumentType<T>> {
    try {
      return await this.delete(filter)
        .lean(_leanOptions)
        .exec();
    } catch (e) {
      BaseService.throwMongoError(e);
    }
  }

  deleteById(id: string): QueryItem<T> {
    return this.model.findByIdAndDelete(BaseService.toObjectId(id));
  }

  async deleteByIdAsync(id: string): Promise<DocumentType<T>> {
    try {
      return await this.deleteById(id)
        .lean(_leanOptions)
        .exec();
    } catch (e) {
      BaseService.throwMongoError(e);
    }
  }

  update(item: T): QueryItem<T> {
    return this.model.findByIdAndUpdate(BaseService.toObjectId(item.id), item, {
      new: true,
    });
  }

  async updateAsync(item: T): Promise<DocumentType<T>> {
    try {
      return await this.update(item)
        .lean(_leanOptions)
        .exec();
    } catch (e) {
      BaseService.throwMongoError(e);
    }
  }

  count(filter = {}): Query<number> {
    return this.model.count(filter);
  }

  async countAsync(filter = {}): Promise<number> {
    try {
      return await this.count(filter);
    } catch (e) {
      BaseService.throwMongoError(e);
    }
  }
}

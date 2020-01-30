import { ApiProperty } from '@nestjs/swagger';
import { buildSchema, prop } from '@typegoose/typegoose';
import { Schema } from 'mongoose';

export abstract class BaseDocument {
  @prop()
  createdAt?: Date;
  @prop()
  updatedAt?: Date;
  @prop({ required: true, default: true, index: true })
  isActive: boolean;
  id?: string;

  static get schema(): Schema {
    return buildSchema(<any>this, {
      timestamps: true,
      toJSON: {
        getters: true,
        virtuals: true,
      },
      id: true,
    });
  }

  static get modelName(): string {
    return this.name;
  }
}

export abstract class BaseVm {
  @ApiProperty({ type: String, format: 'date-time' })
  createdAt?: Date;
  @ApiProperty({ type: String, format: 'date-time' })
  updatedAt?: Date;
  id?: string;
  isActive: boolean;
}

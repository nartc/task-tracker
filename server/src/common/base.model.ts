import { AutoMap } from '@nartc/automapper';
import { ApiProperty } from '@nestjs/swagger';
import { buildSchema, prop } from '@typegoose/typegoose';
import { Schema } from 'mongoose';

export abstract class BaseDocument {
  @prop()
  @AutoMap()
  createdAt?: Date;
  @prop()
  @AutoMap()
  updatedAt?: Date;
  @prop({ required: true, default: true, index: true })
  @AutoMap()
  isActive: boolean;
  @AutoMap()
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
  @AutoMap()
  createdAt?: Date;
  @ApiProperty({ type: String, format: 'date-time' })
  @AutoMap()
  updatedAt?: Date;
  @AutoMap()
  id?: string;
  @AutoMap()
  isActive: boolean;
}

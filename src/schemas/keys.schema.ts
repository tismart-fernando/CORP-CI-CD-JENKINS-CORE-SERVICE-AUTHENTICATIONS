import { Prop, Schema, SchemaFactory, raw } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { AuditPropertiesSchema } from '../common/schemas/audit-properties.schema';
import { SCHEMAS } from '../const/schema.name.const';

export type KeysDocument = Keys & mongoose.Document;

@Schema({ collection: SCHEMAS.KEYS, autoIndex: true })
export class Keys {
  @Prop()
  requestHash: string;

  @Prop(raw({ x1: String, x2: String }))
  keys: { x1: string; x2: string };

  @Prop({
    type: AuditPropertiesSchema,
    default: () => new AuditPropertiesSchema(),
  })
  auditProperties: AuditPropertiesSchema;
}

export const KeysSchema = SchemaFactory.createForClass(Keys);

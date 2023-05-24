import { Prop, Schema, SchemaFactory, raw } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { AuditPropertiesSchema } from '../common/schemas/audit-properties.schema';
import { SCHEMAS } from '../const/schema.name.const';

export type SecuritiesDocument = Securities & mongoose.Document;

@Schema({ collection: SCHEMAS.SECURITIES, autoIndex: true })
export class Securities extends AuditPropertiesSchema {
  @Prop({
    type: mongoose.Types.ObjectId,
  })
  idUser: mongoose.Types.ObjectId;

  @Prop(
    raw({
      type: [],
    }),
  )
  tokens: string[];
}

export const SecuritiesSchema = SchemaFactory.createForClass(Securities);

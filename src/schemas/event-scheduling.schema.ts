import { Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { SCHEMAS } from '../const/schema.name.const';
import { AuditPropertiesSchema } from '../common/schemas/audit-properties.schema';

export type EventSchedulingDocument<T> = EventScheduling<T> & mongoose.Document;

@Schema({ collection: SCHEMAS.EVENT_SCHEDULING, autoIndex: true })
export class EventScheduling<T> extends AuditPropertiesSchema {}

export const EventSchedulingSchema =
  SchemaFactory.createForClass(EventScheduling);

import { Prop, Schema, SchemaFactory, raw } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { SCHEMAS } from '../const/schema.name.const';
import { AuditPropertiesSchema } from '../common/schemas/audit-properties.schema';

export type DashboardDocument<T> = Dashboard<T> & mongoose.Document;

@Schema({ collection: SCHEMAS.DASHBOARDS, autoIndex: true })
export class Dashboard<T> extends AuditPropertiesSchema {
  @Prop(
    raw({
      type: [
        {
          idChallenged: mongoose.Schema.Types.ObjectId,
          name: String,
          place: String,
          created: String,
          countParticipant: Number,
          statusDescription: String,
        },
      ],
    }),
  )
  challenged: {
    idChallenged: mongoose.Schema.Types.ObjectId;
    name: string;
    place: string;
    created: string;
    countParticipant: number;
    statusDescription: string;
  }[];

  @Prop(
    raw({
      type: [
        {
          idScheduled: mongoose.Schema.Types.ObjectId,
          name: String,
          place: String,
          created: String,
          countParticipant: Number,
          statusDescription: String,
        },
      ],
    }),
  )
  scheduled: {
    idScheduled: mongoose.Schema.Types.ObjectId;
    name: string;
    place: string;
    created: string;
    countParticipant: number;
    statusDescription: string;
  }[];

  @Prop(
    raw({
      type: [
        {
          idUser: mongoose.Schema.Types.ObjectId,
          firstName: String,
          lastName: String,
        },
      ],
    }),
  )
  users: {
    idUser: mongoose.Schema.Types.ObjectId;
    firstName: string;
    lastName: string;
  }[];
}

export const DashboardSchema = SchemaFactory.createForClass(Dashboard);

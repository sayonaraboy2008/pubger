import mongoose, { Schema, Document } from 'mongoose';

export interface IClassicResult extends Document {
  tournamentId: string;
  mapName: string;
  matchNumber: number;
  entries: Array<{
    groupId: string;
    kills: number;
    placement: number;
  }>;
}

const ClassicResultSchema: Schema = new Schema({
  tournamentId: { type: String, required: true, ref: 'Tournament' },
  mapName: { type: String, required: true },
  matchNumber: { type: Number, required: true },
  entries: [{
    groupId: { type: String, required: true },
    kills: { type: Number, default: 0 },
    placement: { type: Number, default: 0 }
  }]
});

ClassicResultSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id;
  }
});

export default mongoose.model<IClassicResult>('ClassicResult', ClassicResultSchema);

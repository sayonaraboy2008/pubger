import mongoose, { Schema, Document } from 'mongoose';

export interface IClassicResult extends Document {
  id: string;
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
  _id: { type: String },
  tournamentId: { type: String, required: true },
  mapName: { type: String, required: true },
  matchNumber: { type: Number, required: true },
  entries: [{
    _id: false,
    groupId: { type: String, required: true },
    kills: { type: Number, default: 0 },
    placement: { type: Number, default: 0 }
  }]
}, { _id: false });

ClassicResultSchema.virtual('id').get(function () {
  return this._id;
});

ClassicResultSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
});

export default mongoose.model<IClassicResult>('ClassicResult', ClassicResultSchema);

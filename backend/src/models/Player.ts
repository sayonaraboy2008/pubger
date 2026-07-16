import mongoose, { Schema, Document } from 'mongoose';

export interface IPlayer extends Document {
  id: string;
  tournamentId: string;
  groupId: string;
  name: string;
  kills: number;
  placement: number;
}

const PlayerSchema: Schema = new Schema({
  _id: { type: String },
  tournamentId: { type: String, required: true },
  groupId: { type: String, required: true },
  name: { type: String, required: true },
  kills: { type: Number, default: 0 },
  placement: { type: Number, default: 0 }
}, { _id: false });

PlayerSchema.virtual('id').get(function () {
  return this._id;
});

PlayerSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
});

export default mongoose.model<IPlayer>('Player', PlayerSchema);

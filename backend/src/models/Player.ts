import mongoose, { Schema, Document } from 'mongoose';

export interface IPlayer extends Document {
  tournamentId: string;
  groupId: string;
  name: string;
  kills: number;
  placement: number;
}

const PlayerSchema: Schema = new Schema({
  tournamentId: { type: String, required: true, ref: 'Tournament' },
  groupId: { type: String, required: true, ref: 'Group' },
  name: { type: String, required: true },
  kills: { type: Number, default: 0 },
  placement: { type: Number, default: 0 }
});

PlayerSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id;
  }
});

export default mongoose.model<IPlayer>('Player', PlayerSchema);

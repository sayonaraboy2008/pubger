import mongoose, { Schema, Document } from 'mongoose';

export interface IMatch extends Document {
  id: string;
  tournamentId: string;
  round: number;
  position: number;
  player1Id: string | null;
  player2Id: string | null;
  score1: number;
  score2: number;
  winnerId: string | null;
}

const MatchSchema: Schema = new Schema({
  _id: { type: String },
  tournamentId: { type: String, required: true },
  round: { type: Number, required: true },
  position: { type: Number, required: true },
  player1Id: { type: String, default: null },
  player2Id: { type: String, default: null },
  score1: { type: Number, default: 0 },
  score2: { type: Number, default: 0 },
  winnerId: { type: String, default: null }
}, { _id: false });

MatchSchema.virtual('id').get(function () {
  return this._id;
});

MatchSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
});

export default mongoose.model<IMatch>('Match', MatchSchema);

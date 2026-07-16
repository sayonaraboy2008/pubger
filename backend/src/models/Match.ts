import mongoose, { Schema, Document } from 'mongoose';

export interface IMatch extends Document {
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
  tournamentId: { type: String, required: true, ref: 'Tournament' },
  round: { type: Number, required: true },
  position: { type: Number, required: true },
  player1Id: { type: String, default: null },
  player2Id: { type: String, default: null },
  score1: { type: Number, default: 0 },
  score2: { type: Number, default: 0 },
  winnerId: { type: String, default: null }
});

MatchSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id;
  }
});

export default mongoose.model<IMatch>('Match', MatchSchema);

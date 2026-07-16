import mongoose, { Schema, Document } from 'mongoose';

export interface ITournament extends Document {
  id: string;
  name: string;
  description: string;
  game: string;
  status: 'upcoming' | 'ongoing' | 'completed';
  startDate: string;
  endDate: string;
  prizePool: string;
  location: string;
  createdAt: string;
  scoring: {
    killPts: number;
    placementPts: number[];
  };
  mode: 'tdm' | 'classic';
  tdmFormat: '1v1' | '2v2' | '3v3' | '4v4';
  maxPlayers: number;
}

const TournamentSchema: Schema = new Schema({
  _id: { type: String },
  name: { type: String, required: true },
  description: { type: String, default: '' },
  game: { type: String, default: 'PUBG Mobile' },
  status: { type: String, enum: ['upcoming', 'ongoing', 'completed'], default: 'upcoming' },
  startDate: { type: String, default: '' },
  endDate: { type: String, default: '' },
  prizePool: { type: String, default: '' },
  location: { type: String, default: '' },
  createdAt: { type: String, default: () => new Date().toISOString() },
  scoring: {
    killPts: { type: Number, default: 1 },
    placementPts: { type: [Number], default: [15, 12, 10, 8, 6, 4, 2, 1, 1, 1] }
  },
  mode: { type: String, enum: ['tdm', 'classic'], default: 'tdm' },
  tdmFormat: { type: String, enum: ['1v1', '2v2', '3v3', '4v4'], default: '4v4' },
  maxPlayers: { type: Number, default: 32 }
}, { _id: false });

// Return id (= _id) in JSON
TournamentSchema.virtual('id').get(function () {
  return this._id;
});

TournamentSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
});

export default mongoose.model<ITournament>('Tournament', TournamentSchema);

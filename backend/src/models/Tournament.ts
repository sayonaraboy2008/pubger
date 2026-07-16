import mongoose, { Schema, Document } from 'mongoose';

export interface ITournament extends Document {
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
  name: { type: String, required: true },
  description: { type: String },
  game: { type: String, default: 'PUBG Mobile' },
  status: { type: String, enum: ['upcoming', 'ongoing', 'completed'], default: 'upcoming' },
  startDate: { type: String },
  endDate: { type: String },
  prizePool: { type: String },
  location: { type: String },
  createdAt: { type: String, default: () => new Date().toISOString() },
  scoring: {
    killPts: { type: Number, default: 1 },
    placementPts: { type: [Number], default: [15, 12, 10, 8, 6, 4, 2, 1, 1, 1] }
  },
  mode: { type: String, enum: ['tdm', 'classic'], default: 'tdm' },
  tdmFormat: { type: String, enum: ['1v1', '2v2', '3v3', '4v4'], default: '4v4' },
  maxPlayers: { type: Number, default: 32 }
});

// To return id instead of _id in JSON
TournamentSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id;
  }
});

export default mongoose.model<ITournament>('Tournament', TournamentSchema);

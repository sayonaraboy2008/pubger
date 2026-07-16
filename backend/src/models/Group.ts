import mongoose, { Schema, Document } from 'mongoose';

export interface IGroup extends Document {
  tournamentId: string;
  name: string;
  tag: string;
}

const GroupSchema: Schema = new Schema({
  tournamentId: { type: String, required: true, ref: 'Tournament' },
  name: { type: String, required: true },
  tag: { type: String, required: true }
});

GroupSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id;
  }
});

export default mongoose.model<IGroup>('Group', GroupSchema);

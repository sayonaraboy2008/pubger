import mongoose, { Schema, Document } from 'mongoose';

export interface IGroup extends Document {
  id: string;
  tournamentId: string;
  name: string;
  tag: string;
}

const GroupSchema: Schema = new Schema({
  _id: { type: String },
  tournamentId: { type: String, required: true },
  name: { type: String, required: true },
  tag: { type: String, required: true }
}, { _id: false });

GroupSchema.virtual('id').get(function () {
  return this._id;
});

GroupSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
});

export default mongoose.model<IGroup>('Group', GroupSchema);

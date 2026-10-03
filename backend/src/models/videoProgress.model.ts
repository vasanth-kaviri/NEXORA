import mongoose, { Document, Schema, Model } from 'mongoose';

export interface IVideoNote {
  timestampSeconds: number;
  text: string;
  createdAt: Date;
}

export interface IUserVideoProgress extends Document {
  userId: mongoose.Types.ObjectId;
  videoId: string;
  domainId: string;
  lastPositionSeconds: number;
  totalDurationSeconds: number;
  watchPercentage: number;
  completed: boolean;
  notes: IVideoNote[];
  completedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const VideoNoteSchema = new Schema<IVideoNote>(
  {
    timestampSeconds: { type: Number, required: true },
    text: { type: String, required: true, trim: true },
    createdAt: { type: Date, default: Date.now },
  },
  { _id: false },
);

const UserVideoProgressSchema = new Schema<IUserVideoProgress>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    videoId: { type: String, required: true, index: true },
    domainId: { type: String, required: true, index: true },
    lastPositionSeconds: { type: Number, default: 0 },
    totalDurationSeconds: { type: Number, default: 0 },
    watchPercentage: { type: Number, default: 0, min: 0, max: 100 },
    completed: { type: Boolean, default: false },
    notes: { type: [VideoNoteSchema], default: [] },
    completedAt: { type: Date },
  },
  {
    timestamps: true,
  },
);

UserVideoProgressSchema.index({ userId: 1, videoId: 1 }, { unique: true });

export const UserVideoProgress: Model<IUserVideoProgress> =
  mongoose.models.UserVideoProgress ||
  mongoose.model<IUserVideoProgress>('UserVideoProgress', UserVideoProgressSchema);

export default UserVideoProgress;

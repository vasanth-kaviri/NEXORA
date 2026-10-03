import mongoose, { Document, Schema, Model } from 'mongoose';

export interface INotification extends Document {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  title: string;
  message: string;
  type: 'SYSTEM' | 'APPLICATION' | 'HACKATHON' | 'INTERVIEW' | 'ROADMAP' | 'SCHOLARSHIP';
  read: boolean;
  link?: string;
  createdAt: Date;
  updatedAt: Date;
}

const NotificationSchema = new Schema<INotification>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    message: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ['SYSTEM', 'APPLICATION', 'HACKATHON', 'INTERVIEW', 'ROADMAP', 'SCHOLARSHIP'],
      default: 'SYSTEM',
    },
    read: {
      type: Boolean,
      default: false,
    },
    link: {
      type: String,
      default: '/dashboard',
    },
  },
  {
    timestamps: true,
  }
);

NotificationSchema.index({ userId: 1, read: 1, createdAt: -1 });

export const Notification: Model<INotification> = mongoose.model<INotification>(
  'Notification',
  NotificationSchema
);

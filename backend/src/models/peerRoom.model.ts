import mongoose, { Document, Schema, Model } from 'mongoose';

export interface IPeerParticipant {
  userId: mongoose.Types.ObjectId;
  name: string;
  avatar?: string;
  role?: string;
  joinedAt: Date;
  isSpeaking?: boolean;
}

export interface IPeerMessage {
  senderId: mongoose.Types.ObjectId;
  senderName: string;
  senderAvatar?: string;
  text: string;
  timestamp: Date;
}

export interface IPeerRoom extends Document {
  _id: mongoose.Types.ObjectId;
  roomId: string;
  title: string;
  topic: string;
  hostUserId: mongoose.Types.ObjectId;
  hostName: string;
  hostAvatar?: string;
  activeParticipants: IPeerParticipant[];
  maxParticipants: number;
  isPrivate: boolean;
  pomodoro: {
    isRunning: boolean;
    minutesRemaining: number;
    mode: 'FOCUS' | 'BREAK';
  };
  messages: IPeerMessage[];
  status: 'ACTIVE' | 'CONCLUDED';
  createdAt: Date;
  updatedAt: Date;
}

const PeerRoomSchema = new Schema<IPeerRoom>(
  {
    roomId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    topic: {
      type: String,
      required: true,
      trim: true,
      default: 'Full-Stack Engineering & DSA',
    },
    hostUserId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    hostName: {
      type: String,
      required: true,
      default: 'NEXORA Member',
    },
    hostAvatar: {
      type: String,
      default: '',
    },
    activeParticipants: [
      {
        userId: { type: Schema.Types.ObjectId, ref: 'User' },
        name: { type: String, required: true },
        avatar: String,
        role: { type: String, default: 'Member' },
        joinedAt: { type: Date, default: Date.now },
        isSpeaking: { type: Boolean, default: false },
      },
    ],
    maxParticipants: {
      type: Number,
      default: 8,
    },
    isPrivate: {
      type: Boolean,
      default: false,
    },
    pomodoro: {
      isRunning: { type: Boolean, default: true },
      minutesRemaining: { type: Number, default: 25 },
      mode: { type: String, enum: ['FOCUS', 'BREAK'], default: 'FOCUS' },
    },
    messages: [
      {
        senderId: { type: Schema.Types.ObjectId, ref: 'User' },
        senderName: { type: String, required: true },
        senderAvatar: String,
        text: { type: String, required: true },
        timestamp: { type: Date, default: Date.now },
      },
    ],
    status: {
      type: String,
      enum: ['ACTIVE', 'CONCLUDED'],
      default: 'ACTIVE',
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

export const PeerRoom: Model<IPeerRoom> = mongoose.model<IPeerRoom>(
  'PeerRoom',
  PeerRoomSchema
);

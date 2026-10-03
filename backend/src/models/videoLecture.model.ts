import mongoose, { Document, Schema, Model } from 'mongoose';

export type VideoProvider = 'YOUTUBE' | 'VIMEO' | 'DAILY' | 'HLS';
export type VideoDifficulty = 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';

export interface IVideoChapter {
  title: string;
  timestampSeconds: number;
}

export interface IVideoLecture extends Document {
  videoId: string;
  title: string;
  description: string;
  provider: VideoProvider;
  domainId: string;
  milestoneId?: string;
  channelTitle: string;
  durationMinutes: number;
  thumbnailUrl: string;
  videoUrl: string;
  embedUrl: string;
  chapters: IVideoChapter[];
  keyTakeaways: string[];
  skills: string[];
  difficulty: VideoDifficulty;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const VideoChapterSchema = new Schema<IVideoChapter>(
  {
    title: { type: String, required: true },
    timestampSeconds: { type: Number, required: true },
  },
  { _id: false },
);

const VideoLectureSchema = new Schema<IVideoLecture>(
  {
    videoId: { type: String, required: true, unique: true, index: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    provider: {
      type: String,
      enum: ['YOUTUBE', 'VIMEO', 'DAILY', 'HLS'],
      default: 'YOUTUBE',
    },
    domainId: { type: String, required: true, index: true },
    milestoneId: { type: String, index: true },
    channelTitle: { type: String, default: 'NEXORA Masterclasses' },
    durationMinutes: { type: Number, default: 60 },
    thumbnailUrl: { type: String, default: '' },
    videoUrl: { type: String, required: true },
    embedUrl: { type: String, required: true },
    chapters: { type: [VideoChapterSchema], default: [] },
    keyTakeaways: { type: [String], default: [] },
    skills: { type: [String], default: [] },
    difficulty: {
      type: String,
      enum: ['BEGINNER', 'INTERMEDIATE', 'ADVANCED'],
      default: 'INTERMEDIATE',
    },
    order: { type: Number, default: 1 },
  },
  {
    timestamps: true,
  },
);

export const VideoLecture: Model<IVideoLecture> =
  mongoose.models.VideoLecture || mongoose.model<IVideoLecture>('VideoLecture', VideoLectureSchema);

export default VideoLecture;

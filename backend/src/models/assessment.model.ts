import mongoose, { Document, Schema, Model } from 'mongoose';

export interface IAssessmentResponse {
  questionId?: string | number;
  question: string;
  userAnswer?: string | number;
  correctAnswer?: string | number;
  isCorrect: boolean;
  topic?: string;
  explanation?: string;
}

export interface ISkillVector {
  frontend?: number;
  backend?: number;
  database?: number;
  systemDesign?: number;
  devops?: number;
  security?: number;
  aiMl?: number;
  overallScore?: number;
}

export interface IAssessment extends Document {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  type: 'QUIZ' | 'ASSESSMENT' | 'SKILL_GAP' | 'TASK';
  track: string;
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  percentage: number;
  passed: boolean;
  timeSpentSeconds: number;
  responses: IAssessmentResponse[];
  skillVector?: ISkillVector;
  completedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const AssessmentSchema = new Schema<IAssessment>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    type: {
      type: String,
      enum: ['QUIZ', 'ASSESSMENT', 'SKILL_GAP', 'TASK'],
      default: 'QUIZ',
      index: true,
    },
    track: {
      type: String,
      required: true,
      trim: true,
      default: 'Full-Stack Web Engineering',
    },
    score: {
      type: Number,
      required: true,
      default: 0,
    },
    totalQuestions: {
      type: Number,
      required: true,
      default: 0,
    },
    correctAnswers: {
      type: Number,
      required: true,
      default: 0,
    },
    percentage: {
      type: Number,
      required: true,
      default: 0,
    },
    passed: {
      type: Boolean,
      default: true,
    },
    timeSpentSeconds: {
      type: Number,
      default: 0,
    },
    responses: [
      {
        questionId: Schema.Types.Mixed,
        question: { type: String, required: true },
        userAnswer: Schema.Types.Mixed,
        correctAnswer: Schema.Types.Mixed,
        isCorrect: { type: Boolean, required: true },
        topic: String,
        explanation: String,
      },
    ],
    skillVector: {
      frontend: { type: Number, default: 75 },
      backend: { type: Number, default: 70 },
      database: { type: Number, default: 65 },
      systemDesign: { type: Number, default: 60 },
      devops: { type: Number, default: 65 },
      security: { type: Number, default: 70 },
      aiMl: { type: Number, default: 50 },
      overallScore: { type: Number, default: 70 },
    },
    completedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

AssessmentSchema.index({ userId: 1, type: 1, completedAt: -1 });

export const Assessment: Model<IAssessment> = mongoose.model<IAssessment>(
  'Assessment',
  AssessmentSchema
);

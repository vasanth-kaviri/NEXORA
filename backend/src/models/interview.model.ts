import mongoose, { Document, Schema, Model } from 'mongoose';

export interface IInterviewScorecardMetric {
  label: string;
  score: number;
  status: string;
}

export interface IInterviewScorecard {
  overallScore: number;
  verdict: string;
  role: string;
  completedQuestions: number;
  timestamp: string;
  proctoringAlerts: number;
  metrics: IInterviewScorecardMetric[];
  aiObservations: string[];
}

export interface IInterviewAnswer {
  questionId: string | number;
  question: string;
  company?: string;
  type?: string;
  answerContent?: string;
  feedback?: {
    clarity?: string | number;
    technicalDepth?: string | number;
    starStructure?: string | number;
    overallScore?: number;
    wordCount?: number;
    matchedKeywords?: string[];
    notes?: string;
  };
}

export interface IInterview extends Document {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  role: string;
  status: 'IN_PROGRESS' | 'COMPLETED' | 'ABORTED';
  overallScore: number;
  verdict: string;
  alertCount: number;
  scorecard: IInterviewScorecard;
  answers: IInterviewAnswer[];
  completedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const InterviewSchema = new Schema<IInterview>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    role: {
      type: String,
      required: true,
      trim: true,
      default: 'Full-Stack Developer',
    },
    status: {
      type: String,
      enum: ['IN_PROGRESS', 'COMPLETED', 'ABORTED'],
      default: 'COMPLETED',
      index: true,
    },
    overallScore: {
      type: Number,
      required: true,
      default: 0,
    },
    verdict: {
      type: String,
      default: 'HIRE / ADVANCED COMPETENCY',
    },
    alertCount: {
      type: Number,
      default: 0,
    },
    scorecard: {
      overallScore: Number,
      verdict: String,
      role: String,
      completedQuestions: Number,
      timestamp: String,
      proctoringAlerts: Number,
      metrics: [
        {
          label: String,
          score: Number,
          status: String,
        },
      ],
      aiObservations: [String],
    },
    answers: [
      {
        questionId: Schema.Types.Mixed,
        question: String,
        company: String,
        type: String,
        answerContent: String,
        feedback: Schema.Types.Mixed,
      },
    ],
    completedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

InterviewSchema.index({ userId: 1, completedAt: -1 });

export const Interview: Model<IInterview> = mongoose.model<IInterview>(
  'Interview',
  InterviewSchema
);

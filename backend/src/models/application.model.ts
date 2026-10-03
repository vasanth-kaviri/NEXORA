import mongoose, { Document, Schema, Model } from 'mongoose';

export interface IApplicantSnapshot {
  fullName: string;
  name?: string; // Legacy compatibility alias
  email: string;
  phone: string;
  resumeScore?: number;
  matchedSkills?: string[];
  resumeName?: string;
  education?: string;
  coverNote?: string;
}

export type ApplicationStatus =
  | 'SUBMITTED'
  | 'IN_REVIEW'
  | 'TECHNICAL_SCREENING'
  | 'INTERVIEW_SCHEDULED'
  | 'OFFER_EXTENDED'
  | 'REJECTED';

export interface ITimelineEntry {
  stage: ApplicationStatus | string;
  timestamp: Date;
  recruiterNotes: string;
  actionTakenBy: string;
}

export interface IRecruiterFeedback {
  technicalRating?: number;
  strengths?: string[];
  growthAreas?: string[];
}

export interface IApplication extends Document {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  opportunityId: mongoose.Types.ObjectId | string;
  company: string;
  role: string;
  title: string;
  opportunityType: 'JOB' | 'INTERNSHIP' | 'SCHOLARSHIP';
  applicantSnapshot: IApplicantSnapshot;
  status: ApplicationStatus;
  timeline: ITimelineEntry[];
  recruiterFeedback?: IRecruiterFeedback;
  stageIndex?: number;
  stages?: string[];
  atsScore?: number;
  jobDetails?: Record<string, any>;
  appliedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

export type IApplicationModel = Model<IApplication>;

const TimelineEntrySchema = new Schema<ITimelineEntry>(
  {
    stage: {
      type: String,
      required: true,
      trim: true,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
    recruiterNotes: {
      type: String,
      required: true,
      trim: true,
    },
    actionTakenBy: {
      type: String,
      default: 'Recruiter Engine',
      trim: true,
    },
  },
  { _id: false }
);

const RecruiterFeedbackSchema = new Schema<IRecruiterFeedback>(
  {
    technicalRating: {
      type: Number,
      min: 1,
      max: 10,
    },
    strengths: {
      type: [String],
      default: [],
    },
    growthAreas: {
      type: [String],
      default: [],
    },
  },
  { _id: false }
);

const ApplicationSchema = new Schema<IApplication, IApplicationModel>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
      index: true,
    },
    opportunityId: {
      type: Schema.Types.Mixed,
      ref: 'Job',
      required: [true, 'Opportunity ID is required'],
      index: true,
    },
    company: {
      type: String,
      required: [true, 'Company name is required'],
      trim: true,
    },
    role: {
      type: String,
      required: [true, 'Role title is required'],
      trim: true,
    },
    title: {
      type: String,
      trim: true,
    },
    opportunityType: {
      type: String,
      enum: ['JOB', 'INTERNSHIP', 'SCHOLARSHIP'],
      default: 'JOB',
      required: true,
      index: true,
    },
    applicantSnapshot: {
      fullName: { type: String, trim: true },
      name: { type: String, trim: true },
      email: { type: String, required: true, trim: true },
      phone: { type: String, default: '', trim: true },
      resumeScore: { type: Number, default: 85 },
      matchedSkills: { type: [String], default: [] },
      resumeName: { type: String, default: 'Resume_Candidate.pdf' },
      education: { type: String, default: '' },
      coverNote: { type: String, default: '' },
    },
    status: {
      type: String,
      enum: [
        'SUBMITTED',
        'IN_REVIEW',
        'TECHNICAL_SCREENING',
        'INTERVIEW_SCHEDULED',
        'OFFER_EXTENDED',
        'REJECTED',
      ],
      default: 'SUBMITTED',
      index: true,
    },
    timeline: {
      type: [TimelineEntrySchema],
      default: [],
    },
    recruiterFeedback: {
      type: RecruiterFeedbackSchema,
      default: () => ({}),
    },
    stageIndex: {
      type: Number,
      default: 0,
    },
    stages: {
      type: [String],
      default: ['Submitted', 'In Review', 'Technical Screening', 'Interview Scheduled', 'Final Decision'],
    },
    atsScore: {
      type: Number,
      default: 86,
    },
    jobDetails: {
      type: Schema.Types.Mixed,
      default: {},
    },
    appliedAt: {
      type: Date,
      default: Date.now,
      index: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform(_doc, ret: Record<string, unknown>) {
        ret['id'] = ret['_id'] ? ret['_id'].toString() : undefined;
        ret['__v'] = undefined;
        return ret;
      },
    },
  }
);

// Pre-save hook: ensure role and title are synchronized, and fullName defaults
ApplicationSchema.pre('save', function (next) {
  if (!this.role && this.title) {
    this.role = this.title;
  }
  if (!this.title && this.role) {
    this.title = this.role;
  }
  if (this.applicantSnapshot) {
    if (!this.applicantSnapshot.fullName && this.applicantSnapshot.name) {
      this.applicantSnapshot.fullName = this.applicantSnapshot.name;
    }
    if (!this.applicantSnapshot.name && this.applicantSnapshot.fullName) {
      this.applicantSnapshot.name = this.applicantSnapshot.fullName;
    }
  }
  next();
});

// Compound index for idempotency and rapid timeline queries
ApplicationSchema.index({ userId: 1, opportunityId: 1 });
ApplicationSchema.index({ userId: 1, updatedAt: -1 });
ApplicationSchema.index({ userId: 1, appliedAt: -1 });

export const Application = mongoose.model<IApplication, IApplicationModel>('Application', ApplicationSchema);
export default Application;

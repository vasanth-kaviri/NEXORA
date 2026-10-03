import mongoose, { Document, Schema, Model } from 'mongoose';

export interface IJob extends Document {
  _id: mongoose.Types.ObjectId;
  title: string;
  company: string;
  role: string;
  domain: string;
  location: string;
  type: 'Full-Time' | 'Internship';
  remote: boolean;
  experienceLevel: string;
  salary: string;
  deadline: Date;
  requiredSkills: string[];
  mncTier: string;
  desc?: string;
  responsibilities?: string[];
  requirements?: string[];
  logo?: string;
  batch?: string;
  createdAt: Date;
  updatedAt: Date;
}

export type IJobModel = Model<IJob>;

const JobSchema = new Schema<IJob, IJobModel>(
  {
    title: {
      type: String,
      required: [true, 'Job title is required'],
      trim: true,
      index: true,
    },
    company: {
      type: String,
      required: [true, 'Company name is required'],
      trim: true,
      index: true,
    },
    role: {
      type: String,
      required: [true, 'Role is required'],
      trim: true,
      index: true,
    },
    domain: {
      type: String,
      required: [true, 'Domain is required'],
      trim: true,
      index: true,
    },
    location: {
      type: String,
      required: [true, 'Location is required'],
      trim: true,
    },
    type: {
      type: String,
      enum: ['Full-Time', 'Internship'],
      required: [true, 'Job type is required'],
      index: true,
    },
    remote: {
      type: Boolean,
      default: false,
      index: true,
    },
    experienceLevel: {
      type: String,
      default: 'Entry-Level',
    },
    salary: {
      type: String,
      required: [true, 'Salary is required'],
      trim: true,
    },
    deadline: {
      type: Date,
      required: [true, 'Deadline is required'],
      index: true,
    },
    requiredSkills: {
      type: [String],
      required: [true, 'Required skills are required'],
      index: true,
    },
    mncTier: {
      type: String,
      default: 'Tier-1 MNC',
      index: true,
    },
    desc: {
      type: String,
      default: '',
    },
    responsibilities: {
      type: [String],
      default: [],
    },
    requirements: {
      type: [String],
      default: [],
    },
    logo: {
      type: String,
      default: '',
    },
    batch: {
      type: String,
      default: '2026 Batch',
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

// Compound index for high performance search and filtering
JobSchema.index({ domain: 1, type: 1, remote: 1 });
JobSchema.index({ title: 'text', company: 'text', role: 'text', domain: 'text' });

export const Job = mongoose.model<IJob, IJobModel>('Job', JobSchema);
export default Job;

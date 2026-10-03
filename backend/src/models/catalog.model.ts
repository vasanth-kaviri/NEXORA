import mongoose, { Document, Schema, Model } from 'mongoose';

// --- Resource Schema ----------------------------------------------------------
export interface IResource extends Document {
  _id: mongoose.Types.ObjectId;
  title: string;
  category: string;
  type: string;
  duration?: string;
  link: string;
  description: string;
  tags: string[];
  rating: number;
  featured: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ResourceSchema = new Schema<IResource>(
  {
    title: { type: String, required: true, trim: true },
    category: { type: String, required: true, trim: true, index: true },
    type: { type: String, default: 'Documentation' },
    duration: String,
    link: { type: String, required: true },
    description: { type: String, default: '' },
    tags: [String],
    rating: { type: Number, default: 4.8 },
    featured: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const Resource: Model<IResource> = mongoose.model<IResource>('Resource', ResourceSchema);

// --- Hackathon Schema ---------------------------------------------------------
export interface IHackathon extends Document {
  _id: mongoose.Types.ObjectId;
  title: string;
  organizer: string;
  domain: string;
  prizePool: string;
  deadline: Date;
  location: string;
  registeredTeams: number;
  tags: string[];
  applyUrl: string;
  featured: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const HackathonSchema = new Schema<IHackathon>(
  {
    title: { type: String, required: true, trim: true },
    organizer: { type: String, required: true, trim: true },
    domain: { type: String, required: true, index: true },
    prizePool: { type: String, default: '$10,000' },
    deadline: { type: Date, required: true },
    location: { type: String, default: 'Global (Online)' },
    registeredTeams: { type: Number, default: 450 },
    tags: [String],
    applyUrl: { type: String, default: '#' },
    featured: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const Hackathon: Model<IHackathon> = mongoose.model<IHackathon>('Hackathon', HackathonSchema);

// --- Scholarship Schema -------------------------------------------------------
export interface IScholarship extends Document {
  _id: mongoose.Types.ObjectId;
  title: string;
  provider: string;
  amount: string;
  deadline: Date;
  eligibility: string;
  targetDomain: string;
  country: string;
  applyUrl: string;
  featured: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ScholarshipSchema = new Schema<IScholarship>(
  {
    title: { type: String, required: true, trim: true },
    provider: { type: String, required: true, trim: true },
    amount: { type: String, default: '$10,000' },
    deadline: { type: Date, required: true },
    eligibility: { type: String, default: 'Open to enrolled undergraduate and graduate STEM students' },
    targetDomain: { type: String, default: 'Engineering & Computing' },
    country: { type: String, default: 'Global' },
    applyUrl: { type: String, default: '#' },
    featured: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const Scholarship: Model<IScholarship> = mongoose.model<IScholarship>('Scholarship', ScholarshipSchema);

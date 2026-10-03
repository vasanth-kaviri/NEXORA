import mongoose, { Document, Schema, Model } from 'mongoose';

export type MilestoneStatus = 'LOCKED' | 'AVAILABLE' | 'IN_PROGRESS' | 'COMPLETED';
export type ResourceType = 'DOCS' | 'VIDEO' | 'ARTICLE' | 'PROJECT';

export interface IRoadmapResource {
  title: string;
  url: string;
  type: ResourceType;
}

export interface ICodeSnippet {
  language: string;
  code: string;
  title: string;
}

export interface IQuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
}

export interface IMilestone {
  milestoneId: string;
  title: string;
  description: string;
  estimatedHours: number;
  skills: string[];
  resources: IRoadmapResource[];
  status: MilestoneStatus;
  completedAt?: Date;

  // Educational fields for Learning & Execution Drawer
  summary?: string;
  keyTopics?: string[];
  codeSnippet?: ICodeSnippet;
  quiz?: IQuizQuestion[];
  taskPrompt?: string;
}

export interface IPhase {
  phaseId: string;
  phaseTitle: string;
  order: number;
  milestones: IMilestone[];
}

export interface IRoadmap extends Document {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  role: string;
  domain: string;
  progressPercentage: number;
  totalMilestones: number;
  completedMilestones: number;
  phases: IPhase[];
  createdAt: Date;
  updatedAt: Date;
}

const RoadmapResourceSchema = new Schema<IRoadmapResource>(
  {
    title: { type: String, required: true },
    url: { type: String, required: true },
    type: {
      type: String,
      enum: ['DOCS', 'VIDEO', 'ARTICLE', 'PROJECT'],
      required: true,
      default: 'DOCS',
    },
  },
  { _id: false },
);

const CodeSnippetSchema = new Schema<ICodeSnippet>(
  {
    language: { type: String, default: 'typescript' },
    code: { type: String, default: '' },
    title: { type: String, default: '' },
  },
  { _id: false },
);

const QuizQuestionSchema = new Schema<IQuizQuestion>(
  {
    question: { type: String, required: true },
    options: { type: [String], required: true },
    correctIndex: { type: Number, required: true },
  },
  { _id: false },
);

const MilestoneSchema = new Schema<IMilestone>(
  {
    milestoneId: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, default: '' },
    estimatedHours: { type: Number, default: 20 },
    skills: { type: [String], default: [] },
    resources: { type: [RoadmapResourceSchema], default: [] },
    status: {
      type: String,
      enum: ['LOCKED', 'AVAILABLE', 'IN_PROGRESS', 'COMPLETED'],
      default: 'LOCKED',
    },
    completedAt: { type: Date },

    // Educational fields for Learning & Execution Drawer
    summary: { type: String, default: '' },
    keyTopics: { type: [String], default: [] },
    codeSnippet: { type: CodeSnippetSchema, default: null },
    quiz: { type: [QuizQuestionSchema], default: [] },
    taskPrompt: { type: String, default: '' },
  },
  { _id: false },
);

const PhaseSchema = new Schema<IPhase>(
  {
    phaseId: { type: String, required: true },
    phaseTitle: { type: String, required: true },
    order: { type: Number, required: true },
    milestones: { type: [MilestoneSchema], default: [] },
  },
  { _id: false },
);

const RoadmapSchema = new Schema<IRoadmap>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    role: { type: String, required: true, trim: true },
    domain: { type: String, required: true, trim: true },
    progressPercentage: { type: Number, default: 0, min: 0, max: 100 },
    totalMilestones: { type: Number, default: 0 },
    completedMilestones: { type: Number, default: 0 },
    phases: { type: [PhaseSchema], default: [] },
  },
  {
    timestamps: true,
  },
);

// Compound unique index ensuring one roadmap per role per user
RoadmapSchema.index({ userId: 1, role: 1 }, { unique: true });

export const Roadmap: Model<IRoadmap> =
  mongoose.models.Roadmap || mongoose.model<IRoadmap>('Roadmap', RoadmapSchema);

export default Roadmap;

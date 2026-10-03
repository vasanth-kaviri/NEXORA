import mongoose, { Document, Schema, Model } from 'mongoose';
import bcrypt from 'bcryptjs';

// --- Interfaces ---------------------------------------------------------------

export interface IUser extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  email?: string;
  phone?: string;
  countryCode?: string;
  passwordHash: string;
  password?: string;
  authMethod: 'email' | 'phone';
  role: 'student' | 'admin';
  isVerified: boolean;
  isActive: boolean;

  // Onboarding data
  firstName?: string;
  lastName?: string;
  domain?: string;
  dreamJob?: string;
  targetRole?: string;
  bio?: string;
  avatar?: string;
  tier?: 'free' | 'pro' | 'enterprise';
  education?: string;
  profileCompleted?: boolean;
  track?: string;
  college?: string;
  graduationYear?: number;
  skills?: string[];
  goals?: string[];
  atsScore?: number;
  extractedProjects?: Array<{
    title: string;
    techStack?: string[] | string;
    description?: string;
  }>;
  experiences?: Array<{
    id?: string;
    role: string;
    company: string;
    duration?: string;
    location?: string;
    description?: string;
  }>;
  certifications?: Array<{
    id?: string;
    title: string;
    issuer: string;
    issueDate?: string;
    credentialId?: string;
    color?: string;
  }>;

  // Verification tokens
  emailVerifyToken?: string;
  emailVerifyTokenExpires?: Date;
  emailOtp?: string;
  emailOtpExpires?: Date;
  phoneOtp?: string;
  phoneOtpExpires?: Date;
  otpAttempts: number;

  // Password reset
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;

  // Security
  loginAttempts: number;
  lockUntil?: Date;
  lastLoginAt?: Date;
  refreshTokens: string[];

  // Timestamps
  createdAt: Date;
  updatedAt: Date;

  // Methods
  comparePassword(candidatePassword: string): Promise<boolean>;
  isAccountLocked(): boolean;
  incrementLoginAttempts(): Promise<void>;
  resetLoginAttempts(): Promise<void>;
}

export interface IUserModel extends Model<IUser> {
  findByEmailOrPhone(contact: string): Promise<IUser | null>;
}

// --- Schema -------------------------------------------------------------------

const UserSchema = new Schema<IUser, IUserModel>(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
      maxlength: [100, 'Name must not exceed 100 characters'],
    },
    email: {
      type: String,
      sparse: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Invalid email format'],
    },
    phone: {
      type: String,
      sparse: true,
      unique: true,
      trim: true,
    },
    countryCode: { type: String, default: '+91' },
    passwordHash: { type: String, select: false },
    password: { type: String, select: false },
    authMethod: {
      type: String,
      enum: ['email', 'phone'],
      required: true,
    },
    role: {
      type: String,
      enum: ['student', 'admin'],
      default: 'student',
    },
    isVerified: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },

    // Onboarding
    firstName: { type: String, trim: true },
    lastName: { type: String, trim: true },
    domain: { type: String, trim: true },
    dreamJob: { type: String, trim: true },
    targetRole: { type: String, trim: true },
    bio: { type: String, trim: true, maxlength: [500, 'Bio cannot exceed 500 characters'] },
    avatar: { type: String },
    tier: {
      type: String,
      enum: ['free', 'pro', 'enterprise'],
      default: 'free',
    },
    education: { type: String, trim: true },
    profileCompleted: { type: Boolean, default: false },
    track: { type: String },
    college: { type: String },
    graduationYear: { type: Number },
    skills: [{ type: Schema.Types.Mixed }],
    goals: [{ type: String }],
    atsScore: { type: Number },
    extractedProjects: [{
      title: { type: String },
      techStack: { type: Schema.Types.Mixed },
      description: { type: String },
    }],
    experiences: [{
      id: { type: String },
      role: { type: String, required: true },
      company: { type: String, required: true },
      duration: { type: String },
      location: { type: String },
      description: { type: String },
    }],
    certifications: [{
      id: { type: String },
      title: { type: String, required: true },
      issuer: { type: String, required: true },
      issueDate: { type: String },
      credentialId: { type: String },
      color: { type: String },
    }],

    // Verification tokens
    emailVerifyToken: { type: String, select: false },
    emailVerifyTokenExpires: { type: Date, select: false },
    emailOtp: { type: String, select: false },
    emailOtpExpires: { type: Date, select: false },
    phoneOtp: { type: String, select: false },
    phoneOtpExpires: { type: Date, select: false },
    otpAttempts: { type: Number, default: 0 },

    // Password reset
    resetPasswordToken: { type: String, select: false },
    resetPasswordExpires: { type: Date, select: false },

    // Security
    loginAttempts: { type: Number, default: 0 },
    lockUntil: { type: Date },
    lastLoginAt: { type: Date },
    refreshTokens: [{ type: String, select: false }],
  },
  {
    timestamps: true,
    toJSON: {
      transform(_doc, ret: Record<string, unknown>) {
        ret['passwordHash'] = undefined;
        ret['password'] = undefined;
        ret['refreshTokens'] = undefined;
        ret['__v'] = undefined;
        return ret;
      },
    },
  },
);

// Note: email, phone, and resetPasswordToken indexes are defined via
// { sparse: true, unique: true } in the schema field options above —
// no additional .index() calls needed (would cause duplicate index warnings).

// --- Pre-save: Hash Password --------------------------------------------------
UserSchema.pre<IUser>('save', async function (next) {
  const pwModified = this.isModified('password');
  const pwHashModified = this.isModified('passwordHash');

  // If neither password field was modified, skip immediately
  if (!pwModified && !pwHashModified) {
    return next();
  }

  const rawPw = (this as any).password;
  const rawHash = this.passwordHash;

  const isBcryptHash = (val: unknown): boolean =>
    typeof val === 'string' && val.length === 60 && val.startsWith('$2');

  // Priority 1: If an unhashed (plain-text) password was provided, hash it
  let plainText: string | null = null;
  if (pwModified && typeof rawPw === 'string' && rawPw && !isBcryptHash(rawPw)) {
    plainText = rawPw;
  } else if (pwHashModified && typeof rawHash === 'string' && rawHash && !isBcryptHash(rawHash)) {
    plainText = rawHash;
  }

  if (plainText) {
    const salt = await bcrypt.genSalt(12);
    const hashed = await bcrypt.hash(plainText, salt);
    this.passwordHash = hashed;
    (this as any).password = hashed;
    return next();
  }

  // Priority 2: If a valid bcrypt hash was passed directly, keep it and sync both fields
  const validHash = (isBcryptHash(rawHash) ? rawHash : (isBcryptHash(rawPw) ? rawPw : null)) as string | null;
  if (validHash) {
    this.passwordHash = validHash;
    (this as any).password = validHash;
    return next();
  }

  next();
});

// --- Methods ------------------------------------------------------------------
UserSchema.methods.comparePassword = async function (
  candidatePassword: string,
): Promise<boolean> {
  const hash = this.passwordHash || this.password || (this as any)._doc?.passwordHash || (this as any)._doc?.password;
  if (!hash) {
    return false;
  }
  return bcrypt.compare(candidatePassword, hash);
};

UserSchema.methods.isAccountLocked = function (): boolean {
  return !!(this.lockUntil && this.lockUntil > new Date());
};

UserSchema.methods.incrementLoginAttempts = async function (): Promise<void> {
  const LOCK_TIME = 2 * 60 * 60 * 1000; // 2 hours
  const MAX_ATTEMPTS = 5;

  // Reset if lock has expired
  if (this.lockUntil && this.lockUntil < new Date()) {
    await this.updateOne({
      $set: { loginAttempts: 1 },
      $unset: { lockUntil: 1 },
    });
    return;
  }

  const updates: Record<string, unknown> = { $inc: { loginAttempts: 1 } };
  if (this.loginAttempts + 1 >= MAX_ATTEMPTS && !this.isAccountLocked()) {
    updates['$set'] = { lockUntil: new Date(Date.now() + LOCK_TIME) };
  }
  await this.updateOne(updates);
};

UserSchema.methods.resetLoginAttempts = async function (): Promise<void> {
  await this.updateOne({
    $set: { loginAttempts: 0, lastLoginAt: new Date() },
    $unset: { lockUntil: 1 },
  });
};

// --- Static Methods -----------------------------------------------------------
UserSchema.statics.findByEmailOrPhone = function (
  contact: string,
): Promise<IUser | null> {
  const clean = (contact || '').trim();
  if (!clean) return Promise.resolve(null);
  const isEmail = clean.includes('@');
  if (isEmail) {
    return this.findOne({ email: clean.toLowerCase() })
      .select('+passwordHash +refreshTokens')
      .exec();
  }

  const pureDigits = clean.replace(/\D/g, '').slice(-10);
  const sanitized = clean.replace(/[\s\-\(\)]/g, '');
  const orConditions: Record<string, unknown>[] = [
    { phone: pureDigits },
    { countryCode: '+91', phone: pureDigits },
    { phone: clean },
    { phone: sanitized },
    { phone: `+${sanitized.replace(/^\+/, '')}` },
    { phone: `+91${pureDigits}` },
  ];

  return this.findOne({ $or: orConditions })
    .select('+passwordHash +refreshTokens')
    .exec();
};

export const User: IUserModel = mongoose.model<IUser, IUserModel>(
  'User',
  UserSchema,
);


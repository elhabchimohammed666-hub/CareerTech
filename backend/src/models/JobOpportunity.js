import mongoose from 'mongoose';

const noteEntrySchema = new mongoose.Schema(
  {
    note: { type: String, required: true },
    date: { type: Date, default: Date.now },
  },
  { _id: true }
);

const jobOpportunitySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: [true, 'Job title is required'],
      trim: true,
    },
    company: {
      type: String,
      required: [true, 'Company name is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Job description is required'],
      trim: true,
    },
    jobLink: {
      type: String,
      trim: true,
      default: '',
    },
    location: {
      type: String,
      trim: true,
      default: '',
    },
    salary: {
      type: String,
      trim: true,
      default: '',
    },
    status: {
      type: String,
      enum: ['Saved', 'Applied', 'Interview', 'Offer', 'Rejected'],
      default: 'Saved',
      index: true,
    },
    applicationDate: {
      type: Date,
      default: null,
    },
    followUpDate: {
      type: Date,
      default: null,
    },
    interviewDate: {
      type: Date,
      default: null,
    },
    notes: {
      type: String,
      default: '',
    },
    notesHistory: [noteEntrySchema],
  },
  { timestamps: true }
);

export const JobOpportunity = mongoose.model('JobOpportunity', jobOpportunitySchema);
export default JobOpportunity;

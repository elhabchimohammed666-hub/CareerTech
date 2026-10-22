import mongoose from 'mongoose';

const matchingQualificationSchema = new mongoose.Schema(
  {
    requirement: { type: String, required: true },
    cvEvidence: { type: String, required: true },
    explanation: { type: String, required: true },
  },
  { _id: false }
);

const unconfirmedRequirementSchema = new mongoose.Schema(
  {
    requirement: { type: String, required: true },
    type: {
      type: String,
      enum: ['unsupported', 'unclear_or_implicit'],
      default: 'unsupported',
    },
    explanation: { type: String, required: true },
  },
  { _id: false }
);

const relevantExperienceSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    relevance: { type: String, default: 'High' },
    explanation: { type: String, required: true },
  },
  { _id: false }
);

const tailoringSuggestionSchema = new mongoose.Schema(
  {
    section: { type: String, required: true },
    currentContentRef: { type: String, default: '' },
    recommendation: { type: String, required: true },
  },
  { _id: false }
);

const aiAnalysisSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    jobOpportunity: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'JobOpportunity',
      default: null,
    },
    jobTitle: {
      type: String,
      default: 'Untitled Position',
      trim: true,
    },
    company: {
      type: String,
      default: '',
      trim: true,
    },
    jobDescription: {
      type: String,
      required: [true, 'Job description is required for analysis'],
    },
    cvSource: {
      type: String,
      enum: ['main', 'custom'],
      default: 'main',
    },
    cvOriginalName: {
      type: String,
      required: true,
    },
    cvExtractedSnippet: {
      type: String,
      default: '',
    },
    matchCategory: {
      type: String,
      enum: ['Strong Match', 'Good Match', 'Partial Match', 'Low Match'],
      required: true,
    },
    matchScore: {
      type: Number,
      min: 0,
      max: 100,
      required: true,
    },
    scoreExplanation: {
      type: String,
      default: '',
    },
    overallAssessment: {
      type: String,
      required: true,
    },
    matchingQualifications: [matchingQualificationSchema],
    unconfirmedRequirements: [unconfirmedRequirementSchema],
    relevantExperience: [relevantExperienceSchema],
    improvementSuggestions: [
      {
        type: String,
      },
    ],
    tailoringSuggestions: [tailoringSuggestionSchema],
    rawReport: {
      type: mongoose.Schema.Types.Mixed,
    },
  },
  { timestamps: true }
);

export const AIAnalysis = mongoose.model('AIAnalysis', aiAnalysisSchema);
export default AIAnalysis;

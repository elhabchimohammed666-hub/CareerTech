import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import User from '../models/User.js';
import JobOpportunity from '../models/JobOpportunity.js';
import AIAnalysis from '../models/AIAnalysis.js';
import { extractTextFromPDF } from '../services/pdfService.js';
import { performCVAnalysis } from '../services/aiService.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../../.env') });

async function seed() {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/careertech';
    console.log(`[Seed] Connecting to MongoDB at ${mongoUri}...`);
    await mongoose.connect(mongoUri);

    console.log('[Seed] Clearing existing demo collections...');
    await User.deleteMany({ email: 'sara@example.com' });
    // Also clean up any jobs or analyses created for demo users
    const existingUsers = await User.find({ email: 'sara@example.com' });
    const userIds = existingUsers.map((u) => u._id);
    await JobOpportunity.deleteMany({ user: { $in: userIds } });
    await AIAnalysis.deleteMany({ user: { $in: userIds } });

    // Ensure sample CV file exists
    const sampleDir = path.join(__dirname, '../../../sample_data/cvs');
    const sampleFrontendCV = path.join(sampleDir, 'Sara_Frontend_Developer_CV.pdf');
    const uploadsDir = path.join(__dirname, '../../uploads');

    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    let cvData = null;
    if (fs.existsSync(sampleFrontendCV)) {
      const destPath = path.join(uploadsDir, `main-sara-cv-${Date.now()}.pdf`);
      fs.copyFileSync(sampleFrontendCV, destPath);

      const extraction = await extractTextFromPDF(destPath);
      console.log(`[Seed] Extracted ${extraction.text.length} characters from Sara's main CV.`);

      cvData = {
        originalName: 'Sara_Frontend_Developer_CV.pdf',
        filename: path.basename(destPath),
        path: destPath,
        mimeType: 'application/pdf',
        size: fs.statSync(destPath).size,
        uploadedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000), // 14 days ago
        extractedText: extraction.text,
      };
    }

    console.log('[Seed] Creating demo user Sara...');
    const user = await User.create({
      name: 'Sara Mansouri',
      email: 'sara@example.com',
      password: 'Password123!',
      headline: 'Junior Full Stack Developer (React & Node.js)',
      bio: 'Junior software engineer passionate about clean UI/UX, React ecosystems, and performant REST APIs.',
      mainCV: cvData,
    });

    console.log(`[Seed] User created: ${user.email} (ID: ${user._id})`);

    console.log('[Seed] Creating job opportunities for Sara...');
    const jobsData = [
      {
        user: user._id,
        title: 'Frontend Developer',
        company: 'Veloce Technologies',
        description:
          'We are seeking a Junior to Mid-level Frontend Developer with expertise in React, Next.js, TypeScript, and REST APIs. Responsibilities include building responsive UI components, integrating backend endpoints, and optimizing application loading speed.',
        jobLink: 'https://example.com/careers/veloce-frontend',
        location: 'Paris, France (Hybrid)',
        salary: '€42,000 - €48,000',
        status: 'Interview',
        applicationDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        interviewDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
        followUpDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000),
        notes: 'Technical interview scheduled for Thursday 2:00 PM with the Lead Engineer.',
        notesHistory: [
          { note: 'Saved opportunity after seeing posting on LinkedIn.', date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000) },
          { note: 'Analyzed CV using CareerTech AI and tailored summary section.', date: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000) },
          { note: 'Submitted application on careers portal.', date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
          { note: 'Technical interview scheduled for Thursday 2:00 PM with the Lead Engineer.', date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) }
        ],
      },
      {
        user: user._id,
        title: 'Full Stack Engineer (MERN)',
        company: 'NovaLabs Innovation',
        description:
          'NovaLabs is hiring a MERN Stack Developer. Requirements: Strong experience with React, Node.js, Express.js, and MongoDB. Must have solid experience with REST APIs and Git version control.',
        jobLink: 'https://example.com/jobs/novalabs-mern',
        location: 'Remote',
        salary: '€45,000 - €52,000',
        status: 'Applied',
        applicationDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        followUpDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
        notes: 'Applied with customized cover letter highlighting DevConnect project.',
        notesHistory: [
          { note: 'Application submitted through direct email referral.', date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) }
        ],
      },
      {
        user: user._id,
        title: 'React Software Engineer',
        company: 'Starlight SaaS',
        description:
          'Join our product engineering squad to build user-facing analytics dashboards using React, TypeScript, and state management libraries.',
        jobLink: 'https://example.com/careers/starlight-react',
        location: 'Paris, France',
        salary: '€40,000 - €46,000',
        status: 'Saved',
        notes: 'Reviewing job requirements before submitting application.',
        notesHistory: [
          { note: 'Discovered via tech community board.', date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000) }
        ],
      },
      {
        user: user._id,
        title: 'Junior Web Developer',
        company: 'Apex Cloud Services',
        description:
          'Entry-level developer to support web application maintenance, component design, and integration testing.',
        jobLink: 'https://example.com/careers/apex-web',
        location: 'Lyon, France (Hybrid)',
        salary: '€38,000 - €42,000',
        status: 'Offer',
        applicationDate: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000),
        interviewDate: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000),
        notes: 'Received official offer letter! Reviewing contract terms.',
        notesHistory: [
          { note: 'Applied online.', date: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000) },
          { note: 'Completed HR and Technical rounds.', date: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000) },
          { note: 'Received official offer letter! Reviewing contract terms.', date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000) }
        ],
      },
      {
        user: user._id,
        title: 'Frontend Angular Developer',
        company: 'DataPulse Analytics',
        description:
          'Looking for a Frontend Developer with 2+ years of Angular 15+, RxJS, and NgRx experience.',
        jobLink: 'https://example.com/careers/datapulse-angular',
        location: 'Remote',
        salary: '€44,000',
        status: 'Rejected',
        applicationDate: new Date(Date.now() - 16 * 24 * 60 * 60 * 1000),
        notes: 'Polite rejection received: team was seeking deep Angular and RxJS experience.',
        notesHistory: [
          { note: 'Applied.', date: new Date(Date.now() - 16 * 24 * 60 * 60 * 1000) },
          { note: 'Received rejection notice.', date: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000) }
        ],
      },
    ];

    const createdJobs = await JobOpportunity.insertMany(jobsData);
    console.log(`[Seed] Created ${createdJobs.length} sample job opportunities.`);

    // Create realistic sample AI Analysis report for Sara
    if (cvData && cvData.extractedText) {
      console.log('[Seed] Generating sample AI Analysis report for Sara...');
      const targetJob = createdJobs[0];
      const analysisReport = await performCVAnalysis({
        cvText: cvData.extractedText,
        jobDescription: targetJob.description,
      });

      await AIAnalysis.create({
        user: user._id,
        jobOpportunity: targetJob._id,
        jobTitle: targetJob.title,
        company: targetJob.company,
        jobDescription: targetJob.description,
        cvSource: 'main',
        cvOriginalName: cvData.originalName,
        cvExtractedSnippet: cvData.extractedText.substring(0, 300) + '...',
        matchCategory: analysisReport.matchCategory,
        matchScore: analysisReport.matchScore,
        scoreExplanation: analysisReport.scoreExplanation,
        overallAssessment: analysisReport.overallAssessment,
        matchingQualifications: analysisReport.matchingQualifications,
        unconfirmedRequirements: analysisReport.unconfirmedRequirements,
        relevantExperience: analysisReport.relevantExperience,
        improvementSuggestions: analysisReport.improvementSuggestions,
        tailoringSuggestions: analysisReport.tailoringSuggestions,
        rawReport: analysisReport,
      });
      console.log('[Seed] Sample AI Analysis report created successfully.');
    }

    console.log('\n=========================================');
    console.log('✅ CareerTech Database Seeding Complete!');
    console.log('Demo Credentials:');
    console.log('  Email:    sara@example.com');
    console.log('  Password: Password123!');
    console.log('=========================================\n');
    process.exit(0);
  } catch (error) {
    console.error('[Seed Error]:', error);
    process.exit(1);
  }
}

seed();

import fs from 'fs';
import PDFDocument from 'pdfkit';
import User from '../models/User.js';
import AIAnalysis from '../models/AIAnalysis.js';
import { extractTextFromPDF } from '../services/pdfService.js';
import { performCVAnalysis } from '../services/aiService.js';

// @desc    Run AI Analysis against a Job Description
// @route   POST /api/ai/analyze
// @access  Private
export const analyzeCV = async (req, res, next) => {
  let tempFilePath = null;
  try {
    const {
      jobDescription,
      jobTitle = 'Untitled Position',
      company = '',
      jobOpportunityId = null,
      useMainCV = 'true',
    } = req.body;

    if (!jobDescription || jobDescription.trim().length < 20) {
      // Remove temp file if any
      if (req.file && fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }
      return res.status(400).json({
        success: false,
        message: 'Job description must be provided and contain at least 20 characters.',
      });
    }

    let cvText = '';
    let cvOriginalName = '';
    let cvSource = 'main';

    const user = await User.findById(req.user._id);

    // Option A: User uploaded an alternative CV for this specific analysis
    if (req.file) {
      tempFilePath = req.file.path;
      cvOriginalName = req.file.originalname;
      cvSource = 'custom';

      const extraction = await extractTextFromPDF(tempFilePath);
      if (!extraction.success) {
        if (fs.existsSync(tempFilePath)) fs.unlinkSync(tempFilePath);
        return res.status(400).json({
          success: false,
          message:
            extraction.warning ||
            extraction.error ||
            'Could not extract text from the uploaded alternative CV.',
        });
      }
      cvText = extraction.text;

      // Clean up temp file after extracting text
      if (fs.existsSync(tempFilePath)) {
        fs.unlinkSync(tempFilePath);
        tempFilePath = null;
      }
    }
    // Option B: User chose to use their Main CV
    else if (useMainCV === 'true' || useMainCV === true) {
      if (!user.mainCV || !user.mainCV.extractedText) {
        return res.status(400).json({
          success: false,
          message:
            'You do not have a main CV uploaded yet. Please upload your main CV in CV Management or upload a PDF for this analysis.',
        });
      }
      cvText = user.mainCV.extractedText;
      cvOriginalName = user.mainCV.originalName;
      cvSource = 'main';
    } else {
      return res.status(400).json({
        success: false,
        message: 'Please choose either your main CV or upload a PDF for analysis.',
      });
    }

    console.log(
      `[AIController] Analyzing CV (${cvOriginalName}, ${cvText.length} chars) for job: ${jobTitle} at ${company}`
    );

    // Perform AI Analysis
    const analysisReport = await performCVAnalysis({
      cvText,
      jobDescription,
    });

    // Save report to database for historical review
    const snippet =
      cvText.length > 300 ? cvText.substring(0, 300).trim() + '...' : cvText;

    const savedAnalysis = await AIAnalysis.create({
      user: user._id,
      jobOpportunity: jobOpportunityId || null,
      jobTitle: jobTitle.trim() || 'Target Position',
      company: company.trim(),
      jobDescription,
      cvSource,
      cvOriginalName,
      cvExtractedSnippet: snippet,
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

    res.status(201).json({
      success: true,
      message: 'CV analysis completed successfully',
      analysis: savedAnalysis,
    });
  } catch (error) {
    if (tempFilePath && fs.existsSync(tempFilePath)) {
      try {
        fs.unlinkSync(tempFilePath);
      } catch (e) {
        // ignore cleanup error
      }
    }
    next(error);
  }
};

// @desc    Get user's AI analysis history
// @route   GET /api/ai/history
// @access  Private
export const getAnalysisHistory = async (req, res, next) => {
  try {
    const history = await AIAnalysis.find({ user: req.user._id })
      .select(
        'jobTitle company matchCategory matchScore scoreExplanation overallAssessment cvOriginalName cvSource createdAt'
      )
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: history.length,
      history,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single AI analysis report by ID
// @route   GET /api/ai/history/:id
// @access  Private
export const getAnalysisById = async (req, res, next) => {
  try {
    const report = await AIAnalysis.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!report) {
      return res.status(404).json({
        success: false,
        message: 'Analysis report not found or you do not have permission',
      });
    }

    res.status(200).json({
      success: true,
      report,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete an AI analysis report
// @route   DELETE /api/ai/history/:id
// @access  Private
export const deleteAnalysis = async (req, res, next) => {
  try {
    const report = await AIAnalysis.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!report) {
      return res.status(404).json({
        success: false,
        message: 'Analysis report not found or you do not have permission',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Analysis report deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Export AI Analysis Report as PDF
// @route   GET /api/ai/history/:id/pdf
// @access  Private
export const exportAnalysisPDF = async (req, res, next) => {
  try {
    const report = await AIAnalysis.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!report) {
      return res.status(404).json({
        success: false,
        message: 'Analysis report not found',
      });
    }

    const doc = new PDFDocument({ margin: 45, size: 'A4' });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="CareerTech-Report-${report.jobTitle.replace(/[^a-zA-Z0-9]/g, '_')}.pdf"`
    );

    doc.pipe(res);

    // Header
    doc.fillColor('#4338CA').fontSize(22).font('Helvetica-Bold').text('CareerTech', { align: 'left' });
    doc.fillColor('#6B7280').fontSize(10).font('Helvetica').text('AI-Powered CV Analysis Report', { align: 'left' });
    doc.moveDown(0.8);

    doc.strokeColor('#E5E7EB').lineWidth(1).moveTo(45, doc.y).lineTo(550, doc.y).stroke();
    doc.moveDown(1);

    // Job Metadata
    doc.fillColor('#111827').fontSize(14).font('Helvetica-Bold').text(report.jobTitle);
    if (report.company) {
      doc.fillColor('#4B5563').fontSize(11).font('Helvetica').text(`Company: ${report.company}`);
    }
    doc.fillColor('#6B7280').fontSize(9).text(`Analyzed on: ${new Date(report.createdAt).toLocaleDateString()} | CV: ${report.cvOriginalName} (${report.cvSource === 'main' ? 'Main CV' : 'Alternative CV'})`);
    doc.moveDown(1);

    // Match Score & Category Banner
    doc.rect(45, doc.y, 505, 45).fillAndStroke('#EEF2FF', '#C7D2FE');
    doc.fillColor('#3730A3').fontSize(12).font('Helvetica-Bold').text(`Overall Match: ${report.matchCategory} (${report.matchScore}/100)`, 60, doc.y - 32);
    doc.fillColor('#4338CA').fontSize(8.5).font('Helvetica').text(report.scoreExplanation || '', 60, doc.y - 18, { width: 470 });
    doc.moveDown(2);

    // Overall Assessment
    doc.fillColor('#1F2937').fontSize(12).font('Helvetica-Bold').text('1. Overall Assessment');
    doc.fillColor('#374151').fontSize(10).font('Helvetica').text(report.overallAssessment, { align: 'justify' });
    doc.moveDown(1);

    // Matching Qualifications
    doc.fillColor('#065F46').fontSize(12).font('Helvetica-Bold').text('2. Matching Qualifications (Demonstrated in CV)');
    if (report.matchingQualifications && report.matchingQualifications.length > 0) {
      report.matchingQualifications.forEach((q) => {
        doc.fillColor('#111827').fontSize(10).font('Helvetica-Bold').text(`• ${q.requirement}`);
        doc.fillColor('#4B5563').fontSize(9).font('Helvetica-Oblique').text(`  Evidence: "${q.cvEvidence}"`);
        doc.fillColor('#374151').fontSize(9).font('Helvetica').text(`  ${q.explanation}`);
        doc.moveDown(0.4);
      });
    } else {
      doc.fillColor('#6B7280').fontSize(9).text('No direct matching qualifications identified.');
    }
    doc.moveDown(1);

    // Unconfirmed Requirements
    doc.fillColor('#9A3412').fontSize(12).font('Helvetica-Bold').text('3. Unconfirmed Requirements');
    if (report.unconfirmedRequirements && report.unconfirmedRequirements.length > 0) {
      report.unconfirmedRequirements.forEach((u) => {
        const badge = u.type === 'unclear_or_implicit' ? '[Implicit / Unclear]' : '[Unsupported]';
        doc.fillColor('#111827').fontSize(10).font('Helvetica-Bold').text(`• ${u.requirement} ${badge}`);
        doc.fillColor('#4B5563').fontSize(9).font('Helvetica').text(`  ${u.explanation}`);
        doc.moveDown(0.4);
      });
    } else {
      doc.fillColor('#6B7280').fontSize(9).text('All evaluated requirements appear covered in CV.');
    }
    doc.moveDown(1);

    // Relevant Experience
    doc.fillColor('#1E40AF').fontSize(12).font('Helvetica-Bold').text('4. Relevant Experience Highlighted');
    if (report.relevantExperience && report.relevantExperience.length > 0) {
      report.relevantExperience.forEach((r) => {
        doc.fillColor('#111827').fontSize(10).font('Helvetica-Bold').text(`• ${r.title} (${r.relevance} Relevance)`);
        doc.fillColor('#4B5563').fontSize(9).font('Helvetica').text(`  ${r.explanation}`);
        doc.moveDown(0.4);
      });
    }
    doc.moveDown(1);

    // Improvement Suggestions
    doc.fillColor('#6D28D9').fontSize(12).font('Helvetica-Bold').text('5. Practical CV Improvement Suggestions');
    if (report.improvementSuggestions && report.improvementSuggestions.length > 0) {
      report.improvementSuggestions.forEach((s, idx) => {
        doc.fillColor('#374151').fontSize(9).font('Helvetica').text(`${idx + 1}. ${s}`);
        doc.moveDown(0.3);
      });
    }

    doc.end();
  } catch (error) {
    next(error);
  }
};

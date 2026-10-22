import fs from 'fs';
import path from 'path';
import User from '../models/User.js';
import { extractTextFromPDF } from '../services/pdfService.js';

// @desc    Upload or replace main CV
// @route   POST /api/cv/main
// @access  Private
export const uploadMainCV = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded. Please select a valid PDF file.',
      });
    }

    const filePath = req.file.path;

    // Extract text from the PDF
    const extractionResult = await extractTextFromPDF(filePath);

    if (!extractionResult.success) {
      // Remove invalid uploaded file
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
      return res.status(400).json({
        success: false,
        message:
          extractionResult.warning ||
          extractionResult.error ||
          'Failed to extract text from the provided PDF.',
      });
    }

    const user = await User.findById(req.user._id);

    // If an old main CV file exists, remove it cleanly
    if (user.mainCV && user.mainCV.path && fs.existsSync(user.mainCV.path)) {
      try {
        fs.unlinkSync(user.mainCV.path);
      } catch (err) {
        console.warn('[CVController] Old CV file removal warning:', err.message);
      }
    }

    user.mainCV = {
      originalName: req.file.originalname,
      filename: req.file.filename,
      path: req.file.path,
      mimeType: req.file.mimetype,
      size: req.file.size,
      uploadedAt: new Date(),
      extractedText: extractionResult.text,
    };

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Main CV uploaded and processed successfully',
      cv: {
        originalName: user.mainCV.originalName,
        size: user.mainCV.size,
        uploadedAt: user.mainCV.uploadedAt,
        snippet: extractionResult.snippet,
        charCount: extractionResult.text.length,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get main CV details & text preview
// @route   GET /api/cv/main
// @access  Private
export const getMainCV = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user.mainCV || !user.mainCV.path) {
      return res.status(200).json({
        success: true,
        hasCV: false,
        cv: null,
      });
    }

    const fileExists = fs.existsSync(user.mainCV.path);

    res.status(200).json({
      success: true,
      hasCV: true,
      fileExists,
      cv: {
        originalName: user.mainCV.originalName,
        size: user.mainCV.size,
        uploadedAt: user.mainCV.uploadedAt,
        snippet:
          user.mainCV.extractedText.length > 500
            ? user.mainCV.extractedText.substring(0, 500) + '...'
            : user.mainCV.extractedText,
        fullTextLength: user.mainCV.extractedText.length,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Download / view main CV file
// @route   GET /api/cv/main/file
// @access  Private
export const downloadMainCV = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user.mainCV || !user.mainCV.path) {
      return res.status(404).json({
        success: false,
        message: 'No main CV has been uploaded for this account.',
      });
    }

    if (!fs.existsSync(user.mainCV.path)) {
      return res.status(404).json({
        success: false,
        message: 'CV file not found on disk.',
      });
    }

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      `inline; filename="${user.mainCV.originalName}"`
    );
    const fileStream = fs.createReadStream(user.mainCV.path);
    fileStream.pipe(res);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete main CV
// @route   DELETE /api/cv/main
// @access  Private
export const deleteMainCV = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user.mainCV) {
      return res.status(404).json({
        success: false,
        message: 'No main CV found to delete.',
      });
    }

    if (user.mainCV.path && fs.existsSync(user.mainCV.path)) {
      try {
        fs.unlinkSync(user.mainCV.path);
      } catch (err) {
        console.warn('[CVController] File unlink error:', err.message);
      }
    }

    user.mainCV = null;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Main CV removed successfully.',
    });
  } catch (error) {
    next(error);
  }
};

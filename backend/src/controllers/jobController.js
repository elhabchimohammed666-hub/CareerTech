import JobOpportunity from '../models/JobOpportunity.js';

// @desc    Get all job opportunities for current user with search, filter, and sorting
// @route   GET /api/jobs
// @access  Private
export const getJobs = async (req, res, next) => {
  try {
    const { status, search, sortBy = 'createdAt', order = 'desc' } = req.query;

    const query = { user: req.user._id };

    // Filter by status if provided and valid
    if (status && status !== 'All') {
      query.status = status;
    }

    // Search by title or company
    if (search && search.trim() !== '') {
      const searchRegex = new RegExp(search.trim(), 'i');
      query.$or = [{ title: searchRegex }, { company: searchRegex }];
    }

    const sortOrder = order === 'asc' ? 1 : -1;
    const sortObj = {};
    sortObj[sortBy] = sortOrder;

    const jobs = await JobOpportunity.find(query).sort(sortObj);

    res.status(200).json({
      success: true,
      count: jobs.length,
      jobs,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single job opportunity by ID
// @route   GET /api/jobs/:id
// @access  Private
export const getJobById = async (req, res, next) => {
  try {
    const job = await JobOpportunity.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job opportunity not found or you do not have permission',
      });
    }

    res.status(200).json({
      success: true,
      job,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new job opportunity
// @route   POST /api/jobs
// @access  Private
export const createJob = async (req, res, next) => {
  try {
    const {
      title,
      company,
      description,
      jobLink,
      location,
      salary,
      status,
      applicationDate,
      followUpDate,
      interviewDate,
      notes,
    } = req.body;

    if (!title || !company || !description) {
      return res.status(400).json({
        success: false,
        message: 'Please provide job title, company name, and job description',
      });
    }

    const initialNotesHistory = notes
      ? [{ note: `Initial note: ${notes}`, date: new Date() }]
      : [];

    const job = await JobOpportunity.create({
      user: req.user._id,
      title,
      company,
      description,
      jobLink: jobLink || '',
      location: location || '',
      salary: salary || '',
      status: status || 'Saved',
      applicationDate: applicationDate || (status === 'Applied' ? new Date() : null),
      followUpDate: followUpDate || null,
      interviewDate: interviewDate || null,
      notes: notes || '',
      notesHistory: initialNotesHistory,
    });

    res.status(201).json({
      success: true,
      message: 'Job opportunity created successfully',
      job,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update job opportunity
// @route   PUT /api/jobs/:id
// @access  Private
export const updateJob = async (req, res, next) => {
  try {
    const job = await JobOpportunity.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job opportunity not found or you do not have permission',
      });
    }

    const fieldsToUpdate = [
      'title',
      'company',
      'description',
      'jobLink',
      'location',
      'salary',
      'status',
      'applicationDate',
      'followUpDate',
      'interviewDate',
      'notes',
    ];

    const oldStatus = job.status;
    const newStatus = req.body.status;

    fieldsToUpdate.forEach((field) => {
      if (req.body[field] !== undefined) {
        job[field] = req.body[field];
      }
    });

    // If status changed to Applied and no application date set, auto-record current date
    if (newStatus === 'Applied' && oldStatus !== 'Applied' && !job.applicationDate) {
      job.applicationDate = new Date();
    }

    // Add note entry to history if new note content was provided
    if (req.body.newNote && req.body.newNote.trim()) {
      job.notesHistory.push({
        note: req.body.newNote.trim(),
        date: new Date(),
      });
      job.notes = req.body.newNote.trim();
    }

    await job.save();

    res.status(200).json({
      success: true,
      message: 'Job opportunity updated successfully',
      job,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete job opportunity
// @route   DELETE /api/jobs/:id
// @access  Private
export const deleteJob = async (req, res, next) => {
  try {
    const job = await JobOpportunity.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job opportunity not found or you do not have permission',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Job opportunity deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get dashboard statistics for current user
// @route   GET /api/jobs/stats
// @access  Private
export const getJobStats = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const allJobs = await JobOpportunity.find({ user: userId }).sort({
      createdAt: -1,
    });

    const statusCounts = {
      Saved: 0,
      Applied: 0,
      Interview: 0,
      Offer: 0,
      Rejected: 0,
    };

    allJobs.forEach((job) => {
      if (statusCounts[job.status] !== undefined) {
        statusCounts[job.status]++;
      }
    });

    const totalOpportunities = allJobs.length;
    const totalApplied =
      statusCounts.Applied +
      statusCounts.Interview +
      statusCounts.Offer +
      statusCounts.Rejected;

    // Current month submissions
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const applicationsThisMonth = allJobs.filter((job) => {
      const dateToCheck = job.applicationDate || job.createdAt;
      return new Date(dateToCheck) >= startOfMonth && job.status !== 'Saved';
    }).length;

    // Recent 5 opportunities
    const recentJobs = allJobs.slice(0, 5);

    // Upcoming interviews or follow-ups
    const upcomingEvents = allJobs
      .filter((j) => (j.interviewDate && new Date(j.interviewDate) >= now) || (j.followUpDate && new Date(j.followUpDate) >= now))
      .sort((a, b) => {
        const dateA = a.interviewDate || a.followUpDate;
        const dateB = b.interviewDate || b.followUpDate;
        return new Date(dateA) - new Date(dateB);
      })
      .slice(0, 5);

    // Monthly breakdown for the last 6 months
    const monthlyActivity = [];
    for (let i = 5; i >= 0; i--) {
      const monthDate = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const nextMonthDate = new Date(now.getFullYear(), now.getMonth() - i + 1, 1);
      const monthName = monthDate.toLocaleString('default', { month: 'short' });

      const count = allJobs.filter((job) => {
        const d = job.applicationDate || job.createdAt;
        const jobDate = new Date(d);
        return jobDate >= monthDate && jobDate < nextMonthDate;
      }).length;

      monthlyActivity.push({
        month: monthName,
        count,
      });
    }

    res.status(200).json({
      success: true,
      stats: {
        totalOpportunities,
        totalApplied,
        statusCounts,
        applicationsThisMonth,
        recentJobs,
        upcomingEvents,
        monthlyActivity,
      },
    });
  } catch (error) {
    next(error);
  }
};

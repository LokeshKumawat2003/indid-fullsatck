const mongoose = require('mongoose');

const interviewSessionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  startTime: { type: Date, default: Date.now },
  endTime: { type: Date },
  status: { type: String, enum: ['in_progress', 'completed', 'cancelled'], default: 'in_progress' },
  questionsAndAnswers: [
    {
      question: { type: String, required: true },
      userResponse: { type: String },
      aiResponse: { type: String },
      timestamp: { type: Date, default: Date.now },
    },
  ],
  overallFeedback: { type: String },
  score: { type: Number },
  nextRound: { type: Boolean, default: false },
});

const InterviewSession = mongoose.model('InterviewSession', interviewSessionSchema);

module.exports = InterviewSession;

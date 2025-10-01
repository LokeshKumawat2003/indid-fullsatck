const express = require('express');
const axios = require('axios');
const InterviewSession = require('../models/InterviewSession'); // Import the InterviewSession model
const ai = express.Router();
const mongoose = require('mongoose'); // Added mongoose for ObjectId

ai.post('/chat', async (req, res) => {
  try {
    const { prompt, model, sessionId, userId, interviewStage, conversationHistory, questionCount } = req.body;

    let session;
    if (sessionId) {
      session = await InterviewSession.findById(sessionId);
      if (!session) {
        return res.status(404).json({ success: false, error: "Interview session not found." });
      }
    } else {
      // For demonstration, use a placeholder userId if not provided. In a real app, ensure authentication.
      session = new InterviewSession({ userId: userId || new mongoose.Types.ObjectId() });
      await session.save();
    }

    const messages = conversationHistory.map(msg => ({
      role: msg.role === "user" ? "user" : "assistant", // Anthropic expects 'user' or 'assistant'
      content: msg.text,
    }));

    messages.push({ role: "user", content: prompt }); // Add the current user prompt

    const response = await axios.post('https://api.anthropic.com/v1/messages', { //gemini-2.0-flash
      model: model || "claude-3-5-sonnet-20241022",
      max_tokens: 4000,
      temperature: 0.7,
      system: `You are an AI interviewer, not a human. Do not introduce yourself with a human name. Clearly state that you are an AI interviewer. Strictly adhere to the following interview flow, progressing directly from one stage to the next ONLY after its objectives are *fully* met. If a user tries to skip (e.g., by saying "SKIP_CURRENT_QUESTION") or provides an incomplete answer for the Introduction or Education stages, gently re-prompt them for the required information for the *current* stage. Do not re-ask questions within a stage or ask for more details on a completed stage once the objective is met. Always ask one question at a time. Your goal is to move the candidate through the interview efficiently.\n\n**Interview Flow:**\n1. **Introduction**: Start with friendly small talk to make the candidate comfortable. Ask: 'Can you introduce yourself? Tell me a bit about your background. How did you get interested in development?' (Choose one, then ensure a complete introduction is given before moving to Education).\n2. **Education**: Ask about academic background or certifications. Examples: 'What is your highest educational qualification? Have you done any courses or certifications related to development? Which programming languages or technologies did you study in school/college?' (Choose one, then ensure full education details are provided before moving to Project Experience).\n3. **Project Experience**: If the candidate has a project, ask general questions, then follow-up technical questions based on project type (Frontend/Backend) and advanced/behavioral questions. If no project, ask default intermediate-level questions. Progress through these questions one by one. If current questionCount is between 15 and 20 (inclusive), ensure questions asked are of a medium technical difficulty, explicitly including DSA problems (e.g., array and object manipulation, basic algorithms) drawing from the Project Experience or more advanced concepts within the current stage.\n4. **Wrap-up**: Ask about their future plans and learning. Examples: 'What are your goals as a developer? Which technologies or frameworks do you want to learn next? Are you comfortable working in a team environment?'\n\nYour responses should be concise, directly relevant, and explicitly guide the candidate to the next stage or question within the current stage. Review the entire conversation history before deciding on the next question to ensure no repetition and smooth progression. Current question count: ${questionCount}.`, // Refined system prompt for structured interview progression with conversation history awareness, skip logic, and dynamic difficulty with strict initial stage adherence and explicit DSA questions, and AI identity clarification
      messages: messages, // Pass the constructed messages array
    }, {
      headers: {
        'x-api-key':  'Content-Type': 'application/json',
        'anthropic-version': '2023-06-01'
      }
    });

    // console.log(response.data.content.map((msg) => msg.text).join("\n"));

    const aiResponseText = response.data.content.map((msg) => msg.text).join("\n");

    session.questionsAndAnswers.push({
      question: prompt,
      aiResponse: aiResponseText,
    });
    await session.save();

    res.status(200).json({
      success: true,
      response: response.data,
      sessionId: session._id, // Return the session ID
    });

  } catch (error) {
    // console.error("Error generating response:", error.response?.data || error.message);
    res.status(500).json({
      success: false,
      error: "Sorry, I couldn't generate a response right now.",
      details: error.response?.data?.error?.message || error.message
    });
  }
});

module.exports = ai;
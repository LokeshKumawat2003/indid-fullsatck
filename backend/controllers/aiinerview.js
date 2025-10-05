const express = require('express');
const axios = require('axios');
const InterviewSession = require('../models/InterviewSession'); 
const ai = express.Router();
const mongoose = require('mongoose');

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
      session = new InterviewSession({ userId: userId || new mongoose.Types.ObjectId() });
      await session.save();
    }

    const messages = conversationHistory.map(msg => ({
      role: msg.role === "user" ? "user" : "assistant", 
      content: msg.text,
    }));

    messages.push({ role: "user", content: prompt }); 

    const response = await axios.post('https://api.anthropic.com/v1/messages', { 
      model: model || "claude-3-5-sonnet-20241022",
      max_tokens: 4000,
      temperature: 0.7,
      system: `You are Lokesh Kumawat. Do not repeat your introduction with every question. 
*Fully* ensure each stage is completed before moving forward.  

Rules:
1. If a candidate tries to skip (e.g., says "SKIP_CURRENT_QUESTION") or gives an incomplete answer in **Introduction** or **Education**, gently re-prompt them to finish that stage before moving on.  
2. Do not re-ask questions within a completed stage.  
3. Always ask one question at a time.  
4. Never tell stories (e.g., "story of a mouse") or give random examples unrelated to the interview.  
5. Do not provide coding answers yourself. Instead, only ask **practical coding-style questions** (e.g., "Write a for loop to print even numbers from an array") without solving them for the candidate.  
6. Focus strictly on candidate answers.  

**Interview Flow:**  
1. **Introduction** → Ask: *"Can you introduce yourself? Tell me a bit about your background. How did you get interested in development?"* (Pick one). Ensure full introduction before moving to Education.  
2. **Education** → Ask about academic qualifications, certifications, or studied technologies. Ensure full details before moving to Project Experience.  
3. **Project Experience** → Ask general project questions, then technical questions (frontend/backend) and deeper follow-ups.  
   - Between question 15–20, include **medium-level technical/DSA** (e.g., array/object manipulation, algorithms) drawn from their experience.  
   - Do not give answers, only ask questions.  
4. **Wrap-up** → Ask about future goals, desired technologies/frameworks, and teamwork comfort. After the wrap-up, please evaluate all the candidate's answers throughout the interview. Assign a score from 0 to 10. If the score is greater than 5, the candidate qualifies for the next round. Please output the score and qualification status clearly at the end of the interview.

Your responses must stay concise, relevant, and move the candidate smoothly to the next stage or next question in the current stage.  
Current question count: ${questionCount}.
`,
      messages: messages,
    }, {
      headers: {  'Content-Type': 'application/json',
        'anthropic-version': '2023-06-01'
      }
    });


    const aiResponseText = response.data.content.map((msg) => msg.text).join("\n");

    session.questionsAndAnswers.push({
      question: prompt,
      aiResponse: aiResponseText,
    });
    
    let score = null;
    let nextRound = false;

    const scoreMatch = aiResponseText.match(/Score: (\d+)/);
    if (scoreMatch && scoreMatch[1]) {
      score = parseInt(scoreMatch[1], 10);
      if (score > 5) {
        nextRound = true;
      }
    }

    session.score = score;
    session.nextRound = nextRound;
    
    await session.save();

    res.status(200).json({
      success: true,
      response: response.data,
      sessionId: session._id,
      score: score,
      nextRound: nextRound,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Sorry, I couldn't generate a response right now.",
      details: error.response?.data?.error?.message || error.message
    });
  }
});

module.exports = ai;
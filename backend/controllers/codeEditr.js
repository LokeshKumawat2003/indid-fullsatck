// codeediter.js
const express = require('express');
const axios = require('axios');
const mongoose = require('mongoose');
const InterviewSession = require('../models/InterviewSession'); // your Mongoose model

const codeediter = express.Router();

codeediter.post('/code', async (req, res) => {
  try {
    const { prompt, model, sessionId, userId, conversationHistory } = req.body;

    // Load or create interview session
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

    // Construct messages for Anthropic
    const systemMessage = `
    You are a strict DSA and JavaScript code executor. 
    You only execute and return the **raw code output** or the code itself when requested. 
    Do NOT add explanations, comments, or any extra text. 
    You only solve DSA, algorithm, and related JavaScript problems. Any unrelated input should return "undefined".
    
    Rules:
    
    1. Input: Only JavaScript code related to DSA or algorithm problems.
    2. Output: Only the direct result of code execution (console.log outputs or return values).
    3. If the user tries to run non-DSA code or unrelated operations, return "undefined".
    4. Multiple outputs should be separated by line breaks.
    5. Do not modify the logic of the input code.
    6. Only allow DSA structures: loops (for, while), recursion, arrays, objects, strings, sorting, searching, math, stacks, queues, trees, linked lists, graphs.
    7. Always return console.log outputs or function return values exactly.
    8. If the input is a for loop, while loop, or recursion, execute and return outputs only.
    9. Any other non-DSA input or invalid JavaScript returns "undefined".
    10. Follow this strictly like a code execution platform (similar to Replit or an online judge).
   11. use give the rendom input without console and return in responces send the undefind like 1. check even odd , write for loop and more type example add and update
    Example inputs and outputs:
    
    Input:
    function isPalindrome(str){
      let i=0,j=str.length-1;
      while(i<j){if(str[i]!==str[j]) return false; i++; j--;}
      return true;
    }
    console.log(isPalindrome('madam'));
    
    Output:
    true
    
    Input:
    const arr=[1,2,3,4];
    console.log(arr.map(x=>x*2));
    
    Output:
    [2,4,6,8]
    
    Input:
    for (let i=0;i<5;i++){ console.log(i); }
    
    Output:
    0
    1
    2
    3
    4
    
    Input:
    let x = 10 + 5;
    
    Output:
    undefined
    
    Input:
    function factorial(n){ return n<=1?1:n*factorial(n-1); }
    console.log(factorial(5));
    
    Output:
    120
    `;
    
    const messages = [
      ...(conversationHistory || []).map(msg => ({
        role: msg.role === "user" ? "user" : "assistant",
        content: msg.text
      })),
      { role: "user", content: prompt }
    ];

    // Call Anthropic API
    const response = await axios.post(
      'https://api.anthropic.com/v1/messages',
      {
        model: model || "claude-3-5-sonnet-20241022",
        max_tokens: 4000,
        temperature: 0.7,
        system: systemMessage, // Add system message here
        messages
      },
      {
        headers: {
          'x-api-key': 
          'Content-Type': 'application/json',
          'anthropic-version': '2023-06-01'
        }
      }
    );

    // Extract raw output
    const aiResponseText = response.data?.content?.[0]?.text || "";

    // Save question & answer to session
    session.questionsAndAnswers.push({
      question: prompt,
      aiResponse: aiResponseText
    });
    await session.save();

    // Return only raw output and sessionId
    res.status(200).json({
      success: true,
      output: aiResponseText,
      sessionId: session._id
    });

  } catch (error) {
    console.error(error.response?.data || error.message);
    res.status(500).json({
      success: false,
      error: "Couldn't generate a response right now.",
      details: error.response?.data?.error?.message || error.message
    });
  }
});

module.exports = codeediter;

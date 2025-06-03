import { SUMMARY_SYSTEM_PROMPT } from "@/utils/prompts";
import { GoogleGenerativeAI } from '@google/generative-ai'

// const GEMINI_API_URL = "https://gemini.googleapis.com/v1/chat/completions";
// const API_KEY = process.env.GEMINI_API_KEY;
// const SUMMARY_SYSTEM_PROMPT = `You are a helpful assistant that summarizes documents with emojis and markdown formatting.`;


// export async function generateSummaryFromGemini(pdfText: string) {
//   try {
//     const body = {
//       model: "gemini-1.5-pro-002",

//       messages: [
//         {
//           role: "system",
//           content: SUMMARY_SYSTEM_PROMPT,
//         },
//         {
//           role: "user",
//           content: `Transform this document into an engaging, easy-to-read summary with contextually relevant emojis and proper markdown formatting:\n\n${pdfText}`,
//         },
//       ],
//       temperature: 0.7,
//       maxTokens: 1500,
//     };

//     const response = await fetch(GEMINI_API_URL, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${API_KEY}`,
//       },
//       body: JSON.stringify(body),
//     });
//     if (!response.text()) {
//       throw new Error("Empty repsonse from Gemini API");
//     }
//     const text = await response.text();

//     if (!text) {
//       throw new Error("Empty response from Gemini API");
//     }

//     return text;

//   } catch (error: any) {
//     throw error;
//   }
// }

// export async function generateSummaryFromGemini(pdfText: string) {
//   try {
//     const body = {
//       model: "gemini-1.5-pro-002",
//       messages: [
//         {
//           role: "system",
//           content: SUMMARY_SYSTEM_PROMPT,
//         },
//         {
//           role: "user",
//           content: `Transform this document into an engaging, easy-to-read summary with contextually relevant emojis and proper markdown formatting:\n\n${pdfText}`,
//         },
//       ],
//       temperature: 0.7,
//       maxTokens: 1500,
//     };

//     const response = await fetch(GEMINI_API_URL, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${API_KEY}`,
//       },
//       body: JSON.stringify(body),
//     });

//     const text = await response.text(); // ✅ Read once

//     if (!text) {
//       throw new Error("Empty response from Gemini API");
//     }

//     return text;
//   } catch (error: any) {
//     if(error?.status === 429)
//     {
//       throw new Error("RATE_LIMIT_EXCEEDED");
//     }

//     throw error;
//   }
// }

// Initialize the Gemini API with your API key 
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export const generateSummaryFromGemini = async (pdfText: string) => {
  try {
    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-flash-002',
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 1500
      }
    });
    const prompt = {
      contents: [
        {
          role: 'user',
          parts: [
            { text: SUMMARY_SYSTEM_PROMPT },
            {
              text: `Transform this document into an engaging, easy - to - read summary with contextually relevant emojis and proper markdown formatting:\n\n${pdfText}`,
            },
          ],
        },
      ]
    };

    const result = await model.generateContent(prompt);
    const response = await result.response;

    if(!response.text()){
      throw new Error("Empty response from Gemini API");
    }
    return response.text();

  } catch (error: any) {
    // if (error?.status === 429) {
    //   throw new Error('RATE_LIMIT_EXCEEDED');
    // }
    console.error('Gemini API Error:', error);
    throw error;
  }

};
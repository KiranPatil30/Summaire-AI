'use server'

import { getDbConnection } from "@/lib/db";
import { generateSummaryFromGemini } from "@/lib/geminiai";
import { fetchAndExtractPdfText } from "@/lib/langchain";
import { generateSummaryFromOpenAI } from "@/lib/openai";
import { formatFileNameAsTitle } from "@/utils/format-utils";
import { auth } from "@clerk/nextjs/server";
import { AwardIcon } from "lucide-react";
import { revalidatePath } from "next/cache";

// export async function generatePdfText({
//     pdfUrl,
    
// }:{
//     pdfUrl: string;
   
// }) {
//     if (!pdfUrl) {
//         return {
//             success: false,
//             message: 'pdf url is missing',
//             data: null,

//         }
//     };

//     try {
//         const pdfText = await fetchAndExtractPdfText(pdfUrl);
//         console.log("pdftest-------------------------------------------------", { pdfText });
//         let summary;
//         // try {
//         //     summary = await generateSummaryFromOpenAI(pdfText);
//         //     console.log("Summary from openai==================================================================", { summary });

//         // } catch (error) {
//         //     console.log(error);
//         //     //cal gemini
//         //     if (error instanceof Error && error.message === 'RATE_LIMITED_EXCEEDED') {
//         //         try {
//         //             summary = await generateSummaryFromGemini(pdfText);
//         //             console.log("Summary from Gemini==================================================================", { summary });
//         //         } catch (geminiError) {
//         //             console.error(
//         //                 'Gemini API error', geminiError);
//         //             throw new Error('Failed to generate summary with available AI providers');
//         //         }
//         //     }

//         // }

//         if (!pdfText) {
//             return {
//                 success: false,
//                 message: 'summary generation failed',
//                 data: null,
//             }
//         }
//         // const formattedFileName = formatFileNameAsTitle(fileName);
//         return {
//             success: true,
//             message: 'PDF Text generated successfully',
//             data: {
//                 summary,
//             },

//         }
//     } catch (err) {
//         return {
//             success: false,
//             message: "error message",
//             data: null,

//         }
//     }
// }

export async function generatePdfText({
  pdfUrl,
}: {
  pdfUrl: string;
}) {
  if (!pdfUrl) {
    return {
      success: false,
      message: 'PDF URL is missing',
      data: null,
    };
  }

  try {
    const pdfText = await fetchAndExtractPdfText(pdfUrl);
    console.log("pdftest-------------------------------------------------", { pdfText });

    if (!pdfText) {
      return {
        success: false,
        message: 'Failed to extract text from PDF.',
        data: null,
      };
    }

    return {
      success: true,
      message: 'PDF text extracted successfully.',
      data: {
        pdfText,  // ⬅️ Return the extracted text here
      },
    };
  } catch (err) {
    console.error('Error while extracting PDF text:', err);
    return {
      success: false,
      message: 'An unexpected error occurred during text extraction.',
      data: null,
    };
  }
}


export async function generatePdfSummary(uploadResponse: [{
    serverData:
    {
        userId: string;
        file: {
            url: string;
            name: string;
        };
    };
}]) {
    if (!uploadResponse) {
        return {
            success: false,
            message: 'file upload failed',
            data: null,
        };
    }

    const {
        serverData: {
            userId,
            file: { url: pdfUrl, name: fileName },
        },
    } = uploadResponse[0];


    if (!pdfUrl) {
        return {
            success: false,
            message: 'pdf url is missing',
            data: null,

        }
    };

    try {
        const pdfText = await fetchAndExtractPdfText(pdfUrl);
        console.log("pdftest-------------------------------------------------", { pdfText });
        let summary;
        try {
            summary = await generateSummaryFromOpenAI(pdfText);
            console.log("Summary from openai==================================================================", { summary });

        } catch (error) {
            console.log(error);
            //cal gemini
            if (error instanceof Error && error.message === 'RATE_LIMITED_EXCEEDED') {
                try {
                    summary = await generateSummaryFromGemini(pdfText);
                    console.log("Summary from Gemini==================================================================", { summary });
                } catch (geminiError) {
                    console.error(
                        'Gemini API error', geminiError);
                    throw new Error('Failed to generate summary with available AI providers');
                }
            }

        }

        if (!summary) {
            return {
                success: false,
                message: 'summary generation failed',
                data: null,
            }
        }
        const formattedFileName = formatFileNameAsTitle(fileName);
        return {
            success: true,
            message: 'summary generated',
            data: {
                title: formattedFileName,
                summary,
            },

        }
    } catch (err) {
        return {
            success: false,
            message: "error message",
            data: null,

        }
    }
}


// 'use server'

// import { getDbConnection } from "@/lib/db";
// import { generateSummaryFromGemini } from "@/lib/geminiai";
// import { fetchAndExtractPdfText } from "@/lib/langchain";
// import { generateSummaryFromOpenAI } from "@/lib/openai";
// import { formatFileNameAsTitle } from "@/utils/format-utils";
// import { auth } from "@clerk/nextjs/server";

interface PdfSummaryType {
    userId?: string;
    fileUrl: string;
    summary: string;
    title: string;
    fileName: string;
}
// export async function generatePdfSummary(uploadResponse: [{
//     serverData: {
//         userId: string;
//         file: {
//             url: string;
//             name: string;
//         };
//     };
// }]) {
//     if (!uploadResponse || !uploadResponse[0]?.serverData?.file?.url) {
//         return {
//             success: false,
//             message: 'Invalid upload response or missing PDF URL',
//             data: null,
//         };
//     }

//     const {
//         serverData: {
//             userId,
//             file: { url: pdfUrl, name: fileName },
//         },
//     } = uploadResponse[0];
//     if (!pdfUrl) {
//         return {
//             success: false,
//             message: 'pdf url is missing',
//             data: null,

//         }
//     };
//     try {
//         const pdfText = await fetchAndExtractPdfText(pdfUrl);
//         console.log("Extracted PDF text:", { pdfText });

//         let summary;

//         // Attempt OpenAI first
//         try {
//             summary = await generateSummaryFromOpenAI(pdfText);
//             console.log("Summary from OpenAI:", { summary });
//         } catch (error: any) {
//             console.error("OpenAI error:", error);

//             // Handle OpenAI rate limit
//             if (error instanceof Error && error.message === 'RATE_LIMITED_EXCEEDED') {
//                 console.log("OpenAI rate limit hit. Falling back to Gemini...");

//                 try {
//                     summary = await generateSummaryFromGemini(pdfText);
//                     console.log("Summary from Gemini:", { summary });
//                     // const formattedFileName = formatFileNameAsTitle(fileName);
//                     // return {
//                     //     success: true,
//                     //     message: 'Summary generated successfully',
//                     //     data: {
//                     //         title: formattedFileName,
//                     //         summary: summary,
//                     //     }
//                     // }
//                 } catch (geminiError) {
//                     console.error(
//                         'Gemini API error', geminiError);
//                     throw new Error('Failed to generate summary with available AI providers');

//                 }
//             } else {
//                 return {
//                     success: false,
//                     message: 'OpenAI summary failed unexpectedly.',
//                     data: null,
//                 };
//             }
//         }

//         if (!summary) {
//             return {
//                 success: false,
//                 message: 'Summary generation returned empty.',
//                 data: null,
//             };
//         }

//         return {
//             success: true,
//             message: 'Summary generated successfully.',
//             data: {
//                 summary,
//             },
//         };

//     } catch (err: any) {
//         console.error("Unexpected error in generatePdfSummary:", err);
//         return {
//             success: false,
//             message: err?.message || 'An unknown error occurred.',
//             data: null,
//         };
//     }
// }


async function savePdfSummary({ userId, fileUrl, summary, title, fileName }: PdfSummaryType) {
    // sql inseerting pdf summary 
    try {
        const sql = await getDbConnection()
        const [savedSummary] = await sql`INSERT INTO pdf_summaries (
        user_id,
        original_file_url,
        summary_text,
        title,
        file_name
    ) VALUES (
        ${userId}
        ,${fileUrl}
        ,${summary}
        ,${title}
        ,${fileName}

    ) RETURNING id, summary_text`;
        return savedSummary;
    } catch (error) {
        console.log('Error saving pdf_summaries', error);
        throw error;
    }

}
// export async function storePdfSummaryAction({
//     userId,
//     fileUrl,
//     summary,
//     title,
//     fileName,
// }: PdfSummaryType) {

//     let savedSummary: any;
//     try {
//         const { userId } = await auth();
//         if (!userId) {
//             return {
//                 success: false,
//                 message: 'USer not found',
//                 data: null,

//             };
//         }
//         savedSummary = await savePdfSummary({
//             userId,
//             fileUrl,
//             summary,
//             title,
//             fileName,
//         });

//         if (!savedSummary) {
//             return {
//                 success: false,
//                 message: 'Failed to save pdf summary',
//                 data: null,
//             }
//         }
//         return {
//             success: true,
//             message: 'Pdf summary saved',

//         }
//     } catch (error) {
//         return {
//             success: false,
//             message: error instanceof Error ? error.message : "Error saving PDF summary",
//             data: null,

//         };
//     }

//     revalidatePath(`/summaries/${savedSummary.id}`);
//     return {
//         success: true,
//         message: 'Pdf summary saved',
//         data: {
//             id: savedSummary.id,
//         }

//     }
// }

export async function storePdfSummaryAction({
    fileUrl,
    summary,
    title,
    fileName,
}: Omit<PdfSummaryType, 'userId'>) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return {
                success: false,
                message: 'User not found',
                data: null,
            };
        }

        const savedSummary = await savePdfSummary({
            userId,
            fileUrl,
            summary,
            title,
            fileName,
        });

        if (!savedSummary) {
            return {
                success: false,
                message: 'Failed to save PDF summary',
                data: null,
            };
        }

        revalidatePath(`/summaries/${savedSummary.id}`);

        return {
            success: true,
            message: 'PDF summary saved',
            data: {
                id: savedSummary.id,
            },
        };
    } catch (error) {
        return {
            success: false,
            message: error instanceof Error ? error.message : 'Error saving PDF summary',
            data: null,
        };
    }
}

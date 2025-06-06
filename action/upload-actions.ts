"use server";

import { getDbConnection } from "@/lib/db";
import { generateSummaryFromGemini } from "@/lib/geminiai";
import { fetchAndExtractPdfText } from "@/lib/langchain";
import { generateSummaryFromOpenAI } from "@/lib/openai";
import { formatFileNameAsTitle } from "@/utils/format-utils";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export async function generatePdfText({ pdfUrl }: { pdfUrl: string }) {
  if (!pdfUrl) {
    return {
      success: false,
      message: "PDF URL is missing",
      data: null,
    };
  }

  try {
    const pdfText = await fetchAndExtractPdfText(pdfUrl);

    if (!pdfText) {
      return {
        success: false,
        message: "Failed to extract text from PDF.",
        data: null,
      };
    }

    return {
      success: true,
      message: "PDF text extracted successfully.",
      data: {
        pdfText,
      },
    };
  } catch (err) {
    console.error("Error while extracting PDF text:", err);
    return {
      success: false,
      message: "An unexpected error occurred during text extraction.",
      data: null,
    };
  }
}

export async function generatePdfSummary({
  pdfUrl,
  fileName,
}: {
  pdfUrl: string;
  fileName: string;
}) {
  if (!pdfUrl) {
    return {
      success: false,
      message: "PDF URL is missing",
      data: null,
    };
  }

  try {
    const pdfText = await fetchAndExtractPdfText(pdfUrl);
    let summary;

    try {
      summary = await generateSummaryFromOpenAI(pdfText);
    } catch (error) {
      console.error("Error with OpenAI:", error);
      if (error instanceof Error && error.message === "RATE_LIMITED_EXCEEDED") {
        try {
          summary = await generateSummaryFromGemini(pdfText);
        } catch (geminiError) {
          console.error("Gemini API error:", geminiError);
          throw new Error(
            "Failed to generate summary with available AI providers",
          );
        }
      }
    }

    if (!summary) {
      return {
        success: false,
        message: "Summary generation failed",
        data: null,
      };
    }

    const formattedFileName = formatFileNameAsTitle(fileName);
    return {
      success: true,
      message: "Summary generated",
      data: {
        title: formattedFileName,
        summary,
      },
    };
  } catch (err) {
    console.error("Error during summary generation:", err);
    return {
      success: false,
      message: "An unexpected error occurred during summary generation.",
      data: null,
    };
  }
}

interface PdfSummaryType {
  userId?: string;
  fileUrl: string;
  summary: string;
  title: string;
  fileName: string;
}

async function savePdfSummary({
  userId,
  fileUrl,
  summary,
  title,
  fileName,
}: PdfSummaryType) {
  try {
    const sql = await getDbConnection();
    const [savedSummary] = await sql`
      INSERT INTO pdf_summaries (
        user_id,
        original_file_url,
        summary_text,
        title,
        file_name
      ) VALUES (
        ${userId},
        ${fileUrl},
        ${summary},
        ${title},
        ${fileName}
      )
      RETURNING id, summary_text;
    `;
    return savedSummary;
  } catch (error) {
    console.error("Error saving pdf_summaries:", error);
    throw error;
  }
}

export async function storePdfSummaryAction({
  fileUrl,
  summary,
  title,
  fileName,
}: Omit<PdfSummaryType, "userId">) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return {
        success: false,
        message: "User not found",
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
        message: "Failed to save PDF summary",
        data: null,
      };
    }

    revalidatePath(`/summaries/${savedSummary.id}`);

    return {
      success: true,
      message: "PDF summary saved",
      data: {
        id: savedSummary.id,
      },
    };
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Error saving PDF summary",
      data: null,
    };
  }
}

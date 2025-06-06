

import { getDbConnection } from "./db";

// Get all summaries for a user
export async function getSummaries(userId: string) {
    const sql = await getDbConnection();
    const query = await sql`
        SELECT * 
        FROM pdf_summaries 
        WHERE user_id = ${userId} 
        ORDER BY created_at DESC
    `;
    return query;
}

// Get a single summary by its unique ID
export async function getSummaryById(id: string) {
    try {
        const sql = await getDbConnection();
        const [summary] = await sql`
            SELECT 
                id,
                user_id,
                title,
                original_file_url,
                summary_text, 
                created_at,
                updated_at,
                status,
                file_name,
                LENGTH(summary_text) - LENGTH(REPLACE(summary_text, ' ', '')) + 1 AS word_count
            FROM pdf_summaries 
            WHERE id = ${id}
        `;
        return summary;
    } catch (error) {
        console.error("Error fetching summary by ID:", error);
        return null;
    }
}

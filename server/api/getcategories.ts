import { defineEventHandler } from 'h3';

export default defineEventHandler(async (event) => {
    try {
        const sql = usePostgres();

        const categoriesQuery = `
            SELECT 
                categories.id, 
                categories.name,
                categories.slug
            FROM categories
        `;

        const categories = await sql.unsafe(categoriesQuery);
        event.waitUntil(sql.end());

        return { success: true, categories };
    } catch (error) {
        console.error('Error fetching categories data:', error);
        return { success: false, message: 'Database error' };
    }
});

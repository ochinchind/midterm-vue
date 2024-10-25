import { defineEventHandler } from 'h3';

export default defineEventHandler(async (event) => {
    const { id } = event.context.params;

    try {
        const sql = usePostgres();

        const userQuery = 'SELECT * FROM users WHERE id = $1';
        const result = await sql`SELECT id, username, email, activated, age, location, rating, last_activity FROM users WHERE id = ${id}`;
        event.waitUntil(sql.end());

        if (result.length === 0) {
            return { success: false, message: 'User not found' };
        }

        return { success: true, user: result[0] };
    } catch (error) {
        console.error('Error fetching user data:', error);
        return { success: false, message: 'Database error' };
    }
});

export default defineEventHandler(async (event) => {
    const body = await readBody(event);
    const headers = event.req.headers;
    const sqlSelect = usePostgres();
    const sqlInsert = usePostgres();

    try {
        const authHeader = headers['authorization'];
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
          return { success: false, message: 'Authorization header missing or invalid' };
        }

        const token = authHeader.split(' ')[1];

        const userResult = await sqlSelect`SELECT * FROM users WHERE token = ${token}`;

        event.waitUntil(sqlSelect.end())
        if (userResult.length == 0) {
            return { success: false, message: 'User does not exist' };
        }

        if (userResult[0].redeem_code != body.code) {
            return { success: false, message: 'Code is not valid!' };
        }

        await sqlInsert`
            UPDATE users SET activated = true WHERE id = ${userResult[0].id}
        `;

        return { success: true, message: `Successfully activated user` };
    } catch (error) {
        console.log('Error connecting to PostgreSQL:', error);
        return { success: false, message: 'Database error' };
    } finally {
        await sqlInsert.end();
    }
});
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export default defineEventHandler(async (event) => {
    const body = await readBody(event);
    const sql = usePostgres();
    const sqlUpdate = usePostgres();

    try {
        const userResult = await sql`
            SELECT * FROM users WHERE username = ${body.username}
        `;

        event.waitUntil(sql.end())

        if (userResult.length === 0) {
            return { success: false, message: 'User not found' };
        }

        const user = userResult[0];

        const isMatch = await bcrypt.compare(body.password, user.password);
        if (!isMatch) {
            return { success: false, message: 'Invalid password' };
        }

        const userId = userResult[0].id;

        var token = userResult[0].token;

        if (token == null) {
            token = jwt.sign({ userId, username: body.username }, process.env.JWT_SECRET_KEY, {
                expiresIn: '300d',
            });

            await sqlUpdate`UPDATE users SET token = ${token} WHERE id = ${userId}`

            sqlUpdate.end()
        }

        return {
            success: true,
            message: 'Login successful',
            userId: user.id,
            activated: user.activated,
            token: token,
        };
    } catch (error) {
        console.log('Error connecting to PostgreSQL:', error);
        return { success: false, message: 'Database error' };
    } finally {
        await sql.end();
    }
});
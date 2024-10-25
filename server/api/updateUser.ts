import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

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

        const { email, username, password } = body;

        const hashedPassword = await bcrypt.hash(password, 10);

        const isEmailChanged = userResult[0].email !== email;

        await sqlInsert`
          UPDATE users 
          SET email = ${email}, username = ${username}, password = ${hashedPassword}, activated = ${isEmailChanged ? false : userResult[0].activated}
          WHERE id = ${userResult[0].id}
        `;
    
        event.waitUntil(sqlInsert.end());

        return { success: true, message: `User is changed` };
    } catch (error) {
        console.log('Error connecting to PostgreSQL:', error);
        return { success: false, message: 'Database error' };
    } finally {
        await sqlInsert.end();
    }
});
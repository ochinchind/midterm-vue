import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const sqlSelect = usePostgres();
  const sqlInsert = usePostgres();
  const sqlUpdate = usePostgres();

  try {

    const userResult = await sqlSelect`SELECT * FROM subscribed_emails WHERE email = ${body.email}`;

    event.waitUntil(sqlSelect.end())
    if (userResult.length != 0) {
        return { success: true, message: 'User already subscribed!' };
    }

      const result = await sqlInsert`
          INSERT INTO subscribed_emails (email)
          VALUES (${body.email}) RETURNING id
      `;
      event.waitUntil(sqlInsert.end())

      return {
          success: true,
          message: 'Subscribed to news',
          userId: result[0].id,
      };
  } catch (error) {
      console.log('Error connecting to PostgreSQL:', error);
      return { success: false, message: 'Database error' };
  } finally {
      await sqlInsert.end();
  }
});
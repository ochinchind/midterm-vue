import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const sqlSelect = usePostgres();
  const sqlInsert = usePostgres();
  const sqlUpdate = usePostgres();

  try {
      const userResult = await sqlSelect`SELECT * FROM users WHERE username = ${body.username} OR email = ${body.email}`;

      event.waitUntil(sqlSelect.end())
      if (userResult.length > 0) {
          return { success: false, message: 'User already exists with that username or email' };
      }

      const hashedPassword = await bcrypt.hash(body.password, 10);

      const insertQuery = `
          INSERT INTO users (username, email, password, activated, age, location, last_activity, rating, avatar)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id
      `;

      const result = await sqlInsert`
          INSERT INTO users (username, email, password)
          VALUES (${body.username}, ${body.email}, ${hashedPassword}) RETURNING id
      `;
      event.waitUntil(sqlInsert.end())

        const userId = result[0].id;

        const token = jwt.sign({ userId, username: body.username }, process.env.JWT_SECRET_KEY, {
            expiresIn: '300d',
        });

        await sqlUpdate`UPDATE users SET token = ${token} WHERE id = ${userId}`

        sqlUpdate.end()

      return {
          success: true,
          message: 'User registered successfully',
          userId: result[0].id,
          token: token,
      };
  } catch (error) {
      console.log('Error connecting to PostgreSQL:', error);
      return { success: false, message: 'Database error' };
  } finally {
      await sqlInsert.end();
  }
});
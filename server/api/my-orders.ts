import { defineEventHandler } from 'h3';
import { Helper, Parameter, SerializableParameter, Fragment } from 'postgres';

export default defineEventHandler(async (event) => {
  try {
    const headers = event.req.headers;
    const authHeader = headers['authorization'];

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return { success: false, message: 'Unauthorized' };
    }

    const token = authHeader.split(' ')[1];

    const sql = usePostgres();

    const userResult = await sql`
      SELECT id FROM users WHERE token = ${token}::text
    `;

    if (userResult.length === 0) {
      return { success: false, message: 'Invalid token or user not found' };
    }

    const userId = userResult[0].id;

    const orders = await sql`
      SELECT 
        id, 
        products, 
        address, 
        comment, 
        telephone, 
        payment_method, 
        full_name, 
        user_id, 
        status
      FROM checkouts 
      WHERE user_id = ${userId}
    `;

    return { success: true, orders: orders };
  } catch (error) {
    console.error('Error fetching orders:', error);
    return { success: false, message: 'Database error' };
  }
});

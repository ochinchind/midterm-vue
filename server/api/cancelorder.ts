import { defineEventHandler } from 'h3';
import { Helper, Parameter, SerializableParameter, Fragment } from 'postgres';

export default defineEventHandler(async (event) => {
  try {
    const headers = event.req.headers;
    const body = await readBody(event);
    const authHeader = headers['authorization'];

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return { success: false, message: 'Unauthorized' };
    }

    const token = authHeader.split(' ')[1];

    const sql = usePostgres();

    // Verify the user based on the token
    const userResult = await sql`
      SELECT id FROM users WHERE token = ${token}::text
    `;

    if (userResult.length === 0) {
      return { success: false, message: 'Invalid token or user not found' };
    }

    const userId = userResult[0].id;

    // Parse the request body to get the order ID
    const orderId = body.orderId;

    // Check if the order exists and belongs to the authenticated user
    const orderResult = await sql`
      SELECT id, status FROM checkouts WHERE id = ${orderId} AND user_id = ${userId}
    `;

    if (orderResult.length === 0) {
      return { success: false, message: 'Order not found or does not belong to the user' };
    }

    const order = orderResult[0];

    // If the order is already canceled, return an appropriate message
    if (order.status === 'canceled') {
      return { success: false, message: 'Order already canceled' };
    }

    // Update the order status to 'canceled'
    await sql`
      UPDATE checkouts SET status = 'canceled' WHERE id = ${orderId}
    `;

    return { success: true, message: 'Order canceled successfully' };
  } catch (error) {
    console.error('Error canceling order:', error);
    return { success: false, message: 'Database error' };
  }
});

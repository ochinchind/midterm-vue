import { defineEventHandler, readBody } from 'h3';

export default defineEventHandler(async (event) => {
    const body = await readBody(event);
    const headers = event.req.headers;

    try {
        const sql = usePostgres();

        // Authorization and user validation
        const authHeader = headers['authorization'];
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return { success: false, message: 'Authorization header missing or invalid' };
        }

        const token = authHeader.split(' ')[1];
        const userResult = await sql`
        SELECT id FROM users WHERE token = ${token}::text
    `;
        if (userResult.length === 0) {
            return { success: false, message: 'User does not exist or token invalid' };
        }

        const userId = userResult[0].id;

        const cartResult = await sql`
            SELECT id FROM cart WHERE user_id = ${userId} AND status = 1
        `;
        let cartId;

        if (cartResult.length === 0) {
            const newCart = await sql`
                INSERT INTO cart (user_id, status) VALUES (${userId}, 1) RETURNING id
            `;
            cartId = newCart[0].id;
        } else {
            cartId = cartResult[0].id;
        }

        const cartProductResult = await sql`
            SELECT id FROM cart_products WHERE cart_id = ${cartId} AND product_id = ${body.product_id}
        `;

        if (cartProductResult.length > 0) {
            await sql`
                DELETE FROM cart_products WHERE cart_id = ${cartId} AND product_id = ${body.product_id}
            `;
            return { success: true, message: 'Product removed from cart' };
        } else {
            await sql`
                INSERT INTO cart_products (cart_id, product_id) VALUES (${cartId}, ${body.product_id})
            `;
            return { success: true, message: 'Product added to cart' };
        }

    } catch (error) {
        console.error('Error adding to cart:', error);
        return { success: false, message: 'Database error' };
    }
});

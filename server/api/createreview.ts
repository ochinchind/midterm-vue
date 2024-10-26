import { defineEventHandler, readBody } from 'h3';

export default defineEventHandler(async (event) => {
    const body = await readBody(event);
    const headers = event.req.headers;

    try {
        const sql = usePostgres();

        // Check if the product exists
        const productResult = await sql`
            SELECT id FROM products WHERE id = ${body.product_id}
        `;
        if (productResult.length === 0) {
            return { success: false, message: 'Product not found' };
        }

        // Authorization and user validation
        const authHeader = headers['authorization'];
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return { success: false, message: 'Authorization header missing or invalid' };
        }

        const token = authHeader.split(' ')[1];
        const userResult = await sql`
            SELECT id FROM users WHERE token = ${token}
        `;
        if (userResult.length === 0) {
            return { success: false, message: 'User does not exist or token invalid' };
        }

        const userId = userResult[0].id;

        if (body.rating == null || !body.text) {
            return { success: false, message: 'Rating and review text are required!' };
        }

        await sql`
            INSERT INTO products_reviews (product_id, user_id, rating, text, created_at)
            VALUES (${body.product_id}, ${userId}, ${body.rating}, ${body.text}, NOW())
        `;

        const avgRatingResult = await sql`
            SELECT AVG(rating) as avg_rating FROM products_reviews WHERE product_id = ${body.product_id}
        `;
        const avgRating = avgRatingResult[0].avg_rating;

        await sql`
            UPDATE products SET rating = ${avgRating} WHERE id = ${body.product_id}
        `;

        return { success: true, message: 'Review added successfully and product rating updated' };

    } catch (error) {
        console.error('Error creating review data:', error);
        return { success: false, message: 'Database error' };
    }
});

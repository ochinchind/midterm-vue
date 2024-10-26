import { defineEventHandler } from 'h3';

export default defineEventHandler(async (event) => {
    const { id } = event.context.params;

    try {
        const sql = usePostgres();

        // Fetch product details
        const productQuery = `SELECT products.id, products.name, products.description, products.category_id, products.rating, products.price, c.name as category_name
            FROM products 
            LEFT JOIN categories c ON products.category_id = c.id WHERE products.id = ${id}`;

        const productResult = await sql.unsafe(productQuery);

        if (productResult.length === 0) {
            return { success: false, message: 'Product not found' };
        }

        const product = productResult[0];

        // Fetch all images for the product
        const imagesQuery = `SELECT photo AS image_url FROM products_images WHERE product_id = ${id}`;
        const imagesResult = await sql.unsafe(imagesQuery);

        // Fetch all reviews for the product
        const reviewsQuery = `
            SELECT r.user_id, r.text, r.rating, r.created_at, u.username, u.last_activity
            FROM products_reviews r
            LEFT JOIN users u ON r.user_id = u.id
            WHERE r.product_id = ${id}
            ORDER BY r.created_at DESC
        `;
        const reviewsResult = await sql.unsafe(reviewsQuery);

        event.waitUntil(sql.end());

        return {
            success: true,
            product: {
                ...product,
                photos: imagesResult.map(row => row.image_url),
                reviews: reviewsResult
            }
        };
    } catch (error) {
        console.error('Error fetching product data:', error);
        return { success: false, message: 'Database error' };
    }
});

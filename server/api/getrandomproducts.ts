import { defineEventHandler } from 'h3';

export default defineEventHandler(async (event) => {
    try {
        const sql = usePostgres();

        const productsQuery = `
            SELECT 
                p.id, 
                p.name,
                p.price,
                p.description,
                p.rating, 
                p.created_at, 
                p.updated_at,
                COALESCE(pi.photo, '/sneakers.jpg') AS image_url
            FROM products p
            LEFT JOIN products_images pi ON p.id = pi.product_id
            ORDER BY RANDOM()
            LIMIT 4
        `;

        // Execute the query without template literals
        const products = await sql.unsafe(productsQuery);
        event.waitUntil(sql.end());

        console.log(products);

        return { success: true, products };
    } catch (error) {
        console.error('Error fetching product data:', error);
        return { success: false, message: 'Database error' };
    }
});

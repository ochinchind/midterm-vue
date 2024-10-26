import { defineEventHandler, readBody } from 'h3';

export default defineEventHandler(async (event) => {
    const body = await readBody(event);

    try {
        const sql = usePostgres();

        const { price = 'all', rating = 'all', category = null, page = 1 } = body;
        const limit = 10;
        const offset = (Number(page) - 1) * limit;

        let baseQuery = `
            FROM products p
            LEFT JOIN categories c ON p.category_id = c.id
        `;

        const conditions: string[] = [];
        const params: (number | string)[] = [];

        if (price !== 'all' && price) {
            const [minPrice, maxPrice] = price.split('-').map(Number);
            conditions.push(`p.price BETWEEN $${params.length + 1} AND $${params.length + 2}`);
            params.push(minPrice, maxPrice);
        }
        if (rating !== 'all') {
            conditions.push(`p.rating >= $${params.length + 1}`);
            params.push(Number(rating));
        }
        if (category) {
            conditions.push(`c.slug = $${params.length + 1}`);
            params.push(category);
        }

        const whereClause = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

        const productsQuery = `
            SELECT 
                p.id, 
                p.name, 
                p.description, 
                p.price,
                p.rating, 
                p.created_at, 
                (SELECT pi.photo FROM products_images pi WHERE pi.product_id = p.id LIMIT 1) AS image_url,
                c.name AS category_name
            ${baseQuery}
            ${whereClause}
            ORDER BY p.id ASC
            LIMIT $${params.length + 1} OFFSET $${params.length + 2}
        `;
        params.push(limit, offset);

        const products = await sql.unsafe(productsQuery, params);

        const countQuery = `SELECT COUNT(*) AS count ${baseQuery} ${whereClause}`;
        const [{ count }] = await sql.unsafe(countQuery, params.slice(0, -2)); // Exclude limit and offset for count query

        return {
            success: true,
            products,
            currentPage: Number(page),
            totalProducts: Number(count),
            totalPages: Math.ceil(count / limit),
        };
    } catch (error) {
        console.error('Error fetching product data:', error);
        return { success: false, message: 'Database error' };
    }
});

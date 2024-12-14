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

        // Insert checkout details into the checkouts table
        const checkout = await sql`
            INSERT INTO checkouts (
                products, 
                address, 
                comment, 
                telephone, 
                payment_method, 
                full_name, 
                user_id
            ) VALUES (
                ${body.products || null}::jsonb,
                ${body.address || null},
                ${body.comment || null},
                ${body.telephone || null},
                ${body.paymentMethod || null},
                ${body.fullName || null},
                ${userId || null}
            ) RETURNING id
        `;

        return {
            success: true,
            message: 'Checkout successfully created',
            checkoutId: checkout[0].id
        };

    } catch (error) {
        console.error('Error processing checkout:', error);
        return { success: false, message: 'Database error' };
    }
});

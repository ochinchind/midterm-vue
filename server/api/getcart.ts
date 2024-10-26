import { defineEventHandler } from 'h3'
import { type CartItem } from '~/types/types'

export default defineEventHandler(async (event) => {
  const headers = event.req.headers
  const authHeader = headers['authorization']

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return { success: false, message: 'Authorization header missing or invalid' }
  }

  const token = authHeader.split(' ')[1]
  const sql = usePostgres()

  try {
    const userResult = await sql`
      SELECT id FROM users WHERE token = ${token}
    `
    if (userResult.length === 0) {
      return { success: false, message: 'User not found' }
    }

    const userId = userResult[0].id

    let cartResult = await sql`
      SELECT id FROM cart WHERE user_id = ${userId} AND status = 1
    `
    
    if (cartResult.length === 0) {
      const newCartResult = await sql`
        INSERT INTO cart (user_id, status, created_at)
        VALUES (${userId}, 1, NOW())
        RETURNING id
      `
      cartResult = newCartResult
    }

    const cartId = cartResult[0].id

    const cartItemsResult: CartItem[] = await sql`
      SELECT 
        cp.id,
        cp.product_id,
        p.name,
        p.price,
        (SELECT pi.photo FROM products_images pi WHERE pi.product_id = p.id LIMIT 1) AS image_url,
        cp.quantity
      FROM cart_products cp
      JOIN products p ON cp.product_id = p.id
      WHERE cp.cart_id = ${cartId}
    `

    return {
      success: true,
      cartItems: cartItemsResult,
    }
  } catch (error) {
    console.error('Error fetching cart data:', error)
    return { success: false, message: 'Database error' }
  } finally {
    await sql.end()
  }
})

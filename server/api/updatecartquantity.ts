import { defineEventHandler, readBody } from 'h3'
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
    const body = await readBody(event)
    const { product_id, quantity } = body

    if (quantity <= 0 || quantity > 1000) {
      return { success: false, message: 'Quantity must be between 1 and 1000' }
    }

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

    const productInCartResult = await sql`
      SELECT quantity FROM cart_products WHERE cart_id = ${cartId} AND product_id = ${product_id}
    `

    if (productInCartResult.length > 0) {
      await sql`
        UPDATE cart_products
        SET quantity = ${quantity}
        WHERE cart_id = ${cartId} AND product_id = ${product_id}
      `
    } else {
      await sql`
        INSERT INTO cart_products (cart_id, product_id, quantity)
        VALUES (${cartId}, ${product_id}, ${quantity})
      `
    }

    return {
      success: true,
      message: 'Quantity updated successfully'
    }
  } catch (error) {
    console.error('Error updating quantity:', error)
    return { success: false, message: 'Database error' }
  } finally {
    await sql.end()
  }
})

'use server';

import pool from '@/lib/db';
import { RowDataPacket, ResultSetHeader } from 'mysql2/promise';

export async function getCoupons() {
  try {
    const [rows] = await pool.query('SELECT * FROM coupons ORDER BY created_at DESC');
    return { success: true, data: rows };
  } catch (error) {
    console.error('Error fetching coupons:', error);
    return { success: false, error: 'Internal server error' };
  }
}

export async function getCouponById(id: number) {
  try {
    const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM coupons WHERE id = ?', [id]);
    if (rows.length === 0) return { success: false, error: 'Coupon not found' };
    return { success: true, data: rows[0] };
  } catch (error) {
    console.error('Error fetching coupon:', error);
    return { success: false, error: 'Internal server error' };
  }
}

export async function createCoupon(data: any) {
  try {
    const {
      code,
      discount_type,
      discount_amount,
      min_spend,
      max_discount,
      start_date,
      end_date,
      usage_limit_total,
      usage_limit_per_user,
      is_active,
      condition_type,
      condition_value,
    } = data;

    if (!code || !discount_amount) {
      return { success: false, error: 'Code and Discount amount are required' };
    }

    const [result] = await pool.query<ResultSetHeader>(
      `INSERT INTO coupons (
        code, discount_type, discount_amount, min_spend, max_discount, 
        start_date, end_date, usage_limit_total, usage_limit_per_user, 
        is_active, condition_type, condition_value
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        code,
        discount_type || 'fixed',
        discount_amount,
        min_spend || 0,
        max_discount || null,
        start_date || null,
        end_date || null,
        usage_limit_total || null,
        usage_limit_per_user || null,
        is_active !== undefined ? is_active : true,
        condition_type || 'none',
        condition_value ? JSON.stringify(condition_value) : null,
      ]
    );

    return { success: true, id: result.insertId, message: 'Coupon created successfully' };
  } catch (error: any) {
    console.error('Error creating coupon:', error);
    if (error.code === 'ER_DUP_ENTRY') {
      return { success: false, error: 'Coupon code already exists' };
    }
    return { success: false, error: 'Internal server error' };
  }
}

export async function updateCoupon(id: number, data: any) {
  try {
    const {
      code,
      discount_type,
      discount_amount,
      min_spend,
      max_discount,
      start_date,
      end_date,
      usage_limit_total,
      usage_limit_per_user,
      is_active,
      condition_type,
      condition_value,
    } = data;

    if (!code || !discount_amount) {
      return { success: false, error: 'Code and Discount amount are required' };
    }

    await pool.query(
      `UPDATE coupons SET 
        code = ?, discount_type = ?, discount_amount = ?, min_spend = ?, max_discount = ?, 
        start_date = ?, end_date = ?, usage_limit_total = ?, usage_limit_per_user = ?, 
        is_active = ?, condition_type = ?, condition_value = ? 
      WHERE id = ?`,
      [
        code,
        discount_type || 'fixed',
        discount_amount,
        min_spend || 0,
        max_discount || null,
        start_date || null,
        end_date || null,
        usage_limit_total || null,
        usage_limit_per_user || null,
        is_active !== undefined ? is_active : true,
        condition_type || 'none',
        condition_value ? JSON.stringify(condition_value) : null,
        id,
      ]
    );

    return { success: true, message: 'Coupon updated successfully' };
  } catch (error: any) {
    console.error('Error updating coupon:', error);
    if (error.code === 'ER_DUP_ENTRY') {
      return { success: false, error: 'Coupon code already exists' };
    }
    return { success: false, error: 'Internal server error' };
  }
}

export async function deleteCoupon(id: number) {
  try {
    await pool.query('DELETE FROM coupons WHERE id = ?', [id]);
    return { success: true, message: 'Coupon deleted successfully' };
  } catch (error) {
    console.error('Error deleting coupon:', error);
    return { success: false, error: 'Internal server error' };
  }
}

export async function validateCoupon(code: string, payload: {
  cartTotal: number, 
  userId?: number, 
  cartItems?: { productId: number, categoryId: number, price: number, quantity: number }[],
  userOrderCount?: number
}) {
  try {
    const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM coupons WHERE code = ?', [code]);
    if (rows.length === 0) return { success: false, error: 'Invalid coupon code' };
    
    const coupon = rows[0];

    if (!coupon.is_active) {
      return { success: false, error: 'This coupon is no longer active' };
    }

    const now = new Date();
    if (coupon.start_date && new Date(coupon.start_date) > now) {
      return { success: false, error: 'This coupon is not valid yet' };
    }
    if (coupon.end_date && new Date(coupon.end_date) < now) {
      return { success: false, error: 'This coupon has expired' };
    }

    if (coupon.usage_limit_total && coupon.used_count >= coupon.usage_limit_total) {
      return { success: false, error: 'This coupon usage limit has been reached' };
    }

    // Checking minimum spend
    if (coupon.min_spend && payload.cartTotal < coupon.min_spend) {
      return { success: false, error: `Minimum spend of ${coupon.min_spend} is required` };
    }

    // Condition validations
    const cType = coupon.condition_type;
    const cValue = typeof coupon.condition_value === 'string' ? JSON.parse(coupon.condition_value) : coupon.condition_value;

    if (cType === 'first_purchase') {
      if (payload.userOrderCount && payload.userOrderCount > 0) {
        return { success: false, error: 'This coupon is only valid for your first purchase' };
      }
    } else if (cType === 'next_purchase') {
      if (payload.userOrderCount === undefined || payload.userOrderCount === 0) {
        return { success: false, error: 'This coupon is valid for your next purchase only' };
      }
    } else if (cType === 'total_orders') {
      const requiredOrders = Number(cValue) || 0;
      if (payload.userOrderCount === undefined || payload.userOrderCount < requiredOrders) {
        return { success: false, error: `This coupon requires at least ${requiredOrders} previous orders` };
      }
    } else if (cType === 'category') {
      if (!payload.cartItems || payload.cartItems.length === 0) {
        return { success: false, error: 'Cart is empty' };
      }
      const allowedCategories = Array.isArray(cValue) ? cValue.map(Number) : [];
      const hasValidCategory = payload.cartItems.some(item => allowedCategories.includes(item.categoryId));
      if (!hasValidCategory) {
        return { success: false, error: 'This coupon is not applicable to the categories in your cart' };
      }
    } else if (cType === 'product') {
      if (!payload.cartItems || payload.cartItems.length === 0) {
        return { success: false, error: 'Cart is empty' };
      }
      const allowedProducts = Array.isArray(cValue) ? cValue.map(Number) : [];
      const hasValidProduct = payload.cartItems.some(item => allowedProducts.includes(item.productId));
      if (!hasValidProduct) {
        return { success: false, error: 'This coupon is not applicable to the products in your cart' };
      }
    }

    // Calculate discount amount
    let discount = 0;
    if (coupon.discount_type === 'percentage') {
      discount = (payload.cartTotal * coupon.discount_amount) / 100;
      if (coupon.max_discount && discount > coupon.max_discount) {
        discount = coupon.max_discount;
      }
    } else {
      discount = Number(coupon.discount_amount);
    }

    return { 
      success: true, 
      data: {
        discountAmount: discount,
        couponId: coupon.id,
        code: coupon.code
      } 
    };

  } catch (error) {
    console.error('Error validating coupon:', error);
    return { success: false, error: 'Internal server error' };
  }
}

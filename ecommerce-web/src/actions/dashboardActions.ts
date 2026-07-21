'use server';

import pool from '@/lib/db';

export async function getDashboardData() {
  try {
    // Fetch real counts from DB
    const [productsResult]: any = await pool.query('SELECT COUNT(*) as count FROM products');
    const [categoriesResult]: any = await pool.query('SELECT COUNT(*) as count FROM categories');
    
    const totalProducts = productsResult[0].count;
    const totalCategories = categoriesResult[0].count;

    // Return combined real + mock data for the dashboard
    return {
      success: true,
      data: {
        metrics: {
          totalOrders: 154,
          discountedOrders: 32,
          ordersInProcess: 12,
          orderUnfulfilled: 5,
          totalRevenue: 25430.00,
          discountedRevenue: 1240.00,
          netRevenue: 24190.00,
          totalSalesPercentage: 15,
          salesPerformance: 8,
          newCustomers: 45,
          totalCustomers: 1250,
          totalProducts: totalProducts,
          totalCategories: totalCategories,
        },
        charts: {
          topProducts: [
            { name: "Premium Leather Bag", sold: "120", revenue: "$4,500" },
            { name: "Wireless Headphones", sold: "95", revenue: "$2,850" },
            { name: "Smart Watch", sold: "80", revenue: "$3,200" },
            { name: "Running Shoes", sold: "150", revenue: "$1,500" }
          ],
          monthlySales: [
            { month: "Jan", revenue: "15000" },
            { month: "Feb", revenue: "18000" },
            { month: "Mar", revenue: "22000" },
            { month: "Apr", revenue: "20000" },
            { month: "May", revenue: "25000" },
            { month: "Jun", revenue: "28000" }
          ],
          salesPerformance: [
            { date: "2024-01", revenue: "1000" },
            { date: "2024-02", revenue: "1500" },
            { date: "2024-03", revenue: "1200" },
            { date: "2024-04", revenue: "1800" },
            { date: "2024-05", revenue: "2400" }
          ]
        }
      }
    };
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    return { success: false, error: 'Internal server error' };
  }
}

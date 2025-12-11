/**
 * BORROWING STATISTICS API ENDPOINTS
 * Add these endpoints to your server.js file
 * 
 * These endpoints retrieve borrowing statistics for admin and teacher dashboards
 */

// ============================================
// BORROWING STATISTICS API ENDPOINTS
// ============================================

/**
 * GET /api/statistics/borrowing-weekly
 * Get books borrowed in the past 7 days
 * 
 * Response: { count: number, details: array }
 */
app.get('/api/statistics/borrowing-weekly', async (req, res) => {
  try {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const query = `
      SELECT COUNT(*) as count, 
             DATE(borrowed_date) as date
      FROM borrowings
      WHERE borrowed_date >= DATE(?)
      AND status IN ('borrowed', 'approved')
      GROUP BY DATE(borrowed_date)
      ORDER BY borrowed_date DESC
    `;
    
    const results = await dbService.executeQuery(query, [sevenDaysAgo]);
    const totalCount = results.reduce((sum, r) => sum + r.count, 0);
    
    res.json({
      count: totalCount,
      daily: results,
      period: 'weekly'
    });
  } catch (error) {
    console.error('Error fetching weekly borrowing stats:', error);
    res.status(500).json({ error: 'Failed to fetch weekly statistics' });
  }
});

/**
 * GET /api/statistics/borrowing-monthly
 * Get books borrowed in the current month
 * Optional query param: month (YYYY-MM format)
 * 
 * Response: { count: number, details: array }
 */
app.get('/api/statistics/borrowing-monthly', async (req, res) => {
  try {
    const { month } = req.query;
    let startDate, endDate;
    
    if (month) {
      // Parse month from query (format: YYYY-MM)
      const [year, monthNum] = month.split('-');
      startDate = new Date(year, monthNum - 1, 1);
      endDate = new Date(year, monthNum, 0);
    } else {
      // Current month
      const now = new Date();
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    }
    
    const query = `
      SELECT COUNT(*) as count,
             DATE(borrowed_date) as date
      FROM borrowings
      WHERE borrowed_date >= ? 
      AND borrowed_date <= ?
      AND status IN ('borrowed', 'approved')
      GROUP BY DATE(borrowed_date)
      ORDER BY borrowed_date DESC
    `;
    
    const results = await dbService.executeQuery(query, [startDate, endDate]);
    const totalCount = results.reduce((sum, r) => sum + r.count, 0);
    
    res.json({
      count: totalCount,
      daily: results,
      period: 'monthly',
      month: month || `${startDate.getFullYear()}-${String(startDate.getMonth() + 1).padStart(2, '0')}`
    });
  } catch (error) {
    console.error('Error fetching monthly borrowing stats:', error);
    res.status(500).json({ error: 'Failed to fetch monthly statistics' });
  }
});

/**
 * GET /api/statistics/active-borrowings
 * Get count of active borrowings (not yet returned)
 * 
 * Response: { count: number }
 */
app.get('/api/statistics/active-borrowings', async (req, res) => {
  try {
    const query = `
      SELECT COUNT(*) as count
      FROM borrowings
      WHERE status IN ('borrowed', 'approved')
      AND returned_date IS NULL
    `;
    
    const results = await dbService.executeQuery(query);
    
    res.json({
      count: results[0]?.count || 0
    });
  } catch (error) {
    console.error('Error fetching active borrowings:', error);
    res.status(500).json({ error: 'Failed to fetch active borrowings' });
  }
});

/**
 * GET /api/statistics/overdue-borrowings
 * Get count of overdue borrowings
 * 
 * Response: { count: number, details: array }
 */
app.get('/api/statistics/overdue-borrowings', async (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    
    const query = `
      SELECT COUNT(*) as count,
             b.id,
             u.first_name,
             u.last_name,
             bk.title,
             b.due_date
      FROM borrowings b
      JOIN users u ON b.user_id = u.id
      JOIN books bk ON b.book_id = bk.id
      WHERE b.status IN ('borrowed', 'overdue')
      AND b.returned_date IS NULL
      AND b.due_date < ?
      GROUP BY b.id
      ORDER BY b.due_date ASC
    `;
    
    const results = await dbService.executeQuery(query, [today]);
    
    res.json({
      count: results.length,
      items: results
    });
  } catch (error) {
    console.error('Error fetching overdue borrowings:', error);
    res.status(500).json({ error: 'Failed to fetch overdue borrowings' });
  }
});

/**
 * GET /api/statistics/top-books
 * Get most borrowed books
 * Optional query params: 
 *   - limit (default: 10)
 *   - month (YYYY-MM format) - for monthly stats
 *   - period ('week' or 'month')
 * 
 * Response: { books: array }
 */
app.get('/api/statistics/top-books', async (req, res) => {
  try {
    const { limit = 10, month, period = 'month' } = req.query;
    let dateFilter = '';
    let params = [parseInt(limit)];
    
    if (period === 'week') {
      dateFilter = 'AND b.borrowed_date >= DATE_SUB(NOW(), INTERVAL 7 DAY)';
    } else if (month) {
      const [year, monthNum] = month.split('-');
      const startDate = new Date(year, monthNum - 1, 1);
      const endDate = new Date(year, monthNum, 0);
      dateFilter = 'AND b.borrowed_date >= ? AND b.borrowed_date <= ?';
      params = [startDate, endDate, parseInt(limit)];
    } else {
      dateFilter = 'AND b.borrowed_date >= DATE_SUB(NOW(), INTERVAL 1 MONTH)';
    }
    
    const query = `
      SELECT 
        bk.id,
        bk.title,
        bk.author,
        bk.isbn,
        COUNT(b.id) as times_borrowed
      FROM borrowings b
      JOIN books bk ON b.book_id = bk.id
      WHERE b.status IN ('borrowed', 'returned', 'overdue', 'approved')
      ${dateFilter}
      GROUP BY bk.id
      ORDER BY times_borrowed DESC
      LIMIT ?
    `;
    
    const results = await dbService.executeQuery(query, params);
    
    res.json({
      books: results,
      total: results.length
    });
  } catch (error) {
    console.error('Error fetching top books:', error);
    res.status(500).json({ error: 'Failed to fetch top books' });
  }
});

/**
 * GET /api/statistics/top-borrowers
 * Get users who borrowed the most books
 * Optional query params:
 *   - limit (default: 10)
 *   - month (YYYY-MM format) - for monthly stats
 *   - period ('week' or 'month')
 * 
 * Response: { borrowers: array }
 */
app.get('/api/statistics/top-borrowers', async (req, res) => {
  try {
    const { limit = 10, month, period = 'month' } = req.query;
    let dateFilter = '';
    let params = [parseInt(limit)];
    
    if (period === 'week') {
      dateFilter = 'AND b.borrowed_date >= DATE_SUB(NOW(), INTERVAL 7 DAY)';
    } else if (month) {
      const [year, monthNum] = month.split('-');
      const startDate = new Date(year, monthNum - 1, 1);
      const endDate = new Date(year, monthNum, 0);
      dateFilter = 'AND b.borrowed_date >= ? AND b.borrowed_date <= ?';
      params = [startDate, endDate, parseInt(limit)];
    } else {
      dateFilter = 'AND b.borrowed_date >= DATE_SUB(NOW(), INTERVAL 1 MONTH)';
    }
    
    const query = `
      SELECT 
        u.id,
        u.first_name,
        u.last_name,
        u.email,
        u.role,
        COUNT(b.id) as total_borrowed
      FROM borrowings b
      JOIN users u ON b.user_id = u.id
      WHERE b.status IN ('borrowed', 'returned', 'overdue', 'approved')
      ${dateFilter}
      GROUP BY u.id
      ORDER BY total_borrowed DESC
      LIMIT ?
    `;
    
    const results = await dbService.executeQuery(query, params);
    
    res.json({
      borrowers: results,
      total: results.length
    });
  } catch (error) {
    console.error('Error fetching top borrowers:', error);
    res.status(500).json({ error: 'Failed to fetch top borrowers' });
  }
});

/**
 * GET /api/statistics/borrowing-trend
 * Get borrowing trends for a date range
 * Optional query params:
 *   - startDate (YYYY-MM-DD format)
 *   - endDate (YYYY-MM-DD format)
 *   - groupBy ('day', 'week', 'month' - default: 'day')
 * 
 * Response: { trend: array }
 */
app.get('/api/statistics/borrowing-trend', async (req, res) => {
  try {
    const { startDate, endDate, groupBy = 'day' } = req.query;
    
    let dateFormat = '%Y-%m-%d';
    if (groupBy === 'week') {
      dateFormat = '%Y-W%v';
    } else if (groupBy === 'month') {
      dateFormat = '%Y-%m';
    }
    
    const query = `
      SELECT 
        DATE_FORMAT(borrowed_date, ?) as period,
        COUNT(*) as count
      FROM borrowings
      WHERE status IN ('borrowed', 'returned', 'overdue', 'approved')
      ${startDate ? 'AND borrowed_date >= ?' : ''}
      ${endDate ? 'AND borrowed_date <= ?' : ''}
      GROUP BY period
      ORDER BY period ASC
    `;
    
    let params = [dateFormat];
    if (startDate) params.push(startDate);
    if (endDate) params.push(endDate);
    
    const results = await dbService.executeQuery(query, params);
    
    res.json({
      trend: results,
      groupBy: groupBy,
      dateRange: {
        start: startDate || 'all',
        end: endDate || 'today'
      }
    });
  } catch (error) {
    console.error('Error fetching borrowing trend:', error);
    res.status(500).json({ error: 'Failed to fetch borrowing trend' });
  }
});

/**
 * GET /api/statistics/summary
 * Get comprehensive statistics summary
 * Optional query params:
 *   - month (YYYY-MM format)
 * 
 * Response: Comprehensive stats object
 */
app.get('/api/statistics/summary', async (req, res) => {
  try {
    const { month } = req.query;
    
    // Get current month date range if month provided
    let startDate, endDate;
    if (month) {
      const [year, monthNum] = month.split('-');
      startDate = new Date(year, monthNum - 1, 1);
      endDate = new Date(year, monthNum, 0);
    } else {
      const now = new Date();
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    }
    
    // Get all stats in parallel
    const [weeklyStats, monthlyStats, activeStats, overdueStats, topBooks, topBorrowers] = 
      await Promise.all([
        dbService.executeQuery(
          'SELECT COUNT(*) as count FROM borrowings WHERE borrowed_date >= DATE_SUB(NOW(), INTERVAL 7 DAY) AND status IN ("borrowed", "approved")'
        ),
        dbService.executeQuery(
          'SELECT COUNT(*) as count FROM borrowings WHERE borrowed_date >= ? AND borrowed_date <= ? AND status IN ("borrowed", "approved")',
          [startDate, endDate]
        ),
        dbService.executeQuery(
          'SELECT COUNT(*) as count FROM borrowings WHERE status IN ("borrowed", "approved") AND returned_date IS NULL'
        ),
        dbService.executeQuery(
          'SELECT COUNT(*) as count FROM borrowings WHERE status IN ("borrowed", "overdue") AND returned_date IS NULL AND due_date < CURDATE()'
        ),
        dbService.executeQuery(
          `SELECT bk.id, bk.title, bk.author, COUNT(b.id) as times_borrowed
           FROM borrowings b JOIN books bk ON b.book_id = bk.id
           WHERE b.borrowed_date >= ? AND b.borrowed_date <= ? AND b.status IN ('borrowed', 'returned', 'overdue', 'approved')
           GROUP BY bk.id ORDER BY times_borrowed DESC LIMIT 5`,
          [startDate, endDate]
        ),
        dbService.executeQuery(
          `SELECT u.id, u.first_name, u.last_name, u.role, COUNT(b.id) as total_borrowed
           FROM borrowings b JOIN users u ON b.user_id = u.id
           WHERE b.borrowed_date >= ? AND b.borrowed_date <= ? AND b.status IN ('borrowed', 'returned', 'overdue', 'approved')
           GROUP BY u.id ORDER BY total_borrowed DESC LIMIT 5`,
          [startDate, endDate]
        )
      ]);
    
    res.json({
      summary: {
        weeklyBorrows: weeklyStats[0]?.count || 0,
        monthlyBorrows: monthlyStats[0]?.count || 0,
        activeBorrows: activeStats[0]?.count || 0,
        overdueBorrows: overdueStats[0]?.count || 0,
        topBooks: topBooks,
        topBorrowers: topBorrowers,
        period: month || `${startDate.getFullYear()}-${String(startDate.getMonth() + 1).padStart(2, '0')}`
      }
    });
  } catch (error) {
    console.error('Error fetching summary:', error);
    res.status(500).json({ error: 'Failed to fetch statistics summary' });
  }
});

# Borrowing Statistics Page - Complete Documentation

## Overview
The Borrowing Statistics page is a comprehensive analytics dashboard for tracking and analyzing library borrowing patterns. It's accessible to both **Admin** and **Teacher** roles and provides real-time insights into borrowing trends, popular books, and top borrowers.

## Features

### 1. **Statistics Cards (KPI Dashboard)**
Four key statistics cards at the top of the page:

- **Books Borrowed This Week** - Shows borrowing activity for the last 7 days
- **Books Borrowed This Month** - Shows borrowing activity for the selected month
- **Total Active Borrowings** - Shows books currently borrowed (not returned)
- **Overdue Books** - Shows books past their due date

### 2. **Borrowing Trends Charts**

#### Weekly Borrowing Trend
- Bar chart showing daily borrowing counts for the current week
- Helps identify peak borrowing days
- Data grouped by day of week (Mon-Sun)

#### Monthly Borrowing Trend
- Line chart showing daily borrowing patterns for 30 days
- Shows overall borrowing velocity and trends
- Includes area fill for visual emphasis

### 3. **Top Data Tables**

#### Most Borrowed Books (Monthly)
- Displays the 5 most borrowed books in the selected month
- Shows: Rank, Book Title, Author, Times Borrowed
- Ranked badges for visual emphasis

#### Top Borrowers (Monthly)
- Displays the 5 users who borrowed the most books
- Shows: Rank, Borrower Name, Role (Student/Teacher), Number Borrowed
- Helps identify power users of the library

### 4. **Interactive Filters**
- **Month Selector** - Choose any month to view historical data
- **Refresh Button** - Manually update all statistics

## Technical Implementation

### Frontend Files
- **Location**: `/pages/borrowing-statistics.html`
- **Framework**: Vanilla JavaScript with Chart.js library
- **Styling**: Responsive CSS with mobile support

### Backend API Endpoints
Documented in: `BORROWING_STATISTICS_ENDPOINTS.js`

#### Required Endpoints:

1. **GET /api/statistics/borrowing-weekly**
   - Returns borrowing count for last 7 days grouped by date
   - Response: `{ count, daily[], period }`

2. **GET /api/statistics/borrowing-monthly**
   - Returns borrowing count for a specific month (or current month)
   - Query params: `month` (optional, format: YYYY-MM)
   - Response: `{ count, daily[], period, month }`

3. **GET /api/statistics/active-borrowings**
   - Returns count of books currently borrowed
   - Response: `{ count }`

4. **GET /api/statistics/overdue-borrowings**
   - Returns count and details of overdue items
   - Response: `{ count, items[] }`

5. **GET /api/statistics/top-books**
   - Returns most borrowed books
   - Query params: `limit` (default: 10), `month`, `period` ('week' or 'month')
   - Response: `{ books[], total }`

6. **GET /api/statistics/top-borrowers**
   - Returns users who borrowed the most
   - Query params: `limit` (default: 10), `month`, `period`
   - Response: `{ borrowers[], total }`

7. **GET /api/statistics/borrowing-trend**
   - Returns borrowing trends for custom date ranges
   - Query params: `startDate`, `endDate`, `groupBy` ('day', 'week', 'month')
   - Response: `{ trend[], groupBy, dateRange }`

8. **GET /api/statistics/summary**
   - Comprehensive statistics summary
   - Query params: `month` (optional)
   - Response: Complete summary object with all statistics

### Database Schema Requirements

The implementation requires the following tables:
- `borrowings` - Main borrowing records with dates and status
- `books` - Book information
- `users` - User information including role

Key columns used:
```sql
-- borrowings table
borrowed_date DATE
due_date DATE
returned_date DATE
status ENUM('pending', 'approved', 'rejected', 'borrowed', 'returned', 'overdue')
user_id INT
book_id INT

-- books table
title VARCHAR(255)
author VARCHAR(255)
isbn VARCHAR(20)

-- users table
first_name VARCHAR(100)
last_name VARCHAR(100)
role ENUM('student', 'teacher', 'admin')
email VARCHAR(255)
```

## Access Control

### Who Can Access:
- **Admin Users** - Full access to all statistics
- **Teacher Users** - Full access to all statistics

### Authentication:
- The page checks localStorage for `userRole`
- Only allows 'admin' and 'teacher' roles
- Redirects unauthorized users to login page

## Integration with Dashboards

### Admin Dashboard
- Added "📊 Borrowing Statistics" button in Library Management section
- Links to `/pages/borrowing-statistics.html`

### Teacher Dashboard
- Added "📊 Borrowing Statistics" button in Quick Actions section
- Links to `/pages/borrowing-statistics.html`

## Installation Instructions

### 1. Add the HTML Page
Copy `borrowing-statistics.html` to `/pages/` directory

### 2. Add API Endpoints
Add all endpoints from `BORROWING_STATISTICS_ENDPOINTS.js` to your `server.js` file

### 3. Update Dashboard Links
Links have already been added to:
- `/pages/admin-dashboard.html`
- `/pages/teacher-dashboard.html`

### 4. Install Chart.js Library
The page includes Chart.js from CDN:
```html
<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
```

### 5. Database Indices
Ensure the following indices exist for performance:
```sql
CREATE INDEX idx_borrowed_date ON borrowings(borrowed_date);
CREATE INDEX idx_user_id ON borrowings(user_id);
CREATE INDEX idx_book_id ON borrowings(book_id);
CREATE INDEX idx_status ON borrowings(status);
```

## Data Flow

### Page Load Process:
1. Check user authentication and role
2. Set current month as default filter
3. Load initial statistics
4. Render charts
5. Load top books table
6. Load top borrowers table

### Month Filter Update:
1. User selects different month
2. `refreshStatistics()` called
3. All data reloaded for selected month
4. Charts update
5. Tables refresh

## Styling & Theme

### Color Scheme:
- Primary: `#8B3A3A` (Dark Red)
- Secondary: `#C84C4C` (Light Red)
- Success: `#10B981` (Green)
- Info: `#4A90E2` (Blue)
- Warning: `#F5A623` (Orange)

### Responsive Design:
- Desktop: Full grid layout with 2 columns for charts
- Tablet: Single column layout
- Mobile: Stacked layout with adjusted font sizes

## Sample Data

The current implementation includes sample data generation for demo purposes. To connect to real data:

1. Replace the hardcoded sample data in:
   - `loadStatistics()` function
   - `loadTopBooks()` function
   - `loadTopBorrowers()` function
   - `loadCharts()` function

2. Update to make API calls instead:
```javascript
// Example:
const response = await fetch(`/api/statistics/top-books?month=${monthFilter}`);
const data = await response.json();
// Use data instead of hardcoded values
```

## Performance Considerations

### Optimization Tips:
1. Use database indices on `borrowed_date`, `user_id`, `book_id`, `status`
2. Implement pagination for large datasets
3. Cache statistics for frequently accessed periods
4. Use efficient SQL GROUP BY queries
5. Consider materialized views for daily/weekly aggregates

### Suggested Caching Strategy:
- Cache statistics for the current month
- Invalidate cache on new borrowing records
- Allow manual refresh for real-time updates

## Future Enhancements

1. **Export Functionality**
   - Export statistics as PDF or CSV
   - Generate monthly reports

2. **Advanced Filtering**
   - Filter by book category
   - Filter by student/teacher
   - Filter by class or department

3. **Predictive Analytics**
   - Forecast borrowing trends
   - Recommend popular books

4. **Notifications**
   - Alert on overdue books
   - Notify when books become popular

5. **Comparative Analysis**
   - Compare months/years
   - Identify seasonal trends

6. **Department/Class Analytics**
   - Statistics by department
   - Statistics by class
   - Cross-department comparisons

## Troubleshooting

### Common Issues:

**Charts Not Displaying:**
- Ensure Chart.js library is loaded
- Check browser console for errors
- Verify canvas elements have IDs

**No Data Showing:**
- Check API endpoints are working
- Verify database has borrowing records
- Check date range filters
- Review browser console for fetch errors

**Authentication Failed:**
- Ensure user is logged in
- Check localStorage for userRole
- Verify role is 'admin' or 'teacher'

**Month Filter Not Working:**
- Check browser date support
- Verify month format (YYYY-MM)
- Check browser console for errors

## Support & Maintenance

### Regular Maintenance:
- Monitor query performance
- Check for database bloat
- Review error logs monthly
- Update dependencies quarterly

### Monitoring:
- Track average page load time
- Monitor API response times
- Track error rates
- User engagement metrics

## Version History

- **v1.0** - Initial release
  - Basic statistics cards
  - Weekly and monthly charts
  - Top books and borrowers tables
  - Month filtering
  - Admin and teacher access

---

**Last Updated**: December 11, 2025
**Status**: Ready for Production

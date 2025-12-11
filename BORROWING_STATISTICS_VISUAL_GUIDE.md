# Borrowing Statistics Page - Visual Reference & User Guide

## 📺 Page Layout

```
┌─────────────────────────────────────────────────────────────────────┐
│  📊 Borrowing Statistics    [Dashboard] [Profile] [Logout]           │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│  Borrowing Statistics                                   [Month ▼] [↻] │
│  Track and analyze library borrowing patterns and metrics            │
└─────────────────────────────────────────────────────────────────────┘

┌──────────────────┬──────────────────┬──────────────────┬──────────────┐
│ 📆 Books         │ 📈 Books         │ 🔄 Total Active  │ ⚠️ Overdue   │
│    Borrowed      │    Borrowed      │    Borrowings    │    Books     │
│    This Week     │    This Month    │                  │              │
│    ┌──────────┐  │    ┌──────────┐  │    ┌──────────┐  │ ┌──────────┐ │
│    │   35     │  │    │   142    │  │    │   78     │  │ │   12     │ │
│    └──────────┘  │    └──────────┘  │    └──────────┘  │ └──────────┘ │
│    Last 7 days   │    Dec 2025      │    Not returned  │  Past due    │
└──────────────────┴──────────────────┴──────────────────┴──────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│  📈 Borrowing Trends                                                │
├───────────────────────────────────┬───────────────────────────────────┤
│  Weekly Borrowing Trend           │  Monthly Borrowing Trend          │
│                                   │                                   │
│   30 │                            │   30 │         ╱╲              │
│   20 │  ║ ║                       │   20 │        ╱  ╲    ╱        │
│   10 │  ║ ║ ║ ║ ║ ║ ║            │   10 │  ╱╲  ╱    ╲╱  ╲╱╲      │
│    0 └──────────────────────      │    0 └────────────────────────   │
│      Mon Tue Wed Thu Fri Sat Sun  │      1  5  10 15 20 25 30       │
└───────────────────────────────────┴───────────────────────────────────┘

┌──────────────────────────────────┬──────────────────────────────────┐
│  📚 Most Borrowed Books (Monthly)│  👥 Top Borrowers (Monthly)      │
├──┬──────────────────┬──────────┬─┤  ┬───────────────┬──────┬────────┤
│  │ Book Title       │ Author   │ │  │ Borrower Name │ Role │Borrowed│
├──┼──────────────────┼──────────┼─┤  ├───────────────┼──────┼────────┤
│ 1│ To Kill a        │Harper    │ │  │ 1 John Smith  │Stud. │   8    │
│  │ Mockingbird      │Lee       │ │  ├───────────────┼──────┼────────┤
├──┼──────────────────┼──────────┼─┤  │ 2 Sarah       │Teach │   7    │
│ 2│ 1984             │George    │ │  │   Johnson     │      │        │
│  │                  │Orwell    │ │  ├───────────────┼──────┼────────┤
├──┼──────────────────┼──────────┼─┤  │ 3 Michael     │Stud. │   6    │
│ 3│ Pride and        │Jane      │ │  │   Brown       │      │        │
│  │ Prejudice       │Austen    │ │  └───────────────┴──────┴────────┘
├──┼──────────────────┼──────────┼─┤
│ 4│ The Great        │F. Scott  │ │
│  │ Gatsby           │Fitzgerald│ │
├──┼──────────────────┼──────────┼─┤
│ 5│ Jane Eyre        │Charlotte │ │
│  │                  │Brontë    │ │
└──┴──────────────────┴──────────┴─┘
```

---

## 🎨 Color Coding

### Statistics Cards
- 🔵 **Weekly Card** - Blue accent (#4A90E2)
- 🟢 **Monthly Card** - Green accent (#7ED321)
- 🟠 **Total Active** - Orange accent (#F5A623)
- 🔴 **Overdue** - Red accent (#C84C4C)

### Status Indicators
- ✅ **Active** - Green
- ⚠️ **Pending** - Orange
- ❌ **Overdue** - Red
- ℹ️ **Info** - Blue

---

## 📱 Screen Size Variants

### Desktop (1200px+)
```
Wide layout with 2-column charts
├─ Left: Weekly Chart
└─ Right: Monthly Chart

Two tables side-by-side
├─ Top Books (left)
└─ Top Borrowers (right)
```

### Tablet (768px - 1199px)
```
Single column charts
├─ Weekly Chart (full width)
└─ Monthly Chart (full width)

Single column tables
├─ Top Books (full width)
└─ Top Borrowers (full width)
```

### Mobile (<768px)
```
Stacked vertical layout
├─ Stats cards (1 per row)
├─ Charts (full width, scrollable)
└─ Tables (scrollable horizontal)

Optimized touch targets (44px minimum)
```

---

## 🔘 Interactive Elements

### Buttons & Links
```
Primary Button (Action):
┌─────────────────────┐
│ 📊 Borrowing Stats  │
└─────────────────────┘
Click to navigate

Secondary Button (Logout):
┌─────────────────────┐
│   🚪 Logout         │
└─────────────────────┘
Click to logout
```

### Form Controls
```
Month Filter:
┌──────────────┐
│ 2025-12 ▼    │  <- Click to change month
└──────────────┘

Refresh Button:
┌────┐
│ ↻  │  <- Click to reload data
└────┘
```

### Hover States
- Cards lift up on hover (translateY)
- Links change opacity
- Buttons get shadow effect

---

## 📊 Data Table Structure

### Most Borrowed Books Table
```
┌────┬──────────────────┬──────────┬──────────────┐
│Rank│ Book Title       │ Author   │ Times Borrow │
├────┼──────────────────┼──────────┼──────────────┤
│ ① │ To Kill a        │Harper    │     15       │
│    │ Mockingbird      │Lee       │              │
├────┼──────────────────┼──────────┼──────────────┤
│ ② │ 1984             │George    │     12       │
│    │                  │Orwell    │              │
└────┴──────────────────┴──────────┴──────────────┘

① = Styled rank badge with circular background
```

---

## 🔐 Access Control Flow

```
User visits /pages/borrowing-statistics.html
                    ↓
         Check localStorage for userRole
                    ↓
        Is role 'admin' or 'teacher'?
         ↙                       ↘
       YES                        NO
        ↓                          ↓
    Load Page              Redirect to login
  Display Stats                /index.html
```

---

## 📈 Chart Components

### Weekly Borrowing Chart (Bar Chart)
- **Type**: Vertical bar chart
- **Data**: Daily borrowings (Mon-Sun)
- **X-Axis**: Days of week
- **Y-Axis**: Number of books borrowed
- **Colors**: Dark red (#8B3A3A) with lighter borders
- **Height**: 400px responsive

### Monthly Borrowing Chart (Line Chart)
- **Type**: Line chart with area fill
- **Data**: Daily borrowings for 30 days
- **X-Axis**: Day of month (1-30)
- **Y-Axis**: Number of books borrowed
- **Colors**: Light red (#C84C4C) border, dark red (#8B3A3A) fill
- **Points**: Visible with white borders
- **Tension**: Smooth curves (0.4)
- **Height**: 400px responsive

---

## 🎯 User Journey

### Admin User Journey
```
1. Click "Borrowing Statistics" from Dashboard
                ↓
2. View all statistics for the selected month
                ↓
3. Monitor trends and identify issues
                ↓
4. Change month to compare periods
                ↓
5. Review top books and borrowers
                ↓
6. Make decisions based on data
```

### Teacher User Journey
```
1. Click "Borrowing Statistics" from Quick Actions
                ↓
2. See current month's borrowing activity
                ↓
3. Identify popular books for curriculum
                ↓
4. Plan reading assignments
                ↓
5. Monitor student engagement
```

---

## 🔄 Data Update Flow

```
User Loads Page
      ↓
Check Authentication
      ↓
Set Default Month (Current)
      ↓
Load Statistics Cards
      ↓
Render Charts (Weekly & Monthly)
      ↓
Populate Tables (Top Books & Borrowers)
      ↓
Page Ready for Interaction
      ↓
User Changes Month Filter
      ↓
refreshStatistics() Called
      ↓
All Data Reloaded
      ↓
Charts & Tables Updated
```

---

## 📊 Statistics Calculation Examples

### Weekly Borrowing
```
Week period: Last 7 calendar days
Count: All borrowings with status IN ('borrowed', 'approved')
Example: 
- Monday: 12 books
- Tuesday: 15 books
- ...
- Sunday: 8 books
- Total for week: 92 books
```

### Monthly Borrowing
```
Month period: Selected month (default: current)
Example for December 2025:
- Start: December 1, 2025
- End: December 31, 2025
- Count: All borrowings in this date range
- Daily breakdown: 1-30 items per day
```

### Top Books Ranking
```
Group by book_id
Count borrowing records per book
Order by count DESC
Limit to 5
Add rank position (1-5)
```

### Top Borrowers Ranking
```
Group by user_id
Count borrowing records per user
Include user name and role
Order by count DESC
Limit to 5
Add rank position (1-5)
```

---

## ⌚ Loading States

### Initial Load
```
[Spinner] Loading statistics...
[Spinner] Loading charts...
[Spinner] Loading top books...
[Spinner] Loading top borrowers...
```

### After Data Load
```
Display all content with data
```

### Empty States
```
No data available

Used when:
- No borrowings in selected period
- No top books for month
- No active borrowers
```

---

## 🎨 CSS Classes Reference

### Layout Classes
- `.container` - Main content wrapper
- `.navbar` - Top navigation bar
- `.stats-grid` - Statistics cards grid
- `.charts-grid` - Charts container grid
- `.tables-section` - Table containers

### Component Classes
- `.stat-card` - Individual stat card
- `.chart-container` - Chart wrapper
- `.table-section` - Table wrapper
- `.rank-badge` - Rank display badge

### State Classes
- `.loading` - Loading indicator
- `.error-message` - Error display
- `.success-message` - Success notification
- `.no-data` - Empty state

---

## 🔗 Navigation Structure

```
/pages/borrowing-statistics.html
    ├─ Links to: /pages/admin-dashboard.html
    ├─ Links to: /pages/admin-profile.html
    ├─ Links to: /pages/teacher-dashboard.html
    └─ Links to: /index.html (on logout)

Accessible from:
    ├─ Admin Dashboard → Library Management
    └─ Teacher Dashboard → Quick Actions
```

---

## 📐 Responsive Behavior

### Screens 1200px+
- ✅ Full 2-column layout for charts
- ✅ Side-by-side tables
- ✅ All information visible
- ✅ No horizontal scrolling

### Screens 768px - 1199px
- ✅ Single column charts
- ✅ Single column tables
- ✅ Still fully readable
- ✅ Optimized for touch

### Screens < 768px
- ✅ Stacked vertical layout
- ✅ Full-width components
- ✅ Touch-friendly spacing (44px min)
- ✅ Readable font sizes (16px+)

---

## 🎓 Terminology Guide

- **Borrowed** - Book taken from library
- **Active Borrowing** - Book currently out (not returned)
- **Overdue** - Book past its due date
- **Borrower** - User who borrowed a book
- **Period** - Time range (week/month)
- **Trend** - Pattern of change over time

---

## ✅ Feature Checklist for Users

- [x] View current week's borrowing stats
- [x] View monthly borrowing stats
- [x] See total active borrowed books
- [x] Monitor overdue books
- [x] View weekly trend chart
- [x] View monthly trend chart
- [x] See top 5 books by popularity
- [x] See top 5 borrowers
- [x] Filter by month
- [x] Refresh data on demand
- [x] Responsive on all devices
- [x] Access from admin/teacher dashboard

---

**Last Updated**: December 11, 2025
**Version**: 1.0
**Status**: Ready for Production

# Online Library Hub

A comprehensive web-based library management system with separate dashboards for students and teachers.

## Features

### Student Panel
- 📚 Browse library catalog
- 📖 Manage borrowed books
- ✏️ View and submit assignments
- 👤 Personal profile and progress tracking
- 📊 Reading statistics and progress

### Teacher Panel
- 👥 Manage student information
- 📚 Manage library catalog and inventory
- ✏️ Create and grade assignments
- 📈 View class statistics and reports
- 📊 Generate performance analytics

## Tech Stack

- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Backend**: Node.js with Express
- **Deployment**: Render.com

## Installation

### Local Development

1. Clone the repository
```bash
git clone <repository-url>
cd Quirino\ Online\ Library\ Hub
```

2. Install dependencies
```bash
npm install
```

3. Start the development server
```bash
npm start
```

4. Open your browser and visit `http://localhost:3000`

## Demo Accounts

### Student Account
- Email: `student@demo.com`
- Password: (any password)
- Role: Student

### Teacher Account
- Email: `teacher@demo.com`
- Password: (any password)
- Role: Teacher

Click "Demo" buttons on login page for quick access.

## Project Structure

```
Pedlisan Online Library Hub/
├── index.html                 # Login page
├── server.js                  # Express server
├── package.json              # Dependencies
├── README.md                 # Documentation
├── assets/
│   ├── css/
│   │   └── style.css        # Main stylesheet
│   └── js/
│       ├── auth.js          # Authentication logic
│       ├── student-dashboard.js
│       └── teacher-dashboard.js
└── pages/
    ├── student-dashboard.html
    └── teacher-dashboard.html
```

## Deployment on Render.com

### Steps to Deploy

1. **Create a Render Account**
   - Go to [render.com](https://render.com)
   - Sign up for a free account

2. **Connect GitHub Repository**
   - Push this project to GitHub
   - In Render dashboard, click "New +" → "Web Service"
   - Connect your GitHub repository

3. **Configure Service**
   - **Name**: `online-library-hub` (or your preferred name)
   - **Environment**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Region**: Choose closest to your location
   - **Plan**: Free tier available

4. **Deploy**
   - Click "Create Web Service"
   - Render will automatically deploy your application
   - Your site will be available at `https://<your-service-name>.onrender.com`

### Important Notes for Render Deployment

- The application will sleep after 15 minutes of inactivity on the free tier
- First request after sleep may take 10-30 seconds
- For production, upgrade to a paid plan
- Environment variables can be set in Render dashboard

## Features in Detail

### Login System
- Simple authentication with email, password, and role selection
- Demo accounts for quick testing
- Session-based login using sessionStorage

### Student Dashboard
- View borrowed books with due dates
- Search and filter book catalog by category
- Track reading progress
- Submit assignments
- View grades and feedback
- Access reading recommendations

### Teacher Dashboard
- Manage library inventory
- Add/edit/delete books
- Create assignments with due dates
- Grade student submissions
- View student information and progress
- Generate performance reports
- Track class statistics

## Future Enhancements

- Backend database integration (MongoDB, PostgreSQL)
- User authentication with JWT
- Email notifications
- File upload for assignments
- Advanced search and filtering
- Reading groups and communities
- Mobile app version
- API documentation

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

MIT License - feel free to use this project for personal and educational purposes.

## Support

For issues and questions, please create an issue in the repository.

---

**Online Library Hub** - Making reading and learning accessible to all students and teachers.
"# QuirinoOnlineLibraryHub" 


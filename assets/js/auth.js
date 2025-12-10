// Authentication Handler
document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const demoStudentBtn = document.querySelector('.btn-demo-student');
    const demoTeacherBtn = document.querySelector('.btn-demo-teacher');

    // Handle login form submission
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const userType = document.getElementById('userType').value;

            // Simple validation
            if (email && password && userType) {
                // Store user data in sessionStorage
                const userData = {
                    email: email,
                    userType: userType,
                    loginTime: new Date().toLocaleString()
                };
                sessionStorage.setItem('userData', JSON.stringify(userData));

                // Redirect based on user type
                if (userType === 'student') {
                    window.location.href = 'pages/student-dashboard.html';
                } else if (userType === 'teacher') {
                    window.location.href = 'pages/teacher-dashboard.html';
                }
            } else {
                alert('Please fill in all fields');
            }
        });
    }

    // Demo Student Login
    if (demoStudentBtn) {
        demoStudentBtn.addEventListener('click', () => {
            const userData = {
                email: 'student@demo.com',
                name: 'John Doe',
                userType: 'student',
                class: '10-A',
                loginTime: new Date().toLocaleString()
            };
            sessionStorage.setItem('userData', JSON.stringify(userData));
            window.location.href = 'pages/student-dashboard.html';
        });
    }

    // Demo Teacher Login
    if (demoTeacherBtn) {
        demoTeacherBtn.addEventListener('click', () => {
            const userData = {
                email: 'teacher@demo.com',
                name: 'Ms. Sarah Johnson',
                userType: 'teacher',
                department: 'English Literature',
                loginTime: new Date().toLocaleString()
            };
            sessionStorage.setItem('userData', JSON.stringify(userData));
            window.location.href = 'pages/teacher-dashboard.html';
        });
    }
});

// Logout function
function logout() {
    if (confirm('Are you sure you want to logout?')) {
        sessionStorage.removeItem('userData');
        window.location.href = '../index.html';
    }
}

// Toggle between login and registration
function toggleRegistration() {
    const registrationBox = document.getElementById('registrationBox');
    if (registrationBox) {
        registrationBox.style.display = registrationBox.style.display === 'none' ? 'block' : 'none';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const registrationForm = document.getElementById('registrationForm');
    const teacherLoginForm = document.getElementById('teacherLoginForm');
    const adminLoginForm = document.getElementById('adminLoginForm');

    // Handle Student Registration
    if (registrationForm) {
        registrationForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const firstName = document.getElementById('regFirstName').value;
            const lastName = document.getElementById('regLastName').value;
            const email = document.getElementById('regEmail').value;
            const password = document.getElementById('regPassword').value;
            const confirmPassword = document.getElementById('regConfirmPassword').value;
            const classValue = document.getElementById('regClass').value;

            // Validation
            if (!firstName || !lastName || !email || !password || !confirmPassword || !classValue) {
                showAlert('Please fill in all required fields', 'error');
                return;
            }

            if (password !== confirmPassword) {
                showAlert('Passwords do not match', 'error');
                return;
            }

            if (password.length < 6) {
                showAlert('Password must be at least 6 characters long', 'error');
                return;
            }

            // Fallback to session storage for demo
            const userData = {
                id: Math.random(),
                email: email,
                firstName: firstName,
                lastName: lastName,
                role: 'student',
                class: classValue,
                loginTime: new Date().toLocaleString()
            };
            sessionStorage.setItem('userData', JSON.stringify(userData));
            showAlert('Account created successfully! Redirecting...', 'success');
            setTimeout(() => {
                window.location.href = 'pages/student-dashboard.html';
            }, 1500);
        });
    }

    // Handle Student Login
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            if (!email || !password) {
                showAlert('Please fill in all fields', 'error');
                return;
            }

            // Demo login for students
            const userData = {
                email: email,
                firstName: 'John',
                lastName: 'Student',
                role: 'student',
                class: '10-A',
                loginTime: new Date().toLocaleString()
            };
            sessionStorage.setItem('userData', JSON.stringify(userData));
            window.location.href = 'pages/student-dashboard.html';
        });
    }

    // Handle Teacher Login
    if (teacherLoginForm) {
        teacherLoginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const email = document.getElementById('teacherEmail').value;
            const password = document.getElementById('teacherPassword').value;

            if (!email || !password) {
                showAlert('Please enter your email and password', 'error');
                return;
            }

            // Demo login for teachers
            const userData = {
                email: email,
                firstName: 'Sarah',
                lastName: 'Johnson',
                role: 'teacher',
                department: 'English Literature',
                loginTime: new Date().toLocaleString()
            };
            sessionStorage.setItem('userData', JSON.stringify(userData));
            window.location.href = 'pages/teacher-dashboard.html';
        });
    }

    // Handle Admin Login
    if (adminLoginForm) {
        adminLoginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const email = document.getElementById('adminEmail').value;
            const password = document.getElementById('adminPassword').value;

            if (!email || !password) {
                showAlert('Please enter your email and password', 'error');
                return;
            }

            // Demo login for admins
            const userData = {
                email: email,
                firstName: 'Admin',
                lastName: 'User',
                role: 'admin',
                department: 'Administration',
                adminRole: 'super-admin',
                loginTime: new Date().toLocaleString()
            };
            sessionStorage.setItem('userData', JSON.stringify(userData));
            window.location.href = 'pages/admin-dashboard.html';
        });
    }
});

function showAlert(message, type = 'error') {
    const alertContainer = document.getElementById('alertContainer');
    if (alertContainer) {
        const alertDiv = document.createElement('div');
        alertDiv.className = `alert alert-${type}`;
        alertDiv.textContent = message;
        
        alertContainer.innerHTML = '';
        alertContainer.appendChild(alertDiv);

        if (type !== 'error') {
            setTimeout(() => {
                alertDiv.style.opacity = '0';
                alertDiv.style.transition = 'opacity 0.3s';
                setTimeout(() => alertDiv.remove(), 300);
            }, 3000);
        }
    }
}

// Logout function
function logout() {
    if (confirm('Are you sure you want to logout?')) {
        sessionStorage.removeItem('userData');
        window.location.href = '../index.html';
    }
}




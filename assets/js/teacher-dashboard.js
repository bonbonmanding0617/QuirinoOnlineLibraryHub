// Teacher Dashboard Handler
document.addEventListener('DOMContentLoaded', () => {
    // Check if user is logged in
    const userData = JSON.parse(sessionStorage.getItem('userData'));
    
    if (!userData || userData.userType !== 'teacher') {
        window.location.href = '../index.html';
        return;
    }

    // Set user greeting
    const userGreeting = document.getElementById('userGreeting');
    if (userGreeting) {
        userGreeting.textContent = `Welcome, ${userData.name || userData.email}!`;
    }

    // Set teacher info
    document.getElementById('teacherName').textContent = userData.name || 'Ms. Sarah Johnson';
    document.getElementById('teacherEmail').textContent = userData.email;
    document.getElementById('teacherDept').textContent = userData.department ? `Department: ${userData.department}` : 'Department: English Literature';

    // Navigation handler
    const navItems = document.querySelectorAll('.nav-item');
    const sections = document.querySelectorAll('.section');

    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Remove active class from all items
            navItems.forEach(ni => ni.classList.remove('active'));
            sections.forEach(s => s.classList.remove('active'));

            // Add active class to clicked item
            item.classList.add('active');
            
            // Show corresponding section
            const sectionId = item.getAttribute('data-section');
            const section = document.getElementById(sectionId);
            if (section) {
                section.classList.add('active');
                
                // Update page title
                const pageTitle = document.getElementById('pageTitle');
                const titleMap = {
                    'dashboard': 'Dashboard',
                    'manage-books': 'Manage Books',
                    'create-assignment': 'Create Assignment',
                    'grade-assignment': 'Grade Assignment',
                    'students': 'Students',
                    'reports': 'Reports',
                    'profile': 'Profile'
                };
                pageTitle.textContent = titleMap[sectionId] || 'Dashboard';
            }
        });
    });

    // Manage books - Edit/Delete handlers
    const editButtons = document.querySelectorAll('table .btn-small:not(.btn-danger)');
    editButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            alert('Edit book modal would open here. You can update book details.');
        });
    });

    const deleteButtons = document.querySelectorAll('table .btn-danger');
    deleteButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const bookTitle = btn.parentElement.parentElement.querySelector('td').textContent;
            if (confirm(`Are you sure you want to delete "${bookTitle}"?`)) {
                btn.parentElement.parentElement.remove();
                alert('Book deleted successfully!');
            }
        });
    });

    // Create assignment form
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            alert('Assignment created successfully! Students will be notified.');
            form.reset();
        });
    });

    // Grade assignment buttons
    const gradeButtons = document.querySelectorAll('.submission-card .btn-primary');
    gradeButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            alert('Grading interface would open. You can enter score, feedback, and rubric here.');
        });
    });

    // View submission buttons
    const viewButtons = document.querySelectorAll('.submission-card .btn-secondary');
    viewButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            alert('Submission viewer would open showing student\'s work.');
        });
    });

    // Student search
    const searchInputs = document.querySelectorAll('.search-input');
    searchInputs.forEach(input => {
        input.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase();
            const rows = document.querySelectorAll('table tbody tr');
            
            rows.forEach(row => {
                const text = row.textContent.toLowerCase();
                if (text.includes(searchTerm)) {
                    row.style.display = '';
                } else {
                    row.style.display = 'none';
                }
            });
        });
    });

    // Filter select
    const filterSelects = document.querySelectorAll('.filter-select');
    filterSelects.forEach(select => {
        select.addEventListener('change', (e) => {
            const filterValue = e.target.value;
            console.log('Filtering by:', filterValue);
            // In a real app, this would filter the data
        });
    });

    // View student profile
    const viewProfileButtons = document.querySelectorAll('table .btn-small:not(.btn-danger)');
    viewProfileButtons.forEach(btn => {
        if (btn.textContent === 'View Profile') {
            btn.addEventListener('click', () => {
                alert('Student profile modal would open showing their academic progress, books borrowed, and assignment history.');
            });
        }
    });

    // Report generation buttons
    const reportButtons = document.querySelectorAll('.report-card .btn-primary');
    reportButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            alert('Generating report... This would create a PDF or CSV file with detailed analytics.');
        });
    });

    // Profile edit button
    const editProfileBtn = document.querySelector('.btn-edit');
    if (editProfileBtn) {
        editProfileBtn.addEventListener('click', () => {
            alert('Edit profile modal would open. You can update your information here.');
        });
    }

    // Add book button
    const addBookBtn = document.querySelector('.btn-primary');
    if (addBookBtn && addBookBtn.textContent.includes('Add New Book')) {
        addBookBtn.addEventListener('click', () => {
            alert('Add book form would open. You can enter ISBN, title, author, and other details.');
        });
    }
});

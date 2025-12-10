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
                    'borrowing-approvals': 'Borrowing Approvals',
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

// ================================
// Borrowing Approval Functions
// ================================

function approveBorrowing(borrowingId) {
    if (confirm('Approve this borrowing request?')) {
        // Find and update the borrowing request in the table
        const table = document.getElementById('pendingRequestsTable');
        const rows = table.querySelectorAll('tr');
        
        rows.forEach((row, index) => {
            if (index === borrowingId - 1) {
                // Move to approved list
                const approvedTable = document.getElementById('approvedBorrowingsTable');
                
                // Get data from current row
                const cells = row.querySelectorAll('td');
                const studentName = cells[0].textContent;
                const bookTitle = cells[1].textContent;
                const requestedDate = cells[2].textContent;
                const dueDate = cells[3].textContent;
                const today = new Date().toISOString().split('T')[0];
                
                // Create new row for approved borrowings
                const newRow = document.createElement('tr');
                newRow.innerHTML = `
                    <td>${studentName}</td>
                    <td>${bookTitle}</td>
                    <td>${today}</td>
                    <td>${dueDate}</td>
                    <td><span class="badge badge-approved">APPROVED</span></td>
                    <td>
                        <button class="btn-small" onclick="viewBorrowingDetails(${borrowingId})">View</button>
                    </td>
                `;
                
                // Remove pending request
                row.remove();
                
                // Add to approved list
                if (approvedTable.querySelector('.empty-state')) {
                    approvedTable.querySelector('.empty-state').remove();
                }
                approvedTable.appendChild(newRow);
                
                // Show success message
                showSuccessMessage('Borrowing request approved successfully!');
            }
        });
    }
}

function rejectBorrowing(borrowingId) {
    const reason = prompt('Enter rejection reason (optional):');
    
    if (reason !== null) {
        const table = document.getElementById('pendingRequestsTable');
        const rows = table.querySelectorAll('tr');
        
        rows.forEach((row, index) => {
            if (index === borrowingId - 1) {
                row.remove();
                showSuccessMessage('Borrowing request rejected.');
            }
        });
    }
}

function viewBorrowingDetails(borrowingId) {
    alert(`Viewing details for borrowing #${borrowingId}. Full details panel would open here.`);
}

function showSuccessMessage(message) {
    const alertDiv = document.createElement('div');
    alertDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background-color: #A85C5C;
        color: white;
        padding: 15px 20px;
        border-radius: 6px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        z-index: 1000;
        animation: slideIn 0.3s ease-in-out;
    `;
    alertDiv.textContent = message;
    document.body.appendChild(alertDiv);
    
    setTimeout(() => {
        alertDiv.style.animation = 'slideOut 0.3s ease-in-out';
        setTimeout(() => alertDiv.remove(), 300);
    }, 3000);
}




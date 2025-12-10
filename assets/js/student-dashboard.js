// Student Dashboard Handler
document.addEventListener('DOMContentLoaded', () => {
    // Check if user is logged in
    const userData = JSON.parse(sessionStorage.getItem('userData'));
    
    if (!userData || userData.userType !== 'student') {
        window.location.href = '../index.html';
        return;
    }

    // Set user greeting
    const userGreeting = document.getElementById('userGreeting');
    if (userGreeting) {
        userGreeting.textContent = `Welcome, ${userData.name || userData.email}!`;
    }

    // Set student info
    document.getElementById('studentName').textContent = userData.name || 'John Doe';
    document.getElementById('studentEmail').textContent = userData.email;
    document.getElementById('studentClass').textContent = userData.class ? `Class: ${userData.class}` : 'Class: 10-A';

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
                    'books': 'Browse Books',
                    'my-books': 'My Books',
                    'assignments': 'Assignments',
                    'profile': 'Profile'
                };
                pageTitle.textContent = titleMap[sectionId] || 'Dashboard';
            }
        });
    });

    // Book borrow buttons
    const borrowButtons = document.querySelectorAll('.btn-borrow');
    borrowButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const bookTitle = btn.parentElement.querySelector('h4').textContent;
            alert(`Book "${bookTitle}" borrowed successfully! Due date: ${getNextTwoWeeks()}`);
            // In a real app, this would update the database
        });
    });

    // Return book buttons
    const returnButtons = document.querySelectorAll('.btn-return');
    returnButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const bookTitle = btn.parentElement.querySelector('h4').textContent;
            if (confirm(`Return "${bookTitle}"?`)) {
                btn.parentElement.remove();
                alert('Book returned successfully!');
            }
        });
    });

    // Filter tabs for My Books
    const tabButtons = document.querySelectorAll('.tab-btn');
    tabButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            tabButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const filter = btn.getAttribute('data-filter');
            filterBooks(filter);
        });
    });

    // Book search
    const bookSearch = document.getElementById('bookSearch');
    if (bookSearch) {
        bookSearch.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase();
            const bookCards = document.querySelectorAll('.book-card');
            
            bookCards.forEach(card => {
                const title = card.querySelector('h4').textContent.toLowerCase();
                const author = card.querySelector('.author').textContent.toLowerCase();
                
                if (title.includes(searchTerm) || author.includes(searchTerm)) {
                    card.style.display = '';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    }

    // Category filter
    const categoryFilter = document.getElementById('categoryFilter');
    if (categoryFilter) {
        categoryFilter.addEventListener('change', (e) => {
            const selectedCategory = e.target.value;
            const bookCards = document.querySelectorAll('.book-card');
            
            bookCards.forEach(card => {
                const category = card.querySelector('.category').textContent.toLowerCase();
                
                if (selectedCategory === '' || category.includes(selectedCategory)) {
                    card.style.display = '';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    }

    // Submit assignment buttons
    const submitButtons = document.querySelectorAll('.btn-submit');
    submitButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            alert('Assignment submission form would open. In a real app, you could upload files here.');
        });
    });

    // Profile edit button
    const editProfileBtn = document.querySelector('.btn-edit');
    if (editProfileBtn) {
        editProfileBtn.addEventListener('click', () => {
            alert('Edit profile modal would open. You can update your information here.');
        });
    }
});

// Helper function to get date 2 weeks from now
function getNextTwoWeeks() {
    const date = new Date();
    date.setDate(date.getDate() + 14);
    return date.toLocaleDateString();
}

// Filter books by status
function filterBooks(filter) {
    // This would filter based on borrowed, completed, or wishlist
    console.log('Filtering books by:', filter);
    // In a real app, this would update the displayed books
}




(async () => {
  const base = process.env.BASE_URL || process.env.SERVER_URL || 'http://localhost:3000';
  const endpoints = [
    '/api/health',
    '/api/borrowings/top-books?period=week'
  ];

  let failed = false;
  let createdUserId = null;
  let createdBookId = null;

  // Basic GET checks
  for (const ep of endpoints) {
    const url = base.replace(/\/$/, '') + ep;
    process.stdout.write(`Checking GET ${url} ... `);
    try {
      const res = await fetch(url, { method: 'GET' });
      const text = await res.text();
      if (!res.ok) {
        console.error(`FAILED (status ${res.status})`);
        console.error(text);
        failed = true;
      } else {
        console.log('OK');
      }
    } catch (err) {
      console.error('ERROR');
      console.error(err.message);
      failed = true;
    }
    console.log('');
  }

  // POST: Register a test user
  try {
    const unique = Date.now();
    const testEmail = `smoke${unique}@example.local`;
    const userPayload = { name: `Smoke Tester ${unique}`, email: testEmail, role: 'student', password: 'Sm0keTest!' };
    process.stdout.write(`Creating test user ${testEmail} ... `);
    const createUserRes = await fetch(base.replace(/\/$/, '') + '/api/users', {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(userPayload)
    });
    const createUserJson = await createUserRes.json().catch(()=>({}));
    if (createUserRes.status !== 201 || !createUserJson.user || !createUserJson.user.id) {
      console.error('FAILED to create user');
      console.error(createUserRes.status, createUserJson);
      failed = true;
    } else {
      console.log('OK');
    }

    const userId = createUserJson.user && createUserJson.user.id;
    createdUserId = userId || null;

    // Verify user appears in list
    process.stdout.write('Verifying user list contains new user ... ');
    const usersRes = await fetch(base.replace(/\/$/, '') + '/api/users');
    const usersJson = await usersRes.json().catch(()=>({}));
    const found = Array.isArray(usersJson.users) && usersJson.users.some(u => u.email === testEmail);
    if (!found) { console.error('FAILED - user not found'); failed = true; } else { console.log('OK'); }

    // POST: Add a book with created_by = userId
    process.stdout.write('Creating test book ... ');
    const bookForm = new FormData();
    bookForm.append('title', `Smoke Test Book ${unique}`);
    bookForm.append('author', 'Smoke Author');
    bookForm.append('isbn', `SMOKE-${unique}`);
    if (userId) bookForm.append('created_by', String(userId));

    const bookRes = await fetch(base.replace(/\/$/, '') + '/api/books', { method: 'POST', body: bookForm });
    const bookJson = await bookRes.json().catch(()=>({}));
    if (bookRes.status !== 201 || !bookJson.book || !bookJson.book.id) {
      console.error('FAILED to create book');
      console.error(bookRes.status, bookJson);
      failed = true;
    } else {
      console.log('OK');
      createdBookId = bookJson.book.id || null;
    }
  } catch (err) {
    console.error('ERROR during POST tests:', err.message || err);
    failed = true;
  }
  // Cleanup: try to delete created records (best-effort)
  try {
    if (createdBookId) {
      const adminKey = process.env.ADMIN_API_KEY;
      const delHeaders = adminKey ? { 'x-api-key': adminKey } : {};
      process.stdout.write(`Cleaning up book ${createdBookId} ... `);
      const delBook = await fetch(base.replace(/\/$/, '') + `/api/books/${createdBookId}`, { method: 'DELETE', headers: delHeaders });
      if (delBook.ok) { console.log('OK'); } else { console.log(`Skipped (${delBook.status})`); }
    }
  } catch (err) {
    console.error('Error cleaning book:', err.message || err);
  }

  try {
    if (createdUserId) {
      const adminKey = process.env.ADMIN_API_KEY;
      const delHeaders = adminKey ? { 'x-api-key': adminKey } : {};
      process.stdout.write(`Cleaning up user ${createdUserId} ... `);
      const delUser = await fetch(base.replace(/\/$/, '') + `/api/users/${createdUserId}`, { method: 'DELETE', headers: delHeaders });
      if (delUser.ok) { console.log('OK'); } else { console.log(`Skipped (${delUser.status})`); }
    }
  } catch (err) {
    console.error('Error cleaning user:', err.message || err);
  }

  if (failed) {
    console.error('One or more smoke tests failed');
    process.exit(1);
  }

  console.log('All smoke tests passed');
  process.exit(0);
})();

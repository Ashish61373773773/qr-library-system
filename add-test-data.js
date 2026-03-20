const axios = require('axios');

// Add test data to populate Visitor Log
async function addTestData() {
  try {
    // Login first
    const loginRes = await axios.post('http://localhost:5000/api/auth/login', {
      email: 'admin@library.com',
      password: 'admin123'
    });

    const token = loginRes.data.token;
    const headers = { Authorization: `Bearer ${token}` };

    console.log('✅ Logged in, token:', token.substring(0, 20) + '...');

    // Create visitors
    const visitors = [
      { visitorId: 'V001', name: 'Ashish Kumar', email: 'ashish@example.com' },
      { visitorId: 'V002', name: 'Priya Sharma', email: 'priya@example.com' },
      { visitorId: 'V003', name: 'Rahul Singh', email: 'rahul@example.com' }
    ];

    for (const visitor of visitors) {
      await axios.post('http://localhost:5000/api/visitors', visitor, { headers });
      console.log(`✅ Created visitor: ${visitor.name}`);
    }

    // Create check-in records
    const checkins = [
      { visitorId: 'V001', bookId: 'B001' },
      { visitorId: 'V002', bookId: 'B002' },
      { visitorId: 'V003', bookId: 'B003' },
      { visitorId: 'V001', bookId: 'B004' } // Second visit for V001
    ];

    for (const checkin of checkins) {
      await axios.post('http://localhost:5000/api/checkins/scan', checkin, { headers });
      console.log(`✅ Check-in created for: ${checkin.visitorId}`);
    }

    // Check out some visitors
    setTimeout(async () => {
      await axios.post('http://localhost:5000/api/checkins/scan', { visitorId: 'V001' }, { headers });
      await axios.post('http://localhost:5000/api/checkins/scan', { visitorId: 'V002' }, { headers });
      console.log('✅ Some visitors checked out');
    }, 2000);

    console.log('\n🎉 Test data added! Refresh Visitor Log page to see records.');

  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
  }
}

addTestData();
"use strict";
async function testApi() {
    console.log('Testing Authentication API endpoints...');
    try {
        // 1. Test Login
        console.log('\n--- Test Case 1: POST /api/auth/login (Correct Credentials) ---');
        const loginResponse = await fetch('http://localhost:5000/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: 'admin@example.com',
                password: 'admin123',
            }),
        });
        const loginData = await loginResponse.json();
        console.log('Status:', loginResponse.status);
        console.log('Response:', JSON.stringify(loginData, null, 2));
        if (loginResponse.status !== 200 || !loginData.token) {
            throw new Error('Login failed!');
        }
        const token = loginData.token;
        // 2. Test Login with incorrect credentials
        console.log('\n--- Test Case 2: POST /api/auth/login (Incorrect Credentials) ---');
        const badLoginResponse = await fetch('http://localhost:5000/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: 'admin@example.com',
                password: 'wrongpassword',
            }),
        });
        const badLoginData = await badLoginResponse.json();
        console.log('Status:', badLoginResponse.status);
        console.log('Response:', JSON.stringify(badLoginData, null, 2));
        // 3. Test Protected Profile Route with valid token
        console.log('\n--- Test Case 3: GET /api/auth/profile (With Valid Token) ---');
        const profileResponse = await fetch('http://localhost:5000/api/auth/profile', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });
        const profileData = await profileResponse.json();
        console.log('Status:', profileResponse.status);
        console.log('Response:', JSON.stringify(profileData, null, 2));
        // 4. Test Protected Profile Route without token
        console.log('\n--- Test Case 4: GET /api/auth/profile (Without Token) ---');
        const badProfileResponse = await fetch('http://localhost:5000/api/auth/profile', {
            method: 'GET',
        });
        const badProfileData = await badProfileResponse.json();
        console.log('Status:', badProfileResponse.status);
        console.log('Response:', JSON.stringify(badProfileData, null, 2));
        // 5. Test Logout
        console.log('\n--- Test Case 5: POST /api/auth/logout ---');
        const logoutResponse = await fetch('http://localhost:5000/api/auth/logout', {
            method: 'POST',
        });
        const logoutData = await logoutResponse.json();
        console.log('Status:', logoutResponse.status);
        console.log('Response:', JSON.stringify(logoutData, null, 2));
        console.log('\nAll API endpoint test cases executed successfully!');
    }
    catch (error) {
        console.error('API Verification failed:', error);
    }
}
// Wait a brief moment to ensure server has started
setTimeout(testApi, 1000);

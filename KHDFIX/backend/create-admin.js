const axios = require('axios');

const createAdminUser = async () => {
    try {
        console.log('Creating admin user...\n');

        const response = await axios.post('http://localhost:5000/api/auth/register', {
            name: 'Admin User',
            email: 'admin@khadamati.com',
            phone: '+1234567890',
            password: 'Admin@123456',
            role: 'admin'
        });

        console.log('✅ Admin user created successfully!\n');
        console.log('Login Credentials:');
        console.log('==================');
        console.log('Email:    admin@khadamati.com');
        console.log('Password: Admin@123456');
        console.log('Role:     admin');
        console.log('\nToken:', response.data.token);
        console.log('\nYou can now login at: http://localhost:3000/login');

    } catch (error) {
        if (error.response) {
            console.error('❌ Error:', error.response.data.error);
            if (error.response.data.error.includes('already exists')) {
                console.log('\nAdmin user already exists. Use these credentials:');
                console.log('Email:    admin@khadamati.com');
                console.log('Password: Admin@123456');
            }
        } else {
            console.error('❌ Error:', error.message);
            console.log('\nMake sure the backend server is running on port 5000');
        }
    }
};

createAdminUser();

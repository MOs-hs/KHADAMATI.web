const pool = require('./config/database');

const checkContent = async () => {
    try {
        console.log('Checking database content...\n');

        // Check Services
        const [services] = await pool.query('SELECT * FROM service LIMIT 5');
        console.log('--- Services (First 5) ---');
        services.forEach(s => console.log(`ID: ${s.ServiceID}, Title: ${s.Title}, Desc: ${s.Description}`));

        // Check Users (Roles)
        const [users] = await pool.query('SELECT * FROM user LIMIT 5');
        console.log('\n--- Users (First 5) ---');
        users.forEach(u => console.log(`ID: ${u.UserID}, Name: ${u.Name}, Role: ${u.Role}`));

        process.exit(0);
    } catch (error) {
        console.error('Error:', error.message);
        process.exit(1);
    }
};

checkContent();

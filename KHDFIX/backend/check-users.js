const db = require('./config/database');

async function checkUsers() {
    try {
        const [users] = await db.query('SELECT Email FROM user');
        console.log('--- USER EMAILS ---');
        users.forEach(u => console.log(u.Email));
        console.log('-------------------');
        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

checkUsers();

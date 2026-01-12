const db = require('./config/database');

async function checkRecent() {
    try {
        console.log('USERS:');
        const [users] = await db.query('SELECT UserID, Name, Email, Role, CreatedAt FROM user ORDER BY UserID DESC LIMIT 3');
        users.forEach(u => console.log(`${u.UserID}: ${u.Name} (${u.Email}) - ${u.Role}`));

        console.log('\nPROVIDERS:');
        const [providers] = await db.query('SELECT ProviderID, UserID, Specialization FROM provider ORDER BY ProviderID DESC LIMIT 3');
        providers.forEach(p => console.log(`${p.ProviderID}: User ${p.UserID} - ${p.Specialization}`));

        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}
checkRecent();

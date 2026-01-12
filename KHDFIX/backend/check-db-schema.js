const db = require('./config/database');

async function checkSchema() {
    try {
        const [columns] = await db.query('SHOW COLUMNS FROM provider');
        console.log('Provider Columns:');
        columns.forEach(col => console.log(col.Field, col.Type, col.Null, col.Key));

        process.exit(0);
    } catch (error) {
        console.error('DB Check Failed:', error);
        process.exit(1);
    }
}

checkSchema();

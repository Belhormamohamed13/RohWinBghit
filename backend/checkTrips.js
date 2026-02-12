const knex = require('knex');
require('dotenv').config();

const db = knex({
    client: 'pg',
    connection: {
        host: process.env.DB_HOST || 'localhost',
        port: process.env.DB_PORT || 5432,
        user: process.env.DB_USER || 'postgres',
        password: process.env.DB_PASSWORD || 'postgres',
        database: process.env.DB_NAME || 'rohwinbghit',
    }
});

async function checkTrips() {
    try {
        const trips = await db('trips').select('*');
        console.log('--- All Trips ---');
        console.log(JSON.stringify(trips, null, 2));

        const count = await db('trips').count('* as count').first();
        console.log(`\nTotal trips: ${count.count}`);

        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

checkTrips();

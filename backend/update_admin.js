const knex = require('knex');
const path = require('path');
require('dotenv').config();

const dbConfig = require('./src/config/database');
const db = knex(dbConfig);

const email = 'admin@test.com';

async function checkAndUpgradeUser() {
    try {
        console.log(`Checking user: ${email}...`);
        const user = await db('users').where({ email: email.toLowerCase() }).first();

        if (!user) {
            console.log(`User ${email} not found.`);
            process.exit(0);
        }

        console.log(`User found. Current role: ${user.role}`);

        if (user.role !== 'admin') {
            console.log('Upgrading role to admin...');
            await db('users')
                .where({ id: user.id })
                .update({
                    role: 'admin',
                    updated_at: new Date()
                });
            console.log('User upgraded to admin successfully!');
        } else {
            console.log('User is already an admin.');
        }
    } catch (error) {
        console.error('Error updating user:', error);
    } finally {
        await db.destroy();
        process.exit(0);
    }
}

checkAndUpgradeUser();

const app = require('./app');
const env = require('./config/env');
const { query, closePool } = require('./config/database');

const PORT = env.PORT || 5000;

const server = app.listen(PORT, async () => {
    try {
        await query('SELECT 1');
        console.log(`🚀 Server running in ${env.NODE_ENV} mode on port ${PORT}`);
    } catch (err) {
        console.error('Failed to connect to PostgreSQL database:', err.message);
        process.exit(1);
    }
});

const handleShutdown = (signal) => {
    console.log(`\n${signal} received. Closing HTTP server...`);
    server.close(async () => {
        console.log('HTTP server closed.');
        try {
            await closePool();
            console.log('PostgreSQL pool closed successfully.');
        } catch (err) {
            console.error('Error closing PostgreSQL pool:', err);
        }
        process.exit(0);
    });
};

process.on('SIGTERM', () => handleShutdown('SIGTERM'));
process.on('SIGINT', () => handleShutdown('SIGINT'));
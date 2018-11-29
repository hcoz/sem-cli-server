const { Client } = require('pg');

/** query the database for a related command */
function dbQuery(intent, os) {
    return new Promise((resolve, reject) => {
        if (!intent || !os) {
            reject('missing parameter');
            return;
        }

        const client = new Client({
            connectionString: process.env.DATABASE_URL,
            ssl: true,
        });
    
        client.connect();
    
        client.query(`SELECT command, danger_level FROM commands WHERE os='${os}' AND intent='${intent}'`, (err, res) => {
            if (err) {
                reject(err);
                client.end();
                return;
            }

            resolve(res.rows[0]);
            client.end();
        });
    });
}

module.exports = dbQuery;

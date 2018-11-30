const { Client } = require('pg');

/** query the database for a related command */
function search(intent, os) {
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

/** insert a suggestion to the database */
function insert(intent, command, os, dangerLevel) {
    
}

module.exports = {
    search: search,
    insert: insert
};

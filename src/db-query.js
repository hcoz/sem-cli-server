const { Client } = require('pg');

const constants = require('./constants.json');

/** query the database for a related command */
function search(intent, os) {
    return new Promise(async (resolve, reject) => {
        if (!intent || !os) {
            reject(constants.MISSING_PARAM);
            return;
        }

        const client = new Client({
            connectionString: process.env.DATABASE_URL,
            ssl: true
        });

        try {
            await client.connect();
            const res = await client.query(`SELECT command, danger_level FROM commands WHERE os='${os}' AND intent='${intent}';`);
            resolve(res.rows[0]);
            await client.end();
        } catch (err) {
            console.error(err);
            reject(err);
            await client.end();
        }
    });
}

/** insert a suggestion to the database */
function insert(intent, command, os, dangerLevel) {
    return new Promise(async (resolve, reject) => {
        if (!intent || !command || !os || !dangerLevel) {
            reject(constants.MISSING_PARAM);
            return;
        }

        const client = new Client({
            connectionString: process.env.DATABASE_URL,
            ssl: true
        });

        try {
            await client.connect();
            const res = await client.query(`INSERT INTO suggestions (intent, os, command, danger_level) VALUES ('${intent}','${os}','${command}','${dangerLevel}');`);
            resolve(res.rows[0]);
            await client.end();
        } catch (err) {
            console.error(err);
            reject(err);
            await client.end();
        }
    });
}

module.exports = {
    search: search,
    insert: insert
};

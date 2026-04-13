require('dotenv').config();
const mysql = require('mysql2');

const connection = mysql.createPool({
    uri: process.env.DATABASE_URL
});

module.exports = connection.promise();
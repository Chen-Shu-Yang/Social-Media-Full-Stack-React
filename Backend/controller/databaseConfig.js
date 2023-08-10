/* IMPORTS */
import mysql from "mysql"
import database from "../dbConfig.js"
// const { databaseUserName, databaseHost, database, databasePassword } = require('../dbConfig');

/* OBJECTS AND FUNCTIONS */
const config = (
    {
        user: database.databaseUserName,
        password: database.databasePassword,
        host: database.databaseHost,
        database: database.databaseName,
    }
);

const pool = new mysql.createPool(config);

/* EXPORTS */
export default pool;
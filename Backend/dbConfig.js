// importing dotenv
import dotenv from "dotenv";
dotenv.config();

const database =  {
  databaseUserName: process.env.USER,
  databaseHost: process.env.HOST,
  databaseName: process.env.DATABASE,
  databasePassword: process.env.PASSWORD,
};

// extracting info from .env file
export default database;
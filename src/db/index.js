const pool = require("./db");
const {
  createTables,
  addNewUser,
  isUniqueUser,
  dbHealthCheck,
  deleteUser,
  updateUser,
  getUserPassword,
  updateUserPassword,
  getUserId,
  cleanTable,
} = require("./dbQueries");

module.exports = {
  pool,
  createTables,
  addNewUser,
  isUniqueUser,
  dbHealthCheck,
  deleteUser,
  updateUser,
  getUserPassword,
  updateUserPassword,
  getUserId,
  cleanTable,
};

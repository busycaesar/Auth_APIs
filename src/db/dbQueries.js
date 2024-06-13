const pool = require("./db");
const fs = require("fs");

const createTables = () => {
  return new Promise((resolve, reject) => {
    const createTableQuery = fs.readFileSync("src/db/tables.sql", "utf8");
    pool
      .query(createTableQuery)
      .then(() => resolve("All tables created."))
      .catch((error) =>
        reject(
          new Error(
            `Database error while creating all the tables. ${error.message}`
          )
        )
      );
  });
};

const cleanTable = () => {
  return new Promise((resolve, reject) => {
    const dropTablesQuery = 'DELETE FROM "auth-api_user";';
    pool
      .query(dropTablesQuery)
      .then(() => {
        resolve();
      })
      .catch(() =>
        reject(new Error("Database error while clearning all the tables."))
      );
  });
};

const isUniqueUser = async (username) => {
  return new Promise((resolve, reject) => {
    const checkUniqUserQuery =
      'SELECT username FROM "auth-api_user" WHERE username = $1;';
    pool
      .query(checkUniqUserQuery, [username])
      .then((result) => {
        if (!result.rowCount) resolve(true);
        reject(new Error(`The username is already taken.`));
      })
      .catch((error) =>
        reject(new Error(`Database error while checking uniqueness: ${error}`))
      );
  });
};

const getUserPassword = (id) => {
  return new Promise((resolve, reject) => {
    let where = "id";
    if (isNaN(id)) where = "username";

    // Query to fetch user data from the database based on the provided username/id.
    const query = `SELECT password FROM "auth-api_user" WHERE ${where} = $1;`;
    console.log(query);
    pool
      .query(query, [id])
      .then((result) => {
        if (!result.rowCount) reject(new Error(`No user found with ${id}.`));
        resolve(result.rows[0].password);
      })
      .catch((error) =>
        reject(new Error(`Error getting the user password: ${error}`))
      );
  });
};

const getUserId = (username) => {
  return new Promise((resolve, reject) => {
    // Query to fetch user id from the database.
    const getUserIdQuery = `SELECT id FROM "auth-api_user" WHERE username = $1;`;
    pool
      .query(getUserIdQuery, [username])
      .then((result) => {
        if (!result.rowCount)
          reject(new Error(`No user found with the username ${username}.`));
        resolve(result.rows[0].id);
      })
      .catch((error) =>
        reject(new Error(`Error getting the user password: ${error}`))
      );
  });
};

const addNewUser = (username, password) => {
  return new Promise((resolve, reject) => {
    const insertUserQuery = `
        INSERT INTO "auth-api_user" (username, password)
        VALUES ($1, $2)
        RETURNING id, username;
        `;
    pool
      .query(insertUserQuery, [username, password])
      .then((result) => {
        const { id, username } = result.rows[0];
        resolve({ _id: id, _username: username });
      })
      .catch((error) =>
        reject(new Error(`Database error while adding ${username}`))
      );
  });
};

const updateUser = (id, username) => {
  return new Promise((resolve, reject) => {
    const updateUserQuery = `
        UPDATE "auth-api_user" 
        SET username = $1
        WHERE id = $2;
        `;

    pool
      .query(updateUserQuery, [username, id])
      .then((result) => {
        if (!result.rowCount) reject(new Error(`No user found with id ${id}.`));
        resolve(`${username}'s username is updated.`);
      })
      .catch((error) => {
        reject(
          new Error(`Database error while updathing ${username}. ${error}`)
        );
      });
  });
};

const updateUserPassword = (id, newPassword) => {
  return new Promise((resolve, reject) => {
    const updateUserPasswordQuery = `
        UPDATE "auth-api_user" 
        SET password = $1
        WHERE id = $2;
        `;
    pool
      .query(updateUserPasswordQuery, [newPassword, id])
      .then((result) => {
        if (!result.rowCount) reject(new Error(`No user found with id ${id}.`));
        resolve(`${id}'s password is updated.`);
      })
      .catch((error) => {
        reject(
          new Error(`Database error while updathing ${id}'s password. ${error}`)
        );
      });
  });
};

const deleteUser = (id) => {
  return new Promise((resolve, reject) => {
    const deleteUserQuery = `
    DELETE FROM "auth-api_user" 
    WHERE id=${id};
    `;
    pool
      .query(deleteUserQuery)
      .then((result) => {
        if (!result.rowCount)
          reject(new Error(`Database error. No user found with ${id}.`));
        resolve(`User ${id} deleted successfully.`);
      })
      .catch((error) =>
        reject(new Error(`Database error while deleting the user. ${error}`))
      );
  });
};

const dbHealthCheck = () => {
  return new Promise((resolve, reject) => {
    const healthCheckQuery = `SELECT CURRENT_TIMESTAMP as health_check_time;`;
    pool
      .query(healthCheckQuery)
      .then((result) => resolve(result.rows[0].health_check_time))
      .catch((error) =>
        reject(new Error(`Database error while health check. ${error}`))
      );
  });
};

module.exports = {
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

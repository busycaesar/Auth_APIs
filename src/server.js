const app = require("./app");
require("dotenv").config();
const { createTables } = require("./db");

const APP_PORT = process.env.APP_PORT;

if (!APP_PORT) process.exit(1);

app.listen(APP_PORT, async () => {
  // Create all the required tables.
  try {
    await createTables();
    console.log(`Server started on PORT: ${APP_PORT}`);
  } catch (error) {
    console.log(`Could not start the server. ${error}`);
  }
});

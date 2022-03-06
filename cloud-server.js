const dotenv = require("dotenv");

/**
 * Loads the configured envoiroment variables
 */
dotenv.config({ path: "./config.env" });
const app = require("./app");

const port = process.env.PORT || 7000;

const server = app.listen(port, () => {
  console.log(`APP running on port ${port}...`);
});
require("dotenv").config();
require("module-alias/register");

// Able to be called globally
require("./utils/PrototypeUtils");
require("./utils/Logger");

// Initialise MongoDB connection
require("./database/mongoose");

const app = require("./app");
const PORT = process.env.PORT;
const HOST = process.env.HOST;

app.listen(PORT, HOST, () => {
  Logger.info(`Server listening on http://${HOST}:${PORT}/`);
});

import config from "./config/env.js";

import app from "./app.js";

const startServer = async () => {
  try {
    const { port } = config;

    app.listen(port, () => {});
  } catch (error) {
    process.exit(1);
  }
};

startServer();

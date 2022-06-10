const app = require("./app");
const connectDatabase = require("./config/database");

const dotenv = require("dotenv");

//Handle uncaught exceptions

process.on("uncaughtException", (err) => {
  console.log("Error:" + err.message);
  console.log("Uncaught exception");
  process.exit(1);
});

dotenv.config({ path: "server/config/config.env" });

//connectDatabase
connectDatabase();

const server = app.listen(process.env.PORT, () => {
  console.log(
    `Server is running on PORT: ${process.env.PORT} in ${process.env.NODE_ENV} mode`
  );
});

//Handle unhandledRejection
process.on("unhandledRejection", (err) => {
  console.log("Error: " + err.message);
  console.log("Shutting down server");
  server.close(() => {
    process.exit(1);
  });
});

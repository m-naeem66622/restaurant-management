require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectToDatabase = require("./config/db");
const { notFound, errorHandler } = require("./middlewares/error.middleware");
const startCronJob = require("./helpers/cron-job.helper");

connectToDatabase();
startCronJob();

const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Available routes
const managerRoutes = require("./routes/manager.route");
app.use("/api/managers", managerRoutes);
const employeeRoutes = require("./routes/employee.route");
app.use("/api/employees", employeeRoutes);
const scheduleRoutes = require("./routes/schedule.route");
app.use("/api/schedules", scheduleRoutes);

app.use(notFound);
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

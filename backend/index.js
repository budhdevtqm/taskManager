const express = require("express");
const databaseConnection = require("./app/config/database").dbConnection;
const userRouter = require("./app/router/userRoutes");
const projectRouter = require("./app/router/projectRoutes");
const taskRouter = require("./app/router/taskRouter");
const cors = require("cors");
const path = require("path");

const app = express();
databaseConnection();

//common middlewares
app.use(cors({ origin: "*" }));

// body-parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname,'public')));

app.use("/user", userRouter);
app.use("/project", projectRouter);
app.use("/task", taskRouter);

app.listen(4000, () => console.log("server started"));

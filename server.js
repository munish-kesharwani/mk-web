require(`rootpath`)();
const express = require("express");
const createError = require("http-errors");
const path = require(`path`);
const cors = require("cors");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const config = require("config.json");
const EmploymentService = require("./services/EmploymentService");

const app = express();
const routes = require("./routes");

const port = 3000;

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "./views"));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors(config.secret));
app.use(cookieParser());

//cookieParser()

app.use(express.static(path.join(__dirname, "./static")));

const employmentService = new EmploymentService("./data/employment.json");

app.use("/", routes({ employmentService }));

app.use(async (request, response, next) => {
  const emplist = await employmentService.getNames();
  response.locals.message = "File Not Found";
  const status = 404;
  //response.local.status = status;
  response.status = status;
  response.render("pages/error", {
    errorCode: status,
    errorMessage: "File Not Found",
    empList: emplist,
  });
});

app.use(async (err, request, response, next) => {
  console.log(err);
  const emplist = await employmentService.getNames();
  response.locals.message = err.message;
  const status = err.status || 500;
  //response.local.status = status;
  response.status = status;
  response.render("pages/error", {
    errorCode: status,
    errorMessage: err.message,
    empList: emplist,
  });
});

console.log(`started running @ ${__dirname}`);

app.listen(port, () => {
  console.log(`express server started and listening on port --: ${port}`);
});

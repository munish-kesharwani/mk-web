const { request, response } = require("express");
const express = require("express");
const userService = require("../users/user.service");
const dayjs = require("dayjs");
const fs = require("fs");

const router = express.Router();

module.exports = (params) => {
  const { employmentService } = params;

  router.get(`/`, async (request, response, next) => {
    try {
      const emplist = await employmentService.getNames();
      // check if token exists and not expired. then display resume ejs
      // if token doesn't exist - render login-password ejs
      console.log(request.cookies);
      if (!request.cookies || !request.cookies.secureCookie) {
        // render login page. that will send post request to resume (handled below)
        console.log("cookie doesn't exist");
        return response.render("pages/resume/resume-login", {
          empList: emplist,
        });
      }
      const token = request.cookies.secureCookie.token;
      try {
        await userService.validateToken(token);
      } catch (error) {
        // reset cookie and login again.
        console.log(error);
        return response.render("pages/resume/resume-login", {
          empList: emplist,
        });
      }

      console.log("cookie found");

      response.setHeader(
        "Content-disposition",
        'inline; filename="' + "resume.pdf" + '"'
      );
      response.setHeader("Content-type", "application/pdf");

      const stream = await fs.createReadStream("./data/logo-design.pdf");
      stream.pipe(response); //readStream("./data");
      //const filename = "logo-design.pdf";
      // Be careful of special characters

      //filename = encodeURIComponent(filename);
      // Ideally this should strip them

      //response.end();
    } catch (error) {
      return next(error);
    }
  });

  router.post("/", async (request, response, next) => {
    try {
      // authenticate the user.
      // create tthe token
      // set the token.
      // then redirect.

      const emplist = await employmentService.getNames();
      const username = request.body.username;
      const password = request.body.password;

      console.log(username, password);
      console.log(request.body);
      console.log(await userService.hashPassword(password));

      const token = await userService.authenticate(request.body);

      console.log(token);

      if (!token) {
        console.log("token not found");
        return response.render("pages/resume/resume-login", {
          empList: emplist,
        });
      }

      console.log("token foudn");
      response.cookie("secureCookie", token);

      console.log("ccokie has beent set");

      return response.redirect("/resume");
    } catch (error) {
      console.log(error);
      return next(error);
    }
  });

  return router;
};

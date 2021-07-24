const { request, response } = require("express");
const express = require("express");

const router = express.Router();

const experienceRout = require("./experience");
const employmentRout = require("./employment");
const feedbackRout = require("./feedback");
const resumeRout = require("./resume");

module.exports = (params) => {
  const { employmentService } = params;
  router.get(`/`, async (request, response, next) => {
    try {
      const empList = await employmentService.getNames();
      return response.render("pages/index", { empList: empList });
    } catch (error) {
      return next(error);
    }
  });

  router.get("/error", async (request, response) => {
    const emplist = await employmentService.getNames();
    response.render("pages/error", {
      errorCode: response.statusCode,
      errorMessage: response.statusMessage,
      empList: emplist,
    });
  });

  router.use("/employment", employmentRout(params));
  router.use("/experience", experienceRout(params));
  router.use("/feedback", feedbackRout(params));

  router.use("/resume", resumeRout(params));

  return router;
};

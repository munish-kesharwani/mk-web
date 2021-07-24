const { request, response } = require("express");
const express = require("express");

const router = express.Router();

module.exports = (params) => {
  const feedbackService = require("../services/FeedbackServices.js");
  const { employmentService } = params;
  router.get(`/`, async (request, response, next) => {
    try {
      const emplist = await employmentService.getNames();
      const feedbackList = await feedbackService.read();
      console.log(feedbackList);
      return response.render("pages/feedback/feedback", {
        empList: emplist,
        feedback: feedbackList,
      });
    } catch (error) {
      return next(error);
    }
  });

  router.post(`/`, async (request, response, next) => {
    try {
      const emplist = await employmentService.getNames();
      const write = await feedbackService.write(request.body);
      const feedbackList = await feedbackService.read();
      console.log(feedbackList);
      return response.render("pages/feedback/feedback", {
        empList: emplist,
        feedback: feedbackList,
      });
    } catch (error) {
      return next(error);
    }
  });

  return router;
};

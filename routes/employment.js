const { request, response } = require("express");
const express = require("express");

const router = express.Router();

module.exports = (params) => {
  const { employmentService } = params;
  router.get(`/`, async (request, response, next) => {
    try {
      const employment = await employmentService.getList();
      const emplist = await employmentService.getNames();
      console.log(employment);
      return response.render("./pages/employment/employment", {
        empList: emplist,
        employmentData: employment,
      });
    } catch (error) {
      return next(error);
    }
  });

  return router;
};

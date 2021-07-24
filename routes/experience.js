const { request, response } = require("express");
const express = require("express");

const router = express.Router();

module.exports = (params) => {
  const { employmentServie } = params;
  router.get(`/`, async (request, response, next) => {
    try {
      const emplist = await employmentServie.getNames();
      return response.render("pages/experience", {
        empList: emplist,
      });
    } catch (error) {
      return next(error);
    }
  });

  return router;
};

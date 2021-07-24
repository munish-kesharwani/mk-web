/**
 * services package that has FeedbackServices.
 */

const config = require("config.json");

const fs = require("fs");
const util = require("util");

const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);
const feedbackFile = "./data/feedback.json";

module.exports = {
  read,
  write,
};

async function read() {
  return getData();
}

async function write({ name, email, message }) {
  const data = (await getData()) || [];
  data.unshift({ name, email, message });

  return writeFile(feedbackFile, JSON.stringify(data));
}

/**
 * Fetches feedback data from the JSON file provided to the constructor
 */
async function getData() {
  const data = await readFile(feedbackFile, "utf8");
  console.log(data);
  if (!data) return [];
  return JSON.parse(data);
}

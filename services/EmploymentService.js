const fs = require("fs");
const util = require("util");

/**
 * We want to use async/await with fs.readFile - util.promisfy gives us that
 */
const readFile = util.promisify(fs.readFile);

/**
 * Logic for fetching Employment information
 */
class EmploymentService {
  /**
   * Constructor
   * @param {*} datafile Path to a JSOn file that contains the employment data
   */
  constructor(datafile) {
    this.datafile = datafile;
  }

  /**
   * Returns a list of employment (company ) name
   */
  async getNames() {
    const data = await this.getData();

    // We are using map() to transform the array we get into another one
    return data.map((employment) => {
      return { name: employment.name };
    });
  }

  /**
   * Get a list of speakers
   */
  async getList() {
    const data = await this.getData();
    console.log(data);
    return data.map((employment) => {
      return {
        name: employment.name,
        role: employment.role,
        start: employment.start,
        message: employment.message,
        end: employment.end,
      };
    });
  }

  /**
   * Fetches speakers data from the JSON file provided to the constructor
   */
  async getData() {
    console.log(this.datafile);
    const data = await readFile(this.datafile, "utf8");
    return JSON.parse(data).employment;
  }
}

module.exports = EmploymentService;

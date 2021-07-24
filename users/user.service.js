/**
 * Users package or rout is for authenticated/authorized users
 */

const config = require("config.json");
const jwt = require("jsonwebtoken");
const Role = require("_helpers/role");
const bcrypt = require("bcrypt");

const fs = require("fs");
const util = require("util");

/**
 * We want to use async/await with fs.readFile - util.promisfy gives us that
 */
const readFile = util.promisify(fs.readFile);

const saltRounds = 10;

const userDataFile = "./data/employment.json";

// users hardcoded for simplicity, store in a db for production applications
const users = [];

module.exports = {
  authenticate,
  getAll,
  getById,
  validateToken,
  hashPassword,
};

async function authenticate({ username, password }) {
  const users = await loadData();
  const user = users.find((u) => u.username === username);
  if (user) {
    console.log("user found");
    // is password same as ?
    console.log(
      "user password is:" + user.password + ": & plaintext:" + password
    );
    const match = await bcrypt.compare(password, user.password);
    if (match) {
      console.log("password is match");
      // issue a token that expires in 5 minutes.
      const token = jwt.sign(
        {
          exp: Math.floor(Date.now() / 1000) + 5 * 60,
          sub: user.id,
          role: user.role,
        },
        config.secret
      );
      console.log("JWT Sign is compete");
      const { password, ...userWithoutPassword } = user;
      return {
        ...userWithoutPassword,
        token,
      };
    }
    console.log("password match: " + match);
  }
}

async function getAll() {
  return users.map((u) => {
    const { password, ...userWithoutPassword } = u;
    return userWithoutPassword;
  });
}

async function getById(id) {
  const user = users.find((u) => u.id === parseInt(id));
  if (!user) return;
  const { password, ...userWithoutPassword } = user;
  return userWithoutPassword;
}

async function validateToken(token) {
  jwt.verify(token, config.secret, (error, decoded) => {
    if (error) {
      // token expired or what-ever
      throw new Error("Token Error");
    } else {
      // all good.
    }
  });
}

async function hashPassword(password) {
  const salt = bcrypt.genSaltSync(saltRounds);
  const hash = bcrypt.hashSync(password, salt);
  // Store hash in your password DB.
  return hash;
}

async function loadData() {
  const datafile = "./data/users.json";
  console.log(datafile);
  const data = await readFile(datafile, "utf8");
  return JSON.parse(data).users;
}

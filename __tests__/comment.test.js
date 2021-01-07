const fs = require("fs");
const pool = require("../lib/utils/pool");
// const request = require("supertest");
// const app = require("../lib/app");
// const UserService = require("../lib/services/UserService");

describe("Comment Routes", () => {
  beforeEach(() => {
    return pool.query(fs.readFileSync("./sql/setup.sql", "utf-8"));
  });

  it("", async() => {


  });

});

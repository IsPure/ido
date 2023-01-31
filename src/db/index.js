const { Pool } = require("pg");
const pool = new Pool({
  // user: "isaacpure",
  host: "localhost",
  database: "wedding_app_db",
  // password: "",
  port: 5432,
});

module.exports = {
  query: (text, params) => pool.query(text, params),
};

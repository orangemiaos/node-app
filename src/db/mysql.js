let mysql = require("mysql");

let connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "zhangmeng",
  database: "myblog",
});

connection.connect();

function exec(sql) {
  return new Promise((resolve, reject) => {
    connection.query(sql, function (error, results) {
      if (error) {
        reject(error);
        return;
      }
      resolve(results);
    });
  });
}

module.exports = {
  exec,
};

const { exec, escape } = require("../db/mysql");

function login(username, password) {
  username = escape(username);
  password = escape(password);
  /*
   * sql注入
   * 输入 zhangsan'-- ，select username,password from users where username='zhangsan'-- ' and password='1233232'
   * 那么你查询任何的username都可登录
   * 引用sql.escape，将输入内容都转译为“”,遇到特殊字符做转译
   */
  let sql = `select username,password from users where username=${username} and password=${password}`;
  console.log("sql", sql);
  return exec(sql).then((rows) => {
    return rows[0] || {};
  });
}

module.exports = {
  login,
};

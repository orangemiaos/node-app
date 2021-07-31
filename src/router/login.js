const { SuccessModal, ErrorModal } = require("../modal");
const { set } = require("../db/redis");
const { login } = require("../controller/user");

module.exports = (req, res) => {
  let method = req.method;
  let url = req.url;

  // 通过userId检查登录信息
  if (method === "GET" && url === "/login-check") {
    if (req.session) {
      return new SuccessModal(req.session);
    }
    return new ErrorModal("没登录");
  }

  // 处理登录
  if (method === "POST" && url === "/api/login") {
    let { username, password } = req.body;
    const result = login(username, password);
    return result.then((data) => {
      if (data.username) {
        req.session.username = data.username;
        req.session.password = data.password;
        set(req.sessionId, req.session);
        return new SuccessModal("登录成功");
      }
      return new ErrorModal("登录失败");
    });
  }
};

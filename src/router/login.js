const { SuccessModal, ErrorModal } = require("../modal");
const { set, get } = require("../db/redis");

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
    if (
      (username === "zhangmeng" && password === "123456") ||
      (username === "zhangsan" && password === "123")
    ) {
      req.session.username = username;
      req.session.password = password;
      set(req.sessionId, req.session);
      return new SuccessModal("登录成功");
    }

    return new ErrorModal("登录失败");
  }
};

const { SuccessModal, ErrorModal } = require("../modal");
const { set } = require("../db/redis");
const { login, register } = require("../controller/user");
const { encryption } = require("../utils/crypto");

module.exports = (req, res) => {
  let method = req.method;
  let url = req.url;

  // 通过userId检查登录信息
  // if (method === "GET" && url === "/login-check") {
  //   if (req.session) {
  //     return Promise.resolve("已登录");
  //   }
  //   return Promise.reject(new ErrorModal("没登录"));
  // }

  if (method === "GET" && url === "/") {
    return Promise.resolve(encryption("345"));
  }

  // 处理注册
  if (method === "POST" && url === "/api/register") {
    let { username, password } = req.body;
    const result = register(username, password);
    return result.then((data) => {
      if (data.id) {
        return new SuccessModal("注册成功");
      }
      return new ErrorModal("注册失败");
    });
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

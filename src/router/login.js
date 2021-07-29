const { SuccessModal, ErrorModal } = require("../modal");

module.exports = (req, res) => {
  let method = req.method;
  let url = req.url;

  if (method === "GET" && url === "/") {
    return "/";
  }
  // 处理登录
  if (method === "POST" && url === "/api/login") {
    let { username, password } = req.body;
    if (username === "zhangmeng" && password === "123456") {
      return new SuccessModal("登录成功");
    }

    return new ErrorModal("登录失败");
  }
};

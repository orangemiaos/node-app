const { SuccessModal, ErrorModal } = require("../modal");

module.exports = (req, res) => {
  let method = req.method;
  let url = req.url;

  // 处理登录
  if (method === "POST" && url === "/api/login") {
    if (req.body.username === "zhangmeng" && req.body.password === "123456") {
      return new SuccessModal("登录成功");
    }

    return new ErrorModal("登录失败");
  }
};

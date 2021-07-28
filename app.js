const handleRouter = require("./src/router");
const { getPostData, getGetData, handleCookie } = require("./src/utils");

module.exports = (req, res) => {
  res.setHeader("Content-Type", "application/json");

  // 处理cookie
  handleCookie(req, res);

  // 获取get传递过来的数据，放在req.query 上
  getGetData(req, res);

  // 获取post传递过来的数据，放在req.body 上
  getPostData(req, res).then((postData) => {
    req.body = postData;
    // 处理路由时会用到postData，所以先获取再处理路由
    // 返回的结果是登录成功，或者登陆失败的码
    let result = handleRouter(req, res);

    // response.end()方法接收的参数类型只能是字符串或Buffer，
    res.end(JSON.stringify(result));
  });
};

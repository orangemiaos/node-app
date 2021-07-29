const handleRouter = require("./src/router");
const { getPostData, handleQuery, handleCookie } = require("./src/utils");

module.exports = (req, res) => {
  res.setHeader("Content-Type", "application/json");

  // 获取path
  let url = req.url;
  req.path = url.split("?")[0];

  // 解析query，获取get传递过来的数据，放在req.query 上
  handleQuery(req, res);

  // 解析cookie
  handleCookie(req, res);

  let needSetCookie = false;
  let userid = req.cookie.userid;
  if (!userid) {
    needSetCookie = true;
    userid = `${Date.now()}_${Math.random()}`;
  }

  if (needSetCookie) {
    // 过期时间如果使用max-age，max-age的单位是s，过期后浏览器会自动清楚cookie，下次请求会重新setCookie
    // cookie不可以使用中文
    res.setHeader(
      "Set-Cookie",
      `userid=${userid}; path=/; httpOnly; max-age=${maxAge}`
    );
  }

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

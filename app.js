const handleLoginRouter = require("./src/router/login");
const { handlePostData, handleQuery, handleCookie } = require("./src/utils");
const { set, get } = require("./src/db/redis");

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
    set(userid, {});
  }
  req.sessionId = userid;
  get(req.sessionId)
    .then((sessionData) => {
      if (sessionData) {
        req.session = sessionData;
      } else {
        req.session = {};
        set(req.sessionId, {});
      }
      /*
       * 获取post传递过来的数据，放在req.body 上
       * 由于是获取post参数异步方法，后续内容需要异步回调
       */
      return handlePostData(req);
    })
    .then((postData) => {
      req.body = postData;

      // 处理路由时会用到postData，所以先获取再处理路由
      // 返回处理路由的结果
      let result = handleLoginRouter(req, res);
      if (result) {
        if (needSetCookie) {
          let maxAge = 24 * 60 * 60 * 1000;
          // 过期时间如果使用max-age，max-age的单位是s，过期后浏览器会自动清除cookie，下次请求会重新setCookie
          // cookie不可以使用中文
          res.setHeader(
            "Set-Cookie",
            `userid=${userid}; path=/; httpOnly; max-age=${maxAge}`
          );
        }
        // response.end()方法接收的参数类型只能是字符串或Buffer，
        res.end(JSON.stringify(result));
        return;
      }

      /*
       * 未命中路由，返回 404
       * response.writeHead，向请求发送响应头
       * params 1.code 2.响应头
       */
      res.writeHead(404, { "Content-type": "text/plain" });
      res.end("404 Not Found\n");
    });
};

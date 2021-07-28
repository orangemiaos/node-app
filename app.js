module.exports = (req, res) => {
  res.setHeader("Content-Type", "application/json");

  // let method = req.method;
  // let url = req.url;

  /*
   * 判断是否包含那个需要验证的cookie
   * cookie是一个拼接的字符串，所以要拆分开，再查询是否有我们需要的那个(sessionId)
   */
  req.cookie = {};
  if (req.headers.cookie) {
    req.headers.cookie.split("; ").forEach((item) => {
      let arr = item.split("=");
      let key = arr[0],
        value = arr[1];
      req.cookie[key] = value;
    });
  }

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
      `userid=${userid}; path=/; httpOnly; max-age=${24 * 60 * 60 * 1000}`
    );
  }
  res.end("你好");
};

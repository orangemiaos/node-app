/*
 *  获取post传递过来的数据，是一个对象
 *  如果是get方法，则返回一个空对象即可
 *  如果post方法没有传递参数，也返回一个空对象
 */
const getPostData = (req, res) => {
  return new Promise((resolve) => {
    if (req.method !== "POST") {
      resolve({});
      return;
    }

    let postData = "";
    req.on("data", (chunk) => {
      postData += chunk.toString();
    });

    // 异步获取，所以在req.end中才可以监听到
    req.on("end", () => {
      if (!postData) {
        resolve({});
        return;
      }
      // postData是一个字符串
      resolve(JSON.parse(postData));
    });
  });
};

/*
 * post请求，或者get请求未传参，则挂载空对象
 */
const getGetData = (req, res) => {
  let url = req.url;
  req.query = {};
  let query = url.split("?")[1];
  if (query) {
    query.split("&").forEach((item) => {
      let arr = item.split("=");
      req.query[arr[0]] = arr[1];
    });
  }
};

/*
 * 判断是否包含那个需要验证的cookie
 * cookie是一个拼接的字符串，所以要拆分开，再查询是否有我们需要的那个(sessionId)
 */
const handleCookie = (req, res) => {
  let maxAge = 24 * 60 * 60 * 1000;
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
      `userid=${userid}; path=/; httpOnly; max-age=${maxAge}`
    );
  }
};

module.exports = {
  getPostData,
  getGetData,
  handleCookie,
};

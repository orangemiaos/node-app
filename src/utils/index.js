/*
 * 解析query
 * 获取get传递过来的数据，放在req.query 上
 * post请求，或者get请求未传参，则挂载空对象
 */
const handleQuery = (req, res) => {
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
};

/*
 *  获取post传递过来的数据，放到body上
 *  post传递过来的是一个对象
 *  如果是get方法，则返回一个空对象。如果post方法没有传递参数，也返回一个空对象
 */
const handlePostData = (req, res) => {
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
      // postData是一个字符串，需要转为对象形式传回
      resolve(JSON.parse(postData));
    });
  });
};

module.exports = {
  handleQuery,
  handleCookie,
  handlePostData,
};

const redis = require("redis");

// 创建客户端
const client = redis.createClient();

client.on("error", function (error) {
  console.error(error);
});

function set(key, value) {
  // 只能存字符串
  if (typeof value === "object") {
    value = JSON.stringify(value);
  }
  client.set(key, value, redis.print);
}

// 异步获取
function get(key) {
  return new Promise((resolve, reject) => {
    client.get(key, (err, val) => {
      if (err) {
        reject(err);
        return;
      }
      // 取到的val也是字符串，转为对象格式
      resolve(JSON.parse(val));
    });
  });
}

module.exports = {
  set,
  get,
};

const crypto = require("crypto");

function encryption(content) {
  const hash = crypto.createHash("md5");
  return hash.update(content).digest("hex");
}

module.exports = {
  encryption,
};

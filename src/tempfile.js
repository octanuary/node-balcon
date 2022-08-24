const crypto = require("crypto");
const { join } = require("path");
const tempPath = require("os").tmpdir();

module.exports = () => join(tempPath, crypto.randomUUID() + ".wav");

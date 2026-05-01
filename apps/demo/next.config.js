const path = require("path");

module.exports = {
  reactStrictMode: true,
  transpilePackages: ["@puckeditor/core", "lucide-react"],
  turbopack: {
    root: path.join(__dirname, "../.."),
  },
};

const eslintTurboConfig = require("eslint-config-turbo");
const turboConfig =
  eslintTurboConfig.default?.extends || eslintTurboConfig.extends || [];

module.exports = {
  extends: ["next", ...turboConfig, "prettier"],
  settings: {
    turbo: {
      rootDir: process.cwd(),
    },
  },
  rules: {
    "@next/next/no-html-link-for-pages": "off",
    "turbo/no-undeclared-env-vars": "off",
  },
  parserOptions: {
    babelOptions: {
      presets: [],
    },
  },
};

/* eslint-disable max-len */
var chalk = require('chalk')

module.exports = {
  ERR_CONFIG_FACTORY_TARGET_MISSING:
    `  ${chalk.gray('｢hpm｣')}: Missing "target" option. Example: {target: "http://www.example.org"}`,
  ERR_CONTEXT_MATCHER_GENERIC:
    `  ${chalk.gray('｢hpm｣')}: Invalid context. Expecting something like: "/api" or ["/api", "/ajax"]`,
  ERR_CONTEXT_MATCHER_INVALID_ARRAY:
    `  ${chalk.gray('｢hpm｣')}: Invalid context. Expecting something like: ["/api", "/ajax"] or ["/api/**", "!**.html"]`,
  ERR_PATH_REWRITER_CONFIG:
    `  ${chalk.gray('｢hpm｣')}: Invalid pathRewrite config. Expecting object with pathRewrite config or a rewrite function`
}

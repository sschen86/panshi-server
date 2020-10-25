module.exports = {
  root: true,
  extends: '@shushu.pro/all',
  env: {
    jest: true,
    node: true,
    browser: true,
  },
  rules: {
    'max-len': [ 'error', { code: 160 } ],
  },
}

const path = require('path') //引入path模块
function resolve(dir) {
  return path.join(__dirname, dir) //path.join(__dirname)设置绝对路径
}

module.exports = {
  publicPath: './',
  outputDir: 'AS-Editor',
  assetsDir: 'static',
  productionSourceMap: false,
  // vue-router 4.6+ 的产物(.mjs)使用了可选链等新语法，webpack4 默认不转译 node_modules，
  // 需将其加入 transpileDependencies 交给 babel-loader 转译，避免 "Unexpected token" 编译错误
  transpileDependencies: ['vue-router'],
  devServer: {
    open: true,
    proxy: {
      '/api': {
        target: 'http://api.aseditor.fun/',
        ws: true,
        changeOrigin: true,
        pathRewrite: {
          '^/api': '',
        },
      },
    },
  },
  chainWebpack: (config) => {
    config.resolve.alias
      .set('@', resolve('./src'))
      .set('components', resolve('./src/components'))
      .set('css', resolve('./src/assets/css'))
      .set('iconfont', resolve('./src/assets/iconfont'))
      .set('img', resolve('./src/assets/images'))
      .set('utils', resolve('./src/utils'))
  },
}

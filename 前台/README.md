### webpack配置
```javascript
// const path = require('path');
module.exports = {
  /** 区分打包环境与开发环境
   * process.env.NODE_ENV==='production'  (打包环境)
   * process.env.NODE_ENV==='development' (开发环境)
   * baseUrl: process.env.NODE_ENV==='production'?"https://xxx":'',
   */
  // 项目部署的基础路径
  // 我们默认假设你的应用将会部署在域名的根部,
  // 例如 https://www.my-app.com/
  // 如果你的应用部署在一个子路径下，那么你需要在这里
  // 指定子路径。比如将你的应用部署在
  // https://www.foobar.com/my-app/
  // 那么将这个值改为 '/my-app/'
 
  //baseUrl: '/',//vue-cli3.3以下版本使用
  publicPath: '/',//vue-cli3.3+新版本使用
 
  // 构建好的文件输出到哪里
  outputDir: "dist",
 
  // assetsDir: "base" //静态资源打包地址
 
  //以多页模式构建应用程序。
  pages: undefined,
 
  // 是否在保存时使用‘eslint-loader’进行检查 // 有效值: true | false | 'error'
  // 当设置为‘error’时，检查出的错误会触发编译失败
  lintOnSave: true,
 
  // 使用带有浏览器内编译器的完整构建版本,是否使用包含运行时编译器的 Vue 构建版本
  runtimeCompiler: false,
 
  // babel-loader默认会跳过`node_modules`依赖. // 通过这个选项可以显示转译一个依赖
  // 默认babel-loader忽略mode_modules，这里可增加例外的依赖包名
  transpileDependencies: [],
 
  // 是否在构建生产包时生成 sourceMap 文件，false将提高构建速度  映射文件 打包时使用
  productionSourceMap: false,
 
  // 调整内部的webpack配置.
  // see https://github.com/vuejs/vue-cli/blob/dev/docs/webpack.md
  chainWebpack: () => { },
  // chainWebpack: () => {
  //   // 删除懒加载模块的prefetch，降低带宽压力
  //   // 而且预渲染时生成的prefetch标签是modern版本的，低版本浏览器是不需要的
  //   //config.plugins.delete('prefetch');
  //   //if(process.env.NODE_ENV === 'production') {
  //   // 为生产环境修改配置...process.env.NODE_ENV !== 'development'
  //   //} else {
  //   // 为开发环境修改配置...
  //   //}
  // },
  configureWebpack: () => { },
  // configureWebpack: () => {
  // // 生产and测试环境
  // let pluginsPro = [
  //   new CompressionPlugin({ //文件开启Gzip，也可以通过服务端(如：nginx)
  //     filename: '[path].gz[query]',
  //     algorithm: 'gzip',
  //     test: new RegExp('\\.(' + ['js', 'css'].join('|') + ')$'),
  //     threshold: 8192,
  //     minRatio: 0.8,
  //   }),
  //   new BundleAnalyzerPlugin(),
  // ];
  // //开发环境
  // let pluginsDev = [
  //   new vConsolePlugin({
  //     filter: [], // 需要过滤的入口文件
  //     enable: true // 发布代码前记得改回 false
  //   }),
  // ];
  // if (process.env.NODE_ENV === 'production') { // 为生产环境修改配置...process.env.NODE_ENV !== 'development'
  //   config.plugins = [...config.plugins, ...pluginsPro];
  // } else {
  //   // 为开发环境修改配置...
  //   config.plugins = [...config.plugins, ...pluginsDev];
  // }
  // },
 
  // CSS 相关选项
  css: {
    // 将组件内部的css提取到一个单独的css文件（只用在生产环境）
    // 也可以是传递给 extract-text-webpack-plugin 的选项对象
    // 是否使用css分离插件 ExtractTextPlugin，采用独立样式文件载入，不采用<style>方式内联至html文件中
    extract: true,
 
    // 是否在构建css样式映射，false将提高构建速度
    sourceMap: false,
 
    // css预设器配置项
    loaderOptions: {
      //   sass: {
      //     data: ''//`@import "@/assets/scss/mixin.scss";`
      //   }
    },
 
    // 启用 CSS modules for all css / pre-processor files.
    modules: false
  },
 
  // 构建时开启多进程处理 babel 编译
  //是否为 Babel 或 TypeScript 使用 thread-loader。
  //该选项在系统的 CPU 有多于一个内核时自动启用，仅作用于生产构建，在适当的时候开启几个子进程去并发的执行压缩
  parallel: require("os").cpus().length > 1,
 
  // PWA 插件相关配置
  // 单页插件相关配置 https://github.com/vuejs/vue-cli/tree/dev/packages/%40vue/cli-plugin-pwa
  pwa: {},
 
  //vue3.0+
  devServer: {//跨域
    open: process.platform === "darwin",
    //open: true, //配置自动启动浏览器
    disableHostCheck: false,
    host: "0.0.0.0",
    // host: "0.0.0.0" =>
    //   App running at:
    // - Local:   http://localhost:8080/
    // - Network: http://192.168.1.102:8080/
    // host: "127.0.0.1"=>
    //   App running at:
    // - Local:   http://127.0.0.1:8080/
    // - Network: http://127.0.0.1:8080/
    port: 8080,// 端口号
    https: false,// true 配置之后可使用生成 https://localhost:8080/
    hotOnly: false,// 热更新（webpack已实现了，这里false即可）
    // proxy: null // 设置代理
    proxy: 'http://localhost:8080'   // 配置跨域处理,只设一个代理
    //   proxy: { //多个
    //     // 配置跨域处理 可以设置多个
    //     '/api': {
    //       target: 'https://www.baidu.com/api',
    //       ws: true,
    //       changeOrigin: true
    //     }
    //   }
    // before: app => {}
  },
 
  // vue 2.0 设置跨域
  // dev: {
  //   // proxyTable: {
  //   //     '/api': {
  //   //         target: 'http://127.0.0.1:8080', // 目标地址
  //   //         changeOrigin: true,
  //   //         pathRewrite: {
  //   //             '^/api': '' // 将目标地址变成这个
  //   //         }
  //   //     }
  //   // },
  // },
 
  // 是否启用dll webpack dll
  // 关于dll只做简单解释 未附详细代码
  // webpack.dll.conf.js
  // 1、entry配置需要dll打包的库
  // 2、module配置处理对应文件类型的loader
  // 3、增加 webpack.DllPlugin插件
  //    (1)、path:生成mainfest.json文件的绝对路径。mainfest.json里面的内容为所有被打包到dll.js文件模块id的映射。
  //    (2)、name：webpack打包时mainfest.json包含的库的暴露出来的函数名名
  //    (3)、contenxt(可选):引入manifest文件的context，默认为webpack的context
  // dll: false,//配置好dll库，设置dll：true；可优化打包效率。减少打包时间，增加库缓存
 
  // 第三方插件配置
  pluginOptions: {},
  // pluginOptions: {
  //   'style-resources-loader': {//https://github.com/yenshih/style-resources-loader
  //     preProcessor: 'scss',//声明类型
  //     'patterns': [
  //       //path.resolve(__dirname, './src/assets/scss/_common.scss'),
  //     ],
  //     //injector: 'append'
  //   }
  // }
};
```
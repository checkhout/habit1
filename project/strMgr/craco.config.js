const path = require("path");
const {
  // when,
  // whenDev,
  whenProd,
  // whenTest,
  // ESLINT_MODES,
  // POSTCSS_MODES
} = require("@craco/craco");
const CracoLessPlugin = require('craco-less');//配置less
//打包结果分析
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
//打包进度
const SimpleProgressWebpackPlugin = require( 'simple-progress-webpack-plugin' );
//检测模块编译情况
const CircularDependencyPlugin = require('circular-dependency-plugin');

module.exports = {
  webpack: {
    //Any webpack configuration options
    configure: (webpackConfig, { env, paths }) => {
      if (process.env.NODE_ENV === 'production') {
        //去掉map文件
        webpackConfig.devtool = false;
        webpackConfig.output = {
          ...webpackConfig.output,
          publicPath: '/',//正式环境
          // publicPath: '/data/',//220环境 在App.js中配置了router basename
        };
      }
      else {
        webpackConfig.devtool = "cheap-module-eval-source-map";
      }

      return webpackConfig
    },
    // 配置别名：将来写路径可以简写
    alias: {
      "@":             path.resolve("src"),
      "@utils":        path.resolve("src/utils"),
      "@api":          path.resolve("src/api"),
      "@pages":        path.resolve("src/pages"),
      "@assets":       path.resolve("src/assets"),
      "@style":        path.resolve("src/assets/style"),
      "@config":       path.resolve("src/config"),
      "@components":   path.resolve("src/components"),
      "@actions":      path.resolve("src/redux/actions"),
    },
    plugins: [
      new SimpleProgressWebpackPlugin(),
      ...whenProd(() => [
        new BundleAnalyzerPlugin(),
        new CircularDependencyPlugin({
          exclude: /node_modules/,
          include: /src/,
          failOnError: true, //allow import cycles that include an asyncronous import
          allowAsyncCycles: false, //set the current working directory for displaying module paths
          cwd: process.cwd()
        }),
      ], []),
    ]
  },
  plugins: [
    {
      plugin: CracoLessPlugin,
      options: {
        lessLoaderOptions: {
          lessOptions: {
            modifyVars: {
              // '@primary-color': '#379EEC',
              // '@link-color': '#3d5aff',
              // '@error-color': '#E80000',
              // '@warning-color': '#FFCD00',
              // '@success-color': '#0DA736',
            },
            javascriptEnabled: true,
          },
        },
      }
    },
  ],
  babel:{
    plugins: [
      ["@babel/plugin-proposal-decorators", { legacy: true }],  //装饰器
      [
        "import",
        {
          "libraryName": "antd",
          "libraryDirectory": "es",
          "style": true //自动打包相关的样式 默认为 style:'css'，配置了自动打包就不需要手动引入antd样式了
        }
      ]
    ]
  },
};

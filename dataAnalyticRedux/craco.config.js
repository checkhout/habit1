const path = require("path");
const {
  // when,
  // whenDev,
  whenProd,
  // whenTest,
  // ESLINT_MODES,
  // POSTCSS_MODES
} = require("@craco/craco");
// const pxtoviewport = require("postcss-px-to-viewport"); //移动端适配 兼容vant

const CracoLessPlugin = require('craco-less');//配置less
// 打印当前 webpack 配置
// const logWebpackConfigPlugin = require("./craco-plugin-log-webpack-config");
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
              // '@text-color': '#333333',
              // '@text-disable-color': '#D8D8D8',
              // '@font-size-base': '14px',
              // '@primary-color': '#379EEC',//按钮点击状态
              // '@link-color': '#3d5aff',
              // '@error-color': '#E80000',
              // '@warning-color': '#FFCD00',
              // '@success-color': '#0DA736',
              // '@disabled-bg': '#E0E3EA',
              // '@border-color-base': '#D8D8D8',
              // '@layout-sider-background': '#343947',
              // '@layout-header-background': '#FFFFFF',
              // '@layout-header-height': '48px',
              // '@layout-header-padding': '0 28px 0 10px',
              // '@layout-body-background': '#FFFFFF',
              // '@table-body-sort-bg': 'transparent',
              // '@table-row-hover-bg': '#EEEEEE',
              // '@table-selected-row-bg': 'transparent',
              // '@table-header-bg': '#EEEEEE',//表头背景色
              // '@modal-header-bg': '#F0F0F0',
              // '@modal-mask-bg': 'rgba(0,0,0,0.3)',
              // '@border-radius-base': '0',
              // '@normal-bg-color': '#333333',
              // '@sub-txt-color': '#838bA4',
              // '@title-color': '#0E0C1D',
              // '@text-auxiliary-color': '#D8D8D8',//placeholder
              // '@hover-primary-color': '#379EEC',
              // '@link-hover-bg-color': '#2640D3',
              // '@layout-sider-txt-color': '#787F93',
              // '@layout-active-sider-txt-color': '#E0E0E0',
              // '@ant-tabs-border-color': '#EDF0F5',
              // '@ant-tabs-tab-font-size': '12px',
              // '@ant-tabs-tab-line-height': '26px',
              // '@ant-tabs-tab-color': '#EBEEF4',
              // '@ant-tabs-tab-txt-color': '#8A919B',
              // '@base-font-size': '14px',
              // '@normal-line-height': 1,
              // '@pagination-size': '32px',
              // // '@border-radius-base': '2px',
              // '@main-content-height': '24px',
            },
            javascriptEnabled: true,
          },
        },
      }
    },
    // {
    //   plugin: logWebpackConfigPlugin,
    //   options: {
    //     preText: '开始打印webpack配置清单：'
    //   }
    // }
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

### npm i


### npm start


### npm build
> 220环境打包时需要额外加一层路径，需在 craco.config.js 和 config/index.js 中修改对应路径

### 技术选型
* CRA 4.0  注意：react17 需要node版本 10.x 以上
* craco 替换 react-app-rewired 启动
* redux-persist redux长期存储解决方案，该项目通过配置白名单来配置，配置位置在store.js


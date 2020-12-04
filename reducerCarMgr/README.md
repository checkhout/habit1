### npm i
### npm start
### npm build

### 技术选型
* CRA 4.0  注意：需要node版本 10.x 以上
* antd 4.x
* craco 替换 react-app-rewired 启动
* redux 管理数据
* redux-persist redux长期存储解决方案，该项目通过配置白名单来配置，配置位置在store.js
*

### 其他
* 尽量避免使用缩写，或者把注释写清楚也行
* 注意less、js、静态资源解耦
    - 定义在 common.less 中的类名尽量只在标签上使用
    - 定义在 mixin.less 中的方法都需要带上() 如：.mixin1() {...} //避免打包后mixin额外输出
    - 不要定义一行代码的 mixin， 那没有意义
* 保持reducer纯净，分离UI state和纯数据state




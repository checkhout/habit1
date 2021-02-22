import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';

/*
React.StrictMode 与 Fragment 一样，StrictMode 不会渲染任何节点，它为其后代元素触发额外的检查和警告。
StrictMode 目前有助于：
• 识别不安全的生命周期
• 关于使用过时字符串 ref API 的警告
• 关于使用废弃的 findDOMNode 方法的警告
• 检测意外的副作用
• 检测过时的 context API
*/
ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);


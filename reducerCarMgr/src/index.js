import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from "react-redux";
import { PersistGate } from 'redux-persist/integration/react'

import App from './App';
import storeConfig from './redux/store'

// import * as serviceWorker from './serviceWorker';
// import reportWebVitals from './reportWebVitals';

const { store, persistor } = storeConfig();
//如果您使用React，请用PersistGate包装您的根组件。
// 这将延迟应用程序UI的呈现，直到检索到您的持久状态并将其保存到Redux。
// 注意PersistGate加载属性可以为null，也可以是任何react实例，例如loading = {<正在加载/>}
ReactDOM.render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <App />
    </PersistGate>
  </Provider>,
  document.getElementById('root')
);


// 如果你想让你的应用离线工作并且加载速度更快，你可以将unregister()改为register()。注意，这带来了一些缺陷。
// Learn more about service workers: https://bit.ly/CRA-PWA
// serviceWorker.unregister();


// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();


/*无热模替换*/

/*
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from "react-redux";
import { PersistGate } from 'redux-persist/integration/react'

import App from './App';
import store from './redux/store'
import persistor from './redux/store'

// import * as serviceWorker from './serviceWorker';
// import reportWebVitals from './reportWebVitals';

//如果您使用React，请用PersistGate包装您的根组件。
// 这将延迟应用程序UI的呈现，直到检索到您的持久状态并将其保存到Redux。
// 注意PersistGate加载属性可以为null，也可以是任何react实例，例如loading = {<正在加载/>}
ReactDOM.render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <App />
    </PersistGate>
  </Provider>,
  document.getElementById('root')
);


// 如果你想让你的应用离线工作并且加载速度更快，你可以将unregister()改为register()。注意，这带来了一些缺陷。
// Learn more about service workers: https://bit.ly/CRA-PWA
// serviceWorker.unregister();


// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
*/

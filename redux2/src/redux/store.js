import { createStore, applyMiddleware} from 'redux'
import thunkMiddleware from 'redux-thunk'
import { composeWithDevTools } from 'redux-devtools-extension'
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage/session' //sessionStorage

import reducers from '@/redux/reducers'

let middleware = applyMiddleware(thunkMiddleware);

if (process.env.NODE_ENV === "development") {
	middleware = composeWithDevTools(middleware);
}

const storeConfig = () => {
	const persistConfig = {
		key: 'root',
		storage,
		whitelist: [//不配置白名单默认缓存整个store（避免session存储大小）
			'loginResult',//是否登录 部分用户信息
			'userInfoResult',//部分用户信息
			'companyInfoResult',//员工所在企业信息
			'persistPageStatusResult',//页面搜索状态
		],
		// blacklist: [],
	};
	const persistedReducer = persistReducer(persistConfig, reducers);
	const store = createStore(persistedReducer, middleware);
	const persistor = persistStore(store);

	// 模块热替换
	if (module.hot) {
		// module.hot.accept('./App');
		module.hot.accept('./reducers/index.js', () => {
			// This fetch the new state of the above reducers.
			const nextRootReducer = require('./reducers/index.js').default;
			store.replaceReducer(
				persistReducer(persistConfig, nextRootReducer)
			)
		})
	}

	return { store, persistor }
};

export default storeConfig

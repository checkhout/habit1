module.exports = {
	overrideWebpackConfig: ({ webpackConfig, cracoConfig, pluginOptions, context: { env, paths } }) => {
		if (pluginOptions.preText) {
			console.log(pluginOptions.preText);
		}

		if (process.env.NODE_ENV === 'production') {
			// webpackConfig.output.publicPath = '/'; //正式、开发环境
			webpackConfig.output.publicPath = '/carmgrs/'; //测试220

			webpackConfig.devtool = false; //去掉map文件
			// webpackConfig.devtool = "cheap-module-source-map"; //default value
		} else {
			webpackConfig.devtool = "cheap-module-eval-source-map";
		}


		console.log(JSON.stringify(webpackConfig, null, 4));

		// Always return the config object.
		return webpackConfig;
	}
};
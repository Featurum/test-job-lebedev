const SvgStore = require('webpack-svgstore-plugin')

module.exports = {
	devServer: {
	    compress: true,
	    port: 9001
	},
	pages: {
    	index: {
			// точка входа для страницы
			entry: 'src/main/main.js',

			// исходный шаблон
			template: 'public/index.html'
    	}
	},
	configureWebpack: {
    	plugins: [
      		/* Генерация SVG спрайтов */
		    new SvgStore({
		      	prefix:'',
		      	svgoOptions: {
		        	plugins: [
		          		{ removeUnknownsAndDefaults: false }
		        	]
		      	}
		    })
    	]
	}
}
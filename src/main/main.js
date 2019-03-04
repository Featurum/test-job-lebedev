import Vue from 'vue'
import Main from './main.vue'

import router from '../router'
import store from '../store'

import Meta from 'vue-meta'
Vue.use(Meta)

import VueSweetalert2 from 'vue-sweetalert2';
Vue.use(VueSweetalert2);

/* Компонент всплывающих уведомлений */
import VueFlashMessage from 'vue-flash-message';
require('vue-flash-message/dist/vue-flash-message.min.css');
Vue.use(VueFlashMessage, { messageOptions: { timeout: 5000, important: false }});

Vue.config.productionTip = false

new Vue({
	render: h => h(Main),
	router,
	store
}).$mount('#main')

import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)


const main = () => import('../services/main/main/main.vue');
const mainIndex = () => import('../services/main/pages/index/index.vue');

// Дериктории сервисов
const DIRECTORIES = {
    MAIN: "/",
};


// Управление скролом при переходах
const scrollBehavior = function (to, from, savedPosition) {
    // savedPosition сохраняет позицию при браузерной навигации
    if (savedPosition || to.params.noreload) {
        return savedPosition
    }
    // Скролл наверх при переходе
    else {
        return { x: 0, y: 0 }
    }
}


export default new Router({
	mode: 'history',
    scrollBehavior,
	routes: [
  		{
            path: DIRECTORIES.MAIN,
            component: main,
            children: [
                { name: 'mainIndex',  path: DIRECTORIES.MAIN,           component: mainIndex }
            ]
        }
	]
})

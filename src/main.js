import Vue from 'vue'
import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify';
import { createProvider } from './vue-apollo'
// import on your project (less then 1KB gziped)
import vueSmoothScroll from 'vue2-smooth-scroll'
import VueToastify from 'vue-toastify';
Vue.use(vueSmoothScroll)
Vue.use(VueToastify);
Vue.config.productionTip = false

new Vue({
  router,
  vuetify,
  apolloProvider: createProvider(),
  render: h => h(App)
}).$mount('#app')

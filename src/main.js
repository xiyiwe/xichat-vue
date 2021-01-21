import Vue from 'vue'
import App from './App.vue'
import './plugins/element.js'
import router from './router/router'
import axios from 'axios';
import VueAxios from 'vue-axios'
import VueSession from 'vue-session'
Vue.prototype.axios = axios
axios.defaults.baseURL = '/api'
// Vue.prototype.$axios = axios
Vue.use(VueSession)
Vue.config.productionTip = false

Vue.use(VueAxios,axios)
new Vue({
  render: h => h(App),
  router,
}).$mount('#app')

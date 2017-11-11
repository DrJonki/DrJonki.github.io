import Vue from 'vue'
import App from './App'
import router from './router'
import Vuetify from 'vuetify'

Vue.use(Vuetify)
Vue.config.productionTip = false

// eslint-disable-next-line no-new
new Vue({
  el: '#app',
  router,
  render: h => h(App)
})

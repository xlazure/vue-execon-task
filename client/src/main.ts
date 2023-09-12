import './assets/main.scss'

import { createApp } from 'vue'
import App from './App.vue'
import { state, getters, mutations, actions } from './store/columnStore'

const app = createApp(App)

app.config.globalProperties.$store = {
  state,
  getters,
  mutations,
  actions
}

app.mount('#app')

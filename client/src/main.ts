import './assets/main.scss'
import { createApp, ref } from 'vue'
import App from './App.vue'
import { state, getters, mutations, actions } from './store/columnStore'

const app = createApp(App)

const fetchMethod = ref(true)

app.provide('fetchMethod', fetchMethod)

app.config.globalProperties.$store = {
  state,
  getters,
  mutations,
  actions
}

app.mount('#app')

import './assets/main.scss'
import { createApp, ref } from 'vue'
import App from './App.vue'

const app = createApp(App)

const fetchMethod = ref(true)

app.provide('fetchMethod', fetchMethod)

app.mount('#app')

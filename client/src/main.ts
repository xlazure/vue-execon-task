import './assets/main.scss'
import { createApp, ref, type Ref } from 'vue'
import App from './App.vue'

const app = createApp(App)

const fetchMethod: Ref<boolean> = ref(true)

app.provide('fetchMethod', fetchMethod)

app.mount('#app')

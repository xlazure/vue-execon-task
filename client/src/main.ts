import './assets/main.scss'
import { createApp, ref, type Ref } from 'vue'
import App from './App.vue'

const app = createApp(App)

const fetchMethod = ref<boolean | undefined>(true)
const columnFocus= ref<string | undefined>('')

app.provide('columnFocus',columnFocus)
app.provide('fetchMethod', fetchMethod)

app.mount('#app')

import './assets/main.css'

import { createApp, markRaw } from 'vue'
import { createPinia } from 'pinia'
import { Quasar, Notify, Screen } from 'quasar'
import axios from 'axios'

import '@quasar/extras/material-icons/material-icons.css'
import 'quasar/src/css/index.sass'

import App from './App.vue'
import router from './router'

const app = createApp(App)
app.use(Quasar, {
  plugins: { Notify, Screen }
})
// axios stuff
axios.defaults.baseURL = '/apis'
const catchFourZeroOnes = (r) => {
  // we catch 401s and make the user re-login
  if (import.meta.env.DEV) console.info('interceptor', r.status, import.meta.env)
  if (r.status === 401) {
    router.push({ name: 'login' })
  }
  // we let 405s pass through for testAuth without redirects
  return r
}
axios.interceptors.response.use(null, catchFourZeroOnes)
app.config.globalProperties.$axios = axios
// end of axios stuff

const pinia = createPinia() // this is needed to get router working in pinia 🤡🤡🤡
pinia.use(({ store }) => {
  store.router = markRaw(router)
})

app.use(pinia)
app.use(router)

app.mount('#app')


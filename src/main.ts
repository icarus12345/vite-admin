import { createApp } from 'vue'
import ViewUIPlus from 'view-ui-plus'
import App from './App.vue'
import router from './router'
import store from './store'

// import "bootstrap"
import './scss/index.scss'
import './styles/index.less'
import { i18n } from './locales/i18n';


const app = createApp(App)

app.use(router)
  .use(store)
  .use(i18n)
  .use(ViewUIPlus, {
    i18n
  })
  .mount('#app')

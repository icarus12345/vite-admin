import { createApp } from 'vue'
import ViewUIPlus from 'view-ui-plus'
import App from './App.vue'
import router from './router'
import store from './store'

// import "bootstrap"
import './styles/index.less'
import './scss/index.scss'
// import registerLayouts from './layouts/register'
// import './mock'

const app = createApp(App)
// registerLayouts(app)

app.use(router)
  .use(store)
  .use(ViewUIPlus, {

  })
  .mount('#app')

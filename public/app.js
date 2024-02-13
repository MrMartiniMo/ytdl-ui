const { createApp, defineAsyncComponent } = Vue
const { loadModule } = window['vue3-sfc-loader']

import feathersClient from './plugins/feathers-client.js'

const options = {
  moduleCache: {
    vue: Vue
  },
  async getFile(url) {
    return fetch(url).then((resp) => (resp.ok ? resp.text() : Promise.reject(resp)))
  },
  addStyle(styleStr) {
    const style = document.createElement('style')
    style.textContent = styleStr
    const ref = document.head.getElementsByTagName('style')[0] || null
    document.head.insertBefore(style, ref)
  },
  log(type, ...args) {
    console.log(type, ...args)
  }
}

const app = createApp({
  components: {
    App: defineAsyncComponent(() => loadModule('views/App.vue', options))
  }
})

app.use(feathersClient)

app.mount('#app')

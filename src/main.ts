import Vue from 'vue'
import App from './App.vue'
import VueCompositionApi from '@vue/composition-api'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import router from './router'
import {
  renderWithQiankun,
  qiankunWindow
} from 'vite-plugin-qiankun/dist/helper'

Vue.use(VueCompositionApi)
Vue.use(ElementUI)
// 如果您的router是ES模块默认导出的，确保这样使用它

function render(props: any = {}) {
  const { container } = props
  app = new Vue({
    router, // 正确传递 router 实例
    render: (h) => h(App)
  }).$mount(container ? container.querySelector('#app') : '#app')
}

let app: any

if (!qiankunWindow.__POWERED_BY_QIANKUN__) {
  render()
}
renderWithQiankun({
  mount(props: any) {
    console.log('Vue2 app mount')
    render(props)
  },
  bootstrap() {
    console.log('Vue2 app bootstrap')
  },
  unmount() {
    console.log('Vue2 app unmount')
    app.$destroy()
    app.$el.innerHTML = ''
    app = null
  },
  update() {
    console.log('Vue2 app update')
    // 在这里处理可能的更新逻辑
  }
})

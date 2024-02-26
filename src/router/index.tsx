import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'OpenEditor',
    // 使用动态 import 实现路由懒加载
    component: () => import('../views/EditorDialog.vue')
  },
  {
    path: '/detail',
    name: 'Detail',
    // 使用动态 import 实现路由懒加载
    component: () => import('../views/Detail.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: '/rich-editor', // 使用静态值替换 process.env.BASE_URL
  routes
})

export default router

import { defineConfig } from 'vite' // 动态配置函数
import { createVuePlugin } from 'vite-plugin-vue2'
import qiankun from 'vite-plugin-qiankun'
// import { dynamicBase } from 'vite-plugin-dynamic-base'

export default () =>
  defineConfig({
    base: '/rich-editor',
    server: {
      port: 1567, //端口号
      cors: true,
      origin: 'http://localhost:1567'
    },
    plugins: [
      createVuePlugin(),
      qiankun('rich-editor', {
        // 配置qiankun插件
        useDevMode: true
      })
    ],

    resolve: {
      // 别名
      alias: [
        {
          find: '@',
          replacement: '/src'
        }
      ]
    }
  })

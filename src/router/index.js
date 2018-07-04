import Vue from 'vue'
import Router from 'vue-router'
import Hello from '@/components/Hello'
import Draft from '@/components/Draft'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Hello',
      component: Hello
    },
    {
      path: '/draft',
      name: 'Draft',
      component: Draft
    }
  ]
})

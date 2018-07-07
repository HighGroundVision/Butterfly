import Vue from 'vue'
import Router from 'vue-router'
import Hello from '@/components/Hello'
import DraftStrength from '@/components/DraftStrength'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Hello',
      component: Hello
    },
    {
      path: '/draft/strength',
      name: 'DraftStrength',
      component: DraftStrength
    }
  ]
})

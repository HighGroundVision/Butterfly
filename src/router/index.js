import Vue from 'vue'
import Router from 'vue-router'
import Dashboard from '@/components/Dashboard'
import TeamStrength from '@/components/TeamStrength'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Dashboard',
      component: Dashboard
    },
    {
      path: '/TeamStrength',
      name: 'TeamStrength',
      component: TeamStrength
    }
  ]
})

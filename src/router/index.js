import Vue from 'vue'
import Router from 'vue-router'
import ENS from '@/components/ENS'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'ENS',
      component: ENS
    }
  ]
})

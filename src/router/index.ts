import { defineRouter } from '#q-app/wrappers'
import {
  createMemoryHistory,
  createRouter,
  createWebHashHistory,
  createWebHistory,
} from 'vue-router'
import routes from './routes'
import { jwtDecode } from 'jwt-decode'

export default defineRouter(function (/* { store, ssrContext } */) {
  const createHistory = process.env.SERVER
    ? createMemoryHistory
    : process.env.VUE_ROUTER_MODE === 'history'
      ? createWebHistory
      : createWebHashHistory

  const Router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes,
    history: createHistory(process.env.VUE_ROUTER_BASE),
  })

  Router.beforeEach((to, from, next) => {
    const token = localStorage.getItem('authToken')

    if (!token && to.meta.requiresAuth) {
      next('/login')
      return
    }

    if (token) {
      try {
        const decoded = jwtDecode<Record<string, unknown>>(token)

        const roleKey = Object.keys(decoded).find((key) => key.toLowerCase().includes('role'))

        const userRole = roleKey ? (decoded[roleKey] as string) : null

        if (to.meta.requiresAdmin && userRole !== 'Admin') {
          next('/unauthorized')
          return
        }
      } catch (err) {
        console.error('Token konnte nicht dekodiert werden:', err)
        localStorage.removeItem('authToken')
        next('/login')
        return
      }
    }

    next()
  })

  return Router
})

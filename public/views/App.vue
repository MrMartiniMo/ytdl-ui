<template>
  <div
    v-if="currentRoute"
    id="ytdl-app-view"
    class="drawer"
    :data-theme="store.theme ? store.theme : 'dracula'"
  >
    <input id="my-drawer-3" type="checkbox" class="drawer-toggle" />
    <div class="drawer-content flex flex-col h-screen overflow-y-auto">
      <!-- Navbar -->
      <NavBar v-if="store.isAuthenticated" />
      <!-- Page content here -->
      <div class="flex justify-center px-4 pb-8" :class="{ 'pt-24': store.isAuthenticated }">
        <component :is="currentView" class="container mx-auto" />
      </div>
    </div>
    <div class="drawer-side">
      <label for="my-drawer-3" aria-label="close sidebar" class="drawer-overlay"></label>
      <ul class="menu p-4 w-80 min-h-full bg-base-200">
        <!-- Sidebar content here -->
        <NavItems />
      </ul>
    </div>
  </div>
</template>

<script>
import { store } from './../store.mjs'

import NavBar from 'components/NavBar.vue'
import NavItems from 'components/NavItems.vue'

import ViewAddJob from 'views/AddJob.vue'
import ViewDownloads from 'views/Downloads.vue'
import ViewLogin from 'views/Login.vue'
import ViewLoginCreate from 'views/LoginCreate.vue'
import ViewLoginUpdate from 'views/LoginUpdate.vue'
import ViewNotFound from 'views/NotFound.vue'

const routes = {
  downloads: {
    path: '/',
    view: ViewDownloads,
    authenticated: true
  },
  'downloads-add': {
    path: '/add',
    view: ViewAddJob,
    authenticated: true
  },
  login: {
    path: '/login',
    view: ViewLogin
  },
  loginCreate: {
    path: '/login/create',
    view: ViewLoginCreate
  },
  loginUpdate: {
    path: '/login/update',
    view: ViewLoginUpdate,
    authenticated: true
  },
  404: {
    path: '/404',
    view: ViewNotFound
  }
}

export default {
  components: {
    NavBar,
    NavItems
  },
  data() {
    return {
      store,
      // isAuthenticated: false,
      currentRoute: null
    }
  },
  computed: {
    currentView() {
      return this.currentRoute.view
    }
  },
  async mounted() {
    window.addEventListener('hashchange', async () => {
      await this.updateRoute()
    })

    this.$feathers.on('logout', async () => {
      this.store.isAuthenticated = false
      this.store.user = null
      this.store.theme = 'dracula'
      this.store.forceAuthenticate = true
      await this.updateRoute()
    })

    await this.updateRoute()
  },
  methods: {
    async getCurrentRoute() {
      const routeNames = Object.keys(routes)
      let currentPath = window.location.hash.slice(1) || '/'

      if (currentPath === '/logout') {
        try {
          await this.$feathers.logout()
          return routes.login
        } catch (e) {}
      }

      // check if authenticated
      try {
        const authResult = await this.$feathers.reAuthenticate(this.store.forceAuthenticate)
        this.store.forceAuthenticate = false
        this.store.isAuthenticated = true
        this.store.user = authResult.user
        this.store.theme = authResult.user.theme
      } catch (e) {
        console.error('Not authenticated')
      }

      for (const routeName of routeNames) {
        const route = routes[routeName]
        if (route.path === currentPath) {
          if (route.authenticated && !this.store.isAuthenticated) {
            return routes.login
          }
          return route
        }
      }

      return routes[404]
    },
    async updateRoute() {
      this.currentRoute = await this.getCurrentRoute()
    }
  }
}
</script>

<style></style>

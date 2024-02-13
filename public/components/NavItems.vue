<template>
  <li><a href="#/">Downloads</a></li>
  <li v-if="store.isAuthenticated">
    <a href="#/login/update">
      {{ store.user.username }}
    </a>
  </li>
  <li v-if="store.isAuthenticated"><a href="#/logout">Logout</a></li>
  <li v-if="!store.isAuthenticated"><a href="#/login">Login</a></li>
</template>

<script>
import { store } from './../store.mjs'
import Icon from './Icon.vue'

export default {
  data() {
    return {
      store
    }
  },
  components: { Icon }
}
</script>

<script></script>

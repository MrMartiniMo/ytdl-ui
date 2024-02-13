<template>
  <span class="ytdl-icon"><component :is="name" /></span>
</template>

<script>
import Add from 'components/icons/add.vue'
import AlertError from 'components/icons/alert-error.vue'
import AlertInfo from 'components/icons/alert-info.vue'
import AlertSuccess from 'components/icons/alert-success.vue'
import AlertWarning from 'components/icons/alert-warning.vue'
import ArrowDown from 'components/icons/arrow-down.vue'
import ArrowUp from 'components/icons/arrow-up.vue'
import CleanUp from 'components/icons/clean-up.vue'
import Dice from 'components/icons/dice.vue'
import Info from 'components/icons/info.vue'
import Play from 'components/icons/play.vue'
import Reload from 'components/icons/reload.vue'
import Remove from 'components/icons/remove.vue'
import Stop from 'components/icons/stop.vue'
import User from 'components/icons/user.vue'

export default {
  components: {
    Add,
    AlertError,
    AlertInfo,
    AlertSuccess,
    AlertWarning,
    ArrowDown,
    ArrowUp,
    CleanUp,
    Dice,
    Info,
    Play,
    Reload,
    Remove,
    Stop,
    User
  },
  props: {
    name: {
      name: String,
      required: true
    }
  },
  computed: {
    icon() {
      return this.name
    }
  }
}
</script>

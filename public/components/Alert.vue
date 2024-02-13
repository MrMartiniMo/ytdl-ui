<template>
  <div v-if="show" role="alert" class="alert" :class="`alert-${type}`">
    <Icon :name="`Alert${this.type.charAt(0).toUpperCase() + this.type.slice(1)}`" />
    <span>{{ message }}</span>
  </div>
</template>

<script>
import Icon from 'components/Icon.vue'

export default {
  components: {
    Icon
  },
  props: {
    message: {
      type: String,
      required: true
    },
    show: {
      type: Boolean,
      default: true
    },
    type: {
      type: String,
      default: 'info',
      validator(value, _props) {
        return ['info', 'success', 'warning', 'error'].includes(value)
      }
    }
  }
}
</script>

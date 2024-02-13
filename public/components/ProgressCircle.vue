<template>
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="h-6 w-6 text-error" fill="none">
    <circle opacity="0.5" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="1.5"></circle>
    <circle
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      stroke-width="3"
      class="-rotate-90 origin-center"
      :class="{ 'animate-spin': isUndefined }"
      :stroke-dasharray="`${angle},63`"
    ></circle>
    <path
      d="M14.5 8H9.5C8.67157 8 8 8.67157 8 9.5V14.5C8 15.3284 8.67157 16 9.5 16H14.5C15.3284 16 16 15.3284 16 14.5V9.5C16 8.67157 15.3284 8 14.5 8Z"
      fill="currentColor"
    ></path>
  </svg>
</template>

<script>
export default {
  props: {
    progress: {
      type: Number,
      default: 0
    }
  },
  computed: {
    isUndefined() {
      return this.progress === null || this.progress === undefined
    },
    angle() {
      if (this.isUndefined) {
        return 25
      }
      return (this.progress * 63) / 100
    }
  }
}
</script>

<template>
  <label class="form-control w-full max-w-full">
    <div class="label">
      <span class="label-text">Theme</span>
    </div>
    <div class="flex items-center">
      <select
        class="grow select select-bordered"
        :value="modelValue"
        @input="$emit('update:modelValue', $event.target.value)"
      >
        <option disabled>Pick theme</option>
        <option v-for="theme in themes">{{ theme }}</option>
      </select>
      <div class="shrink flex flex-col">
        <Icon name="ArrowUp" class="btn btn-ghost btn-circle btn-xs" @click="themeUp" />
        <Icon name="ArrowDown" class="btn btn-ghost btn-circle btn-xs" @click="themeDown" />
      </div>
      <Icon name="Dice" class="btn btn-ghost btn-circle btn-sm" @click="themeRnd" />
    </div>
  </label>
</template>

<script>
import Icon from 'components/Icon.vue'

export default {
  components: {
    Icon
  },
  props: {
    modelValue: {
      type: String,
      default: ''
    }
  },
  emits: ['update:modelValue'],
  data() {
    return {
      themes: [
        'light',
        'dark',
        'cupcake',
        'bumblebee',
        'emerald',
        'corporate',
        'synthwave',
        'retro',
        'cyberpunk',
        'valentine',
        'halloween',
        'garden',
        'forest',
        'aqua',
        'lofi',
        'pastel',
        'fantasy',
        'wireframe',
        'black',
        'luxury',
        'dracula'
      ]
    }
  },
  methods: {
    themeUp() {
      let selectedTheme = this.modelValue
      const index = this.themes.indexOf(selectedTheme)

      if (index === -1) {
        selectedTheme = this.themes[0]
      } else {
        selectedTheme = this.themes[(index - 1 + this.themes.length) % this.themes.length]
      }

      this.$emit('update:modelValue', selectedTheme)
    },
    themeDown() {
      let selectedTheme = this.modelValue
      const index = this.themes.indexOf(selectedTheme)

      if (index === -1) {
        selectedTheme = this.themes[0]
      } else {
        selectedTheme = this.themes[(index + 1) % this.themes.length]
      }

      this.$emit('update:modelValue', selectedTheme)
    },
    themeRnd() {
      this.$emit('update:modelValue', this.themes[Math.floor(Math.random() * this.themes.length)])
    }
  }
}
</script>

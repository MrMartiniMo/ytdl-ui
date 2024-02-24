<template>
  <label class="form-control w-full max-w-full">
    <div class="label">
      <span class="label-text">{{ label }}</span>
    </div>
    <div :class="{ join: isJoinGroupUsed }">
      <div
        class="input input-bordered grow flex items-center gap-2"
        :class="{
          'join-item': isJoinGroupUsed
        }"
      >
        <input
          :type="type"
          :name="name"
          class="grow"
          :value="modelValue"
          @input="!disabled ? $emit('update:modelValue', $event.target.value) : disabled"
          :disabled="disabled || (loading && blockedLoading)"
        />
        <span v-if="loading" class="loading loading-spinner loading-xs"></span>
      </div>
      <slot name="join-group"></slot>
    </div>
    <div v-if="description && description.length > 0" class="label">
      <span class="label-text-alt">{{ description }}</span>
    </div>
  </label>
</template>

<script>
export default {
  data() {
    return {
      content: ''
    }
  },
  props: {
    label: {
      type: String,
      default: ''
    },
    description: {
      type: String,
      default: ''
    },
    type: {
      type: String,
      default: 'text'
    },
    name: {
      type: String,
      default: ''
    },
    disabled: {
      type: Boolean,
      default: false
    },
    loading: {
      type: Boolean,
      default: false
    },
    blockedLoading: {
      type: Boolean,
      default: false
    },
    modelValue: {
      type: String,
      default: ''
    }
  },
  emits: ['update:modelValue'],
  computed: {
    isJoinGroupUsed() {
      return !!this.$slots['join-group']
    }
  },
  mounted() {},
  methods: {}
}
</script>

<style></style>

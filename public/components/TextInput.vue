<template>
  <label class="form-control w-full max-w-full">
    <div class="label">
      <span class="label-text">{{ label }}</span>
    </div>
    <input
      :type="type"
      :name="name"
      class="input input-bordered w-full max-w-full"
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
      :disabled="disabled"
    />
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
    modelValue: {
      type: String,
      default: ''
    }
  },
  emits: ['update:modelValue'],
  methods: {}
}
</script>

<style></style>

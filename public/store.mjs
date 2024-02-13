const { reactive } = Vue

export const store = reactive({
  isAuthenticated: false,
  theme: 'dracula',
  user: null
})

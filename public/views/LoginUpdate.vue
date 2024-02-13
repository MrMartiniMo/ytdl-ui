<template>
  <div id="ytdl-install-view">
    <h2>Account</h2>

    <Alert type="success" :message="success" :show="success.length" />
    <Alert type="error" :message="error" :show="error.length" />

    <form method="post" v-on:submit.prevent="doUpdateLogin" autocomplete="on">
      <TextInput label="Username" name="username" type="text" disabled v-model="username" />
      <TextInput label="Password" name="password" type="password" v-model="password" />
      <TextInput label="Password Repeat" name="password2" type="password" v-model="password2" />

      <ThemeSelect v-model="theme" />

      <div class="flex justify-end gap-2 mt-3">
        <button class="btn" type="submit">Save</button>
      </div>
    </form>
  </div>
</template>

<script>
import { store } from './../store.mjs'

import Alert from 'components/Alert.vue'
import TextInput from 'components/TextInput.vue'
import ThemeSelect from 'components/ThemeSelect.vue'

export default {
  components: {
    Alert,
    TextInput,
    ThemeSelect
  },
  data() {
    return {
      store,
      username: store.user?.username,
      password: '',
      password2: '',
      theme: '',
      success: '',
      error: ''
    }
  },
  props: {},
  watch: {
    theme: function (newTheme) {
      this.store.theme = newTheme
    }
  },
  mounted() {
    this.theme = this.store.theme
  },
  methods: {
    doUpdateLogin: async function () {
      this.success = ''
      this.error = ''

      if (this.password !== this.password2) {
        this.error = 'Passwords do not match!'
        return
      }

      let patchData = {
        theme: this.theme
      }

      if (this.password.length > 0) {
        patchData.password = this.password
      }

      try {
        await this.$feathers.service('users').patch(this.store.user.id, patchData)
        this.store.forceAuthenticate = true
        this.success = 'User updated!'
      } catch (e) {
        this.error = e.message
        console.error('Error updating login!', e)
      }
    }
  }
}
</script>

<style></style>

<template>
  <div id="ytdl-install-view" class="flex flex-col h-screen justify-center items-center">
    <h2 class="text-5xl font-bold my-4">Create Login</h2>

    <div class="card w-96 shadow-xl bg-base-200">
      <form method="post" v-on:submit.prevent="doCreateLogin" autocomplete="on">
        <div class="card-body">
          <Alert type="error" :message="error" :show="error.length" />

          <TextInput label="Username" name="username" v-model="username" />
          <TextInput label="Password" name="password" type="password" v-model="password" />
          <TextInput label="Password Repeat" name="password2" type="password" v-model="password2" />

          <ThemeSelect v-model="theme" />

          <div class="card-actions justify-between gap-2 mt-3">
            <a href="/#/login" class="btn btn-link">Back</a>
            <button class="btn" type="submit">Create Login</button>
          </div>
        </div>
      </form>
    </div>
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
      username: '',
      password: '',
      password2: '',
      theme: '',
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
    doCreateLogin: async function () {
      this.error = ''

      if (this.password !== this.password2) {
        this.error = 'Passwords do not match!'
        return
      }

      try {
        await this.$feathers.service('users').create({
          username: this.username,
          password: this.password,
          theme: this.theme
        })
        await this.$feathers.authenticate({
          strategy: 'local',
          username: this.username,
          password: this.password
        })
        window.location.hash = '#/'
      } catch (e) {
        this.error = e.message
        console.error('Error creating login!', e)
      }
    }
  }
}
</script>

<style></style>

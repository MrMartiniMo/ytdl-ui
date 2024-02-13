<template>
  <div id="ytdl-login-view" class="flex flex-col h-screen justify-center items-center">
    <h2 class="text-5xl font-bold my-4">Login</h2>

    <div class="card w-96 shadow-xl bg-base-200">
      <form method="post" v-on:submit.prevent="doLogin" autocomplete="on">
        <div class="card-body">
          <Alert type="error" :message="error" :show="error.length" />

          <TextInput label="Username" name="username" v-model="username" />
          <TextInput label="Password" name="password" type="password" v-model="password" />

          <div class="card-actions justify-between gap-2 mt-3">
            <a href="/#/login/create" class="btn btn-link">Create new Login</a>
            <button class="btn" type="submit">Login</button>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import Alert from 'components/Alert.vue'
import TextInput from 'components/TextInput.vue'

export default {
  components: {
    Alert,
    TextInput
  },
  data() {
    return {
      username: '',
      password: '',
      error: ''
    }
  },
  props: {},
  methods: {
    doLogin: async function () {
      this.error = ''

      try {
        await this.$feathers.authenticate({
          strategy: 'local',
          username: this.username,
          password: this.password
        })
        window.location.hash = '#/'
      } catch (e) {
        this.error = e.message
        console.error('Error authenticating!', e)
      }
    }
  },
  mounted() {}
}
</script>

<style></style>

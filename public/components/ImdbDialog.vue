<template>
  <div class="modal" :class="{ 'modal-open': show }" role="dialog">
    <div class="modal-box">
      <h3 class="font-bold text-lg">IMDb Lookup</h3>

      <TextInput
        label="Name"
        class="mb-2"
        name="search"
        :loading="loading"
        v-model.trim="name"
        @input="doImdbSearch"
      />

      <div class="join mb-4">
        <input
          class="join-item btn btn-sm"
          type="radio"
          name="type"
          value="all"
          aria-label="All"
          v-model="type"
          @input="doImdbSearch"
        />
        <input
          class="join-item btn btn-sm"
          type="radio"
          name="type"
          value="movie"
          aria-label="Movies"
          v-model="type"
          @input="doImdbSearch"
        />
        <input
          class="join-item btn btn-sm"
          type="radio"
          name="type"
          value="series"
          aria-label="Shows"
          v-model="type"
          @input="doImdbSearch"
        />
      </div>

      <Alert type="error" :message="error" :show="error.length" />

      <div v-if="imdbResult">
        <h4 class="font-bold">Result</h4>
        <a class="card card-side bg-base-300" target="_blank" :href="imdbResult.url">
          <figure v-if="imdbResult?.image?.src" class="max-w-24">
            <img :src="imdbResult.image.src" class="h-full w-full" alt="" />
          </figure>
          <div class="card-body p-4">
            <ul>
              <li v-for="meta in imdbResult.meta">
                <strong>{{ meta.key }}:&nbsp;</strong>
                <span>{{ meta.value }}</span>
              </li>
            </ul>
          </div>
        </a>

        <TextInput
          label="Suggested Filename"
          name="suggested-filename"
          v-model="imdbResult.suggestedFilename"
          disabled
        />
      </div>

      <div class="modal-action mt-4">
        <button
          class="btn btn-primary"
          :disabled="!imdbResult"
          type="button"
          @click="closeDialog(imdbResult.suggestedFilename)"
        >
          Use Filename
        </button>
        <button class="btn" type="button" @click="closeDialog">Close</button>
      </div>
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
  props: {
    show: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      name: '',
      type: 'all',
      loading: false,
      imdbResult: false,

      error: ''
    }
  },
  emits: ['update:show'],
  watch: {
    name() {
      this.loading = this.name.length > 0
      this.error = ''
      this.imdbResult = false
    },
    type() {
      this.loading = this.name.length > 0
      this.error = ''
      this.imdbResult = false
    }
  },
  mounted() {
    this.doImdbSearch = this.$utils.debounce(() => {
      this._doImdbSearch()
    }, 1000)
  },
  methods: {
    async _doImdbSearch() {
      if (this.name.length > 0) {
        try {
          const imdb = await this.$feathers.service('ytdl/imdb').find({
            query: {
              name: this.name,
              type: this.type
            }
          })

          if (imdb.error) {
            throw new Error(imdb.error)
          }

          this.imdbResult = imdb
        } catch (e) {
          this.error = e.message
        }
      }

      this.loading = false
    },
    closeDialog(suggestedFilename) {
      if (suggestedFilename && suggestedFilename.length > 0) {
        this.$emit('filename', suggestedFilename)
      }

      this.name = ''
      this.loading = false
      this.error = ''
      this.imdbResult = false

      this.$emit('update:show', false)
    }
  }
}
</script>

<style></style>

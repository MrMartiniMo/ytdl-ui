<template>
  <div id="ytdl-add-job-view">
    <h2>Add Job</h2>

    <Alert type="error" :message="error" :show="error.length" />

    <form method="post" v-on:submit.prevent="addJob" autocomplete="on">
      <TextInput label="URL" name="url" v-model="url" :disabled="loadingFormats" />
      <TextInput label="Filename" name="filename" v-model="filename" :disabled="loadingFormats">
        <template #join-group>
          <button
            class="btn join-item ytdl-btn-imdb"
            type="button"
            title="IMDb lookup"
            @click="showIMDbModal = true"
          >
            IMDb
          </button>
        </template>
      </TextInput>
      <TextInput
        label="Additional Params"
        name="additional-params"
        v-model="moreParams"
        :disabled="loadingFormats"
      />
      <TextInput label="Params" name="params" v-model="params" disabled />

      <div class="flex gap-2 my-2">
        <button
          type="button"
          class="btn btn-xs btn-outline btn-info"
          :disabled="loadingFormats || url.length === 0"
          @click="getFormats"
        >
          <span v-if="loadingFormats" class="loading loading-spinner loading-xs"></span>
          Get formats
        </button>
      </div>

      <div v-if="formatsLoaded" class="collapse collapse-arrow border border-base-300 bg-base-200">
        <input type="checkbox" :checked="formatsLoaded" />
        <div class="collapse-title text-xl font-medium">Formats</div>
        <div class="collapse-content">
          <div v-if="Object.keys(formats).length === 0">No formats found</div>
          <div v-else>
            <VideoFormats :formats="formats" type="Formats" v-model="selectedFormats" />
          </div>
        </div>
      </div>

      <div class="flex justify-end gap-2 mt-3">
        <button class="btn" type="submit" :disabled="disabled">Add Job</button>
        <button class="btn" type="reset" @click="goBackToDownloads">Cancel</button>
      </div>
    </form>

    <ImdbDialog
      :show="showIMDbModal"
      @filename="(suggestedFilename) => (filename = suggestedFilename)"
      v-model:show="showIMDbModal"
    />
  </div>
</template>

<script>
import Alert from 'components/Alert.vue'
import TextInput from 'components/TextInput.vue'
import VideoFormats from 'components/VideoFormats.vue'
import ImdbDialog from '../components/ImdbDialog.vue'

export default {
  components: {
    Alert,
    TextInput,
    VideoFormats,
    ImdbDialog
  },
  props: {},
  data() {
    return {
      url: '',
      filename: '',
      params: '',
      moreParams: '',
      error: '',

      formats: [],
      loadingFormats: false,
      formatsLoaded: false,
      selectedFormats: [],

      showIMDbModal: false
    }
  },
  computed: {
    disabled() {
      return this.url.length === 0 || this.filename.length === 0
    }
  },
  watch: {
    url() {
      this.formats = []
      this.loadingFormats = false
      this.formatsLoaded = false
      this.selectedFormats = []
    },
    moreParams() {
      this.updateParams()
    },
    selectedFormats() {
      this.updateParams()
    },
    filename() {
      this.updateParams()
    }
  },
  setup() {},
  mounted() {
    this.updateParams()
  },
  methods: {
    async addJob() {
      if (this.url.length === 0 || this.filename.length === 0) {
        this.error = 'URL and filename are required'
        return
      }

      try {
        await this.$feathers.service('jobs').create({
          url: this.url,
          filename: this.filename,
          params: this.params,
          status: 'open'
        })

        this.goBackToDownloads()
      } catch (e) {
        this.error = e.message
      }
    },
    async getFormats() {
      this.error = ''
      this.loadingFormats = true
      this.formatsLoaded = false
      this.selectedFormats = []

      try {
        const formats = await this.$feathers.service('ytdl/info').find({
          query: {
            url: this.url
          }
        })

        if (formats.error) {
          throw new Error(formats.error)
        }

        this.formats = formats
      } catch (e) {
        this.error = e.message
      }

      this.loadingFormats = false
      this.formatsLoaded = true

      this.updateParams()
    },
    updateParams() {
      this.params = `${this.updateParamsSelectedFormat()} ${this.updateParamsFilename()} ${this.moreParams}`
    },
    updateParamsSelectedFormat() {
      let format = 'bestvideo+bestaudio'

      if (this.selectedFormats && this.selectedFormats.length > 0) {
        format = this.selectedFormats.map((format) => format.id.replace(/"/g, '\\"')).join('+')
      }

      return `-f "${format}"`
    },
    updateParamsFilename() {
      if (this.filename.length > 0) {
        return `-o "${this.filename.replace(/"/g, '\\"')}"`
      }

      return ''
    },
    resetForm() {
      this.url = ''
      this.filename = ''
      this.params = ''
      this.moreParams = ''
      this.error = ''
      this.formats = []
      this.loadingFormats = false
      this.formatsLoaded = false
      this.selectedFormats = []
    },
    goBackToDownloads() {
      this.resetForm()
      window.location.hash = '#/'
    }
  }
}
</script>

<style>
.ytdl-btn-imdb {
  background-color: #f5c518;
  color: #000;

  &:hover {
    background-color: color-mix(in oklab, #f5c518 90%, black);
    border-color: color-mix(in oklab, #f5c518 90%, black);
  }
}
</style>

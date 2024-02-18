<template>
  <div v-if="formats && formats.length > 0" class="ytdl-video-formats">
    <div class="bg-neutral rounded-lg mb-2 px-2 py-2 flex gap-2">
      <span class="font-bold">Filter</span>
      <select class="select select-bordered select-xs w-full max-w-fit" v-model="selectedExtensions">
        <option disabled selected value="">Fileformat</option>
        <option value="all">all</option>
        <option v-for="ext in availableFileExtensions">{{ ext }}</option>
      </select>
      <select class="select select-bordered select-xs w-full max-w-fit" v-model="selectedVideoAndAudio">
        <option disabled selected value="">Video & Audio</option>
        <option value="all">all</option>
        <option value="video only">video only</option>
        <option value="audio only">audio only</option>
        <option value="video and audio">audio and video only</option>
      </select>
      <button class="btn btn-xs btn-circle btn-ghost ml-auto" type="button" @click="clearFilter">✕</button>
    </div>
    <table class="table table-xs table-pin-rows">
      <colgroup>
        <col class="w-px" />
        <col />
        <col />
      </colgroup>
      <thead>
        <tr>
          <th class="w-min"></th>
          <th>ID</th>
          <th>Extension</th>
          <th>Resolution</th>
          <th>Size</th>
          <th>Vcodec</th>
          <th>Acodec</th>
          <th>Note</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="format in filteredFormats">
          <td>
            <label>
              <input
                type="checkbox"
                class="checkbox"
                :id="`format-${format.id}`"
                :value="format"
                v-model="model"
              />
            </label>
          </td>
          <td>{{ format.id }}</td>
          <td>{{ format.ext }}</td>
          <td>{{ format.resolution }}</td>
          <td>{{ format.formatted_size }}</td>
          <td>{{ format.vcodec }}</td>
          <td>{{ format.acodec }}</td>
          <td>{{ format.note }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  props: {
    formats: {
      type: Array,
      required: true
    },
    value: {
      type: Array,
      required: true
    }
  },
  emits: ['update:modelValue'],
  data: function () {
    return {
      model: [],
      selectedExtensions: '',
      selectedVideoAndAudio: ''
    }
  },
  computed: {
    availableFileExtensions() {
      const extensions = this.formats.map((format) => format.ext.trim())
      return [...new Set(extensions)]
    },
    filteredFormats() {
      return this.formats.filter((format) => {
        let filter = true

        if (
          this.selectedExtensions &&
          typeof this.selectedExtensions === 'string' &&
          this.selectedExtensions !== 'all' &&
          this.selectedExtensions !== format.ext.trim()
        ) {
          filter = false
        }

        if (this.selectedVideoAndAudio === 'audio only' && format.vcodec !== 'audio only') {
          filter = false
        } else if (this.selectedVideoAndAudio === 'video only' && format.acodec !== 'video only') {
          filter = false
        } else if (
          this.selectedVideoAndAudio === 'video and audio' &&
          (format.vcodec === 'audio only' || format.acodec === 'video only')
        ) {
          filter = false
        }

        return filter
      })
    }
  },
  watch: {
    formats: function () {
      this.clearFilter()
    },
    model: function (val) {
      this.$emit('update:modelValue', val)
    }
  },
  methods: {
    clearFilter() {
      this.selectedExtensions = ''
      this.selectedVideoAndAudio = ''
    }
  }
}
</script>

<style></style>

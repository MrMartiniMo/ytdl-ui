<template>
  <div id="ytdl-downloads-view">
    <h2>Downloads</h2>

    <Alert type="error" :message="error" :show="error.length" />

    <table class="table table-zebra mb-4 whitespace-nowrap table-auto">
      <!-- head -->
      <thead>
        <tr>
          <th class="w-px"></th>
          <th class="w-px text-right">#</th>
          <th>Filename</th>
          <th class="w-px">Status</th>
          <th class="w-48">Progress</th>
          <th class="w-px">Remaining</th>
          <th class="w-px"></th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="loading">
          <td colspan="7" class="text-center">
            <span class="loading loading-spinner loading-lg"></span>
          </td>
        </tr>
        <tr v-else-if="jobs.length === 0" class="text-center">
          <td colspan="7">No downloads ...</td>
        </tr>
        <tr v-else v-for="(job, index) in filteredJobs">
          <th>
            <button
              v-if="!['starting', 'downloading'].includes(job.status)"
              class="btn btn-sm btn-ghost text-success btn-circle"
              @click="startJob(job)"
              title="Start Job"
            >
              <Icon name="Play" />
            </button>
            <button
              v-else-if="['starting', 'downloading'].includes(job.status)"
              class="btn btn-sm btn-ghost text-error btn-circle"
              @click="stopJob(job)"
              title="Stop Job"
            >
              <!-- <Icon name="Stop" /> -->
              <ProgressCircle :progress="job.progress" />
            </button>
            <button
              v-if="!['starting', 'downloading'].includes(job.status)"
              class="btn btn-sm btn-ghost text-error btn-circle"
              @click="removeJob(job)"
              title="Remove Job"
            >
              <Icon name="Remove" />
            </button>
          </th>
          <td class="text-right">{{ index + 1 }}</td>
          <td class="truncate max-w-64" :title="job.filename">
            {{ job.filename }}
          </td>

          <td>{{ job.status }}</td>
          <td>
            <progress
              class="progress progress-secondary"
              :class="{
                'progress-success': job.status === 'done',
                'progress-error': job.status === 'failed'
              }"
              :value="
                job.status === 'downloading'
                  ? job.progress
                  : job.status === 'done' || job.status === 'failed'
                    ? 100
                    : 0
              "
              max="100"
            ></progress>
          </td>

          <td>{{ job.eta && job.status === 'downloading' ? job.eta : '-' }}</td>

          <td>
            <div class="tooltip whitespace-break-spaces tooltip-left" :data-tip="job.params">
              <Icon name="Info" class="text-info cursor-pointer" />
            </div>
          </td>
        </tr>
      </tbody>
    </table>
    <div class="flex gap-2">
      <a class="btn" href="#/add"><Icon name="Add" /> Add</a>
      <a class="btn" @click="getJobs"><Icon name="Reload" /> Reload</a>
      <a class="btn ml-auto" @click="cleanupJobs"><Icon name="CleanUp" /> Clean Up</a>
    </div>
  </div>
</template>

<script>
import Alert from 'components/Alert.vue'
import Icon from 'components/Icon.vue'
import ProgressCircle from 'components/ProgressCircle.vue'

export default {
  components: {
    Alert,
    Icon,
    ProgressCircle
  },
  data() {
    return {
      jobs: [],
      loading: false,
      error: ''
    }
  },
  props: {},
  computed: {
    filteredJobs() {
      return this.jobs.sort((a, b) => a.id - b.id)
    }
  },
  async mounted() {
    this.$feathers
      .service('jobs')
      .on('patched', async (job) => {
        const index = this.jobs.findIndex((j) => j.id === job.id)
        if (index === -1) {
          await this.getJobs()
        } else {
          this.jobs[index].status = job.status
        }
      })
      .on('ytdl:progress', (data) => {
        const index = this.jobs.findIndex((j) => j.id === data.id)
        if (index !== -1) {
          this.jobs[index].size = data.total
          this.jobs[index].progress = data.progress
          this.jobs[index].eta = data.eta
        }
      })

    await this.getJobs()
  },
  methods: {
    async getJobs() {
      this.error = ''
      this.loading = true
      this.jobs = []

      try {
        const jobs = await this.$feathers.service('jobs').find({
          query: {
            $limit: 999999
          }
        })
        for (const job of jobs.data) {
          this.jobs.push({
            id: job.id,
            url: job.url,
            params: job.params,
            filename: job.filename,
            status: job.status,
            progress: job.progress ? job.progress : 0,
            size: job.size,
            time: job.time
          })
        }
      } catch (error) {
        this.error = error.message
        console.error('getJobs', error)
      }

      this.loading = false
    },

    async startJob(job) {
      try {
        await this.$feathers.service('jobs').patch(job.id, { status: 'starting' })
      } catch (error) {
        this.error = error.message
        console.error('startJob', error)
      }
    },

    async stopJob(job) {
      if (confirm('Are you sure you want to stop this job?')) {
        try {
          await this.$feathers.service('jobs').patch(job.id, { status: 'stopped' })
        } catch (error) {
          this.error = error.message
          console.error('stopJob', error)
        }
      }
    },

    async removeJob(job) {
      if (confirm('Are you sure you want to remove this job?')) {
        try {
          await this.$feathers.service('jobs').remove(job.id)
          this.jobs = this.jobs.filter((j) => j.id !== job.id)
        } catch (error) {
          this.error = error.message
          console.error('removeJob', error)
        }
      }
    },

    async cleanupJobs() {
      if (confirm('Are you sure you want to cleanup all jobs?')) {
        // Cleanup done jobs
        try {
          await this.$feathers.service('jobs').remove(null, { query: { status: 'done' } })
          await this.getJobs()
        } catch (error) {
          this.error = error.message
          console.error('cleanupJobs', error)
        }
      }
    }
  }
}
</script>

<style></style>

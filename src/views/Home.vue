<template lang="pug">
  .home
    v-data-table(:headers="headers" :items="comments" hide-actions)
      template(v-slot:items="props")
        td {{props.item.number}}
        td {{props.item.comment}}
    #bottom

</template>

<script lang="ts">
  import {Component, Vue} from 'vue-property-decorator'
  import {ipcRenderer} from 'electron'

  type header = { text: keyof CommentData, value: keyof CommentData }

  @Component
  export default class Home extends Vue {
    private comments: CommentData[] = []
    private isScroll = true

    private headers: header[] = [
      {
        text: 'number', value: 'number', sortable: false
      },
      {
        text: 'comment', value: 'comment', sortable: false
      },
    ]

    private mounted() {
      window.addEventListener('scroll', () => {
        // this.isScroll = false
      })
      ipcRenderer.on('receiveComment', (event: Electron.Event, comments: CommentData[]) => {
        this.comments = comments
        this.$nextTick(async () => {
          if (this.isScroll) {
            await this.$vuetify.goTo(Number.MAX_SAFE_INTEGER)
          }
        })
      })

      setInterval(() => {
        ipcRenderer.send('fetchComment')
      }, 100)
    }
  }
</script>

<style scoped lang="stylus">

</style>
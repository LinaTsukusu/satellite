<template lang="pug">
  .home
    v-data-table#comments(
      :headers="headers"
      :items="comments"
      height="99vh"
      fixed-header
      hide-default-footer
      disable-pagination)
      template(#items="props")
        td {{props.item.number}}
        td {{props.item.comment}}

</template>

<script lang="ts">
  import {Component, Vue} from 'vue-property-decorator'
  import {ipcRenderer} from 'electron'

  type header = { text: keyof CommentData, value: keyof CommentData, sortable: boolean }

  @Component
  export default class Home extends Vue {
    public comments: CommentData[] = []
    public headers: header[] = [
      {
        text: 'number', value: 'number', sortable: false,
      },
      {
        text: 'comment', value: 'comment', sortable: false,
      },
    ]

    private isScroll = true

    public mounted() {
      const obj = document.getElementById('comments')!.children[0]

      obj.addEventListener('wheel', (event: Event) => {
        const target = (event.target as Element).parentElement!
        if (this.isScroll && (event as WheelEvent).deltaY > 0) {
          this.isScroll = false
        } else if (target.scrollHeight - target.scrollTop === target.clientHeight) {
          console.log('scrolled')
        }
      })

      ipcRenderer.on('receiveComment', (_: Electron.Event, comments: CommentData[]) => {
        this.comments = comments
        // if (this.isScroll) {
        //
        // }
      })

      setInterval(() => {
        ipcRenderer.send('fetchComment')
      }, 100)
    }
  }
</script>

<style lang="stylus" scoped>

</style>

<template lang="pug">
  .home
    v-data-table#comments(:headers="headers" :items="comments" hide-actions)
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
    private comments: CommentData[] = []
    private isScroll = true

    private headers: header[] = [
      {
        text: 'number', value: 'number', sortable: false,
      },
      {
        text: 'comment', value: 'comment', sortable: false,
      },
    ]

    private mounted() {
      const obj = document.getElementById('comments')!.children[0]

      obj.addEventListener('wheel', (event: any) => {
        console.log(event)
        if (this.isScroll && event.wheelDelta > 0) {
          this.isScroll = false
        }
      })
      ipcRenderer.on('receiveComment', (event: Electron.Event, comments: CommentData[]) => {
        this.comments = comments
        if (this.isScroll) {
          obj.scrollTop = obj.scrollHeight
        }
      })

      setInterval(() => {
        ipcRenderer.send('fetchComment')
      }, 100)
    }
  }
</script>

<style lang="stylus" scoped>

</style>


<style lang="stylus">
  @import '~vuetify-stylus-fixed-table-header'

  #comments
    fixed-table-header(100vh)
</style>

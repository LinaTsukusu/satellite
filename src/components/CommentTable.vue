import {ipcRenderer} from "electron"
<template lang="pug">
  #comments-table
    table#table
      thead
        tr
          th No
          th Comment
      tbody
        tr(v-for="row in comments")
          td {{row.number}}
          td {{row.comment}}
    #end


</template>

<script lang="ts">
  import {Component, Vue} from 'vue-property-decorator'
  import {ipcRenderer} from 'electron'

  @Component
  export default class CommentTable extends Vue {
    // TODO 上下エンドレススクロール 2000件ずつくらい
    private comments: CommentData[] = []
    private isScroll = true

    public mounted() {
      ipcRenderer.on('receiveComment', (_: Electron.Event, comments: CommentData[]) => {
        this.comments = comments
        if (this.isScroll) {
          // const table = document.getElementById('table')!
          // table.scrollTop = table.scrollHeight
          this.$vuetify.goTo('#end')
        }
      })

      setInterval(() => {
        ipcRenderer.send('fetchComment')
      }, 100)
    }
  }
</script>

<style lang="stylus" scoped>
  #table
    thead
      th
        position -webkit-sticky
        position sticky
        top 0
        z-index 1
        background #434343
        color #e0e0e0
</style>

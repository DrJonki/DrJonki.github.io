<template>
  <div>
    <div
      v-for="(html, idx) in contentHtml" :key="idx"
      v-html="html"
    ></div>
  </div>
</template>
<script lang="ts">

import Vue from 'vue'
import Component from 'vue-class-component'
import { Prop } from 'vue-property-decorator'

@Component
export default class ContentPage extends Vue {
  @Prop({
    required: true,
    type: Array
  })
  private contentHtml!: string[];

  private mounted () {
    this.$nextTick(() => {
      //
    })
  }
}

</script>
<style lang="scss" scoped>

</style>

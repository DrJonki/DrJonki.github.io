<template>
  <div class="index">
    <component
      v-for="({ tag, text }, idx) in indexItems" :key="idx" :ref="`item-${idx}`"
      :is="tag"
      :style="elStyle(idx)"
    >
      {{ text }}
    </component>
  </div>
</template>
<script lang="ts">

import { Vec2 } from '@/ts/vec'
import Vue from 'vue'
import Component from 'vue-class-component'
import { Prop } from 'vue-property-decorator'
import { clamp } from 'lodash'

export interface IndexItem {
  tag: 'h4' | 'h5' | 'h6';
  text: string;
}

@Component
export default class ContentIndex extends Vue {
  @Prop({
    required: true,
    type: Array
  })
  private indexItems!: IndexItem[];

  @Prop({
    required: true,
    type: Number
  })
  private contentHeight!: number;

  @Prop({
    required: true,
    type: Number
  })
  private scrollPosition!: number;

  /** Header element emphasis on a scale from 0 to 1 */
  private mElEmphasisMouse: { [index: number]: number } = []

  private elStyle (idx: number) {
    const emphasis = Math.max(this.mElEmphasisMouse[idx] ?? 0, this.scrollPosEmphasis(idx) ?? 0)
    const nonEmphasizedRgb = 0xbb
    const rgb = nonEmphasizedRgb + (255 - nonEmphasizedRgb) * emphasis
    const rgbStr = `rgb(${rgb}, ${rgb}, ${rgb})`

    return {
      padding: `${emphasis * 0.25}px 0`,
      color: rgbStr,
      'text-shadow': `0 0 ${emphasis * 3}px white`
    }
  }

  private scrollPosEmphasis (idx: number) {
    return 0
  }

  private onMouseMove (ev: MouseEvent) {
    const outsideThresholdY = 10

    for (let i = 0; i < this.indexItems.length; ++i) {
      const itemEl = [this.$refs[`item-${i}`]].flat()[0] as Element
      const rect = itemEl.getBoundingClientRect()
      const halfHeight = rect.height / 2
      const centerY = (rect.top + rect.bottom) / 2
      const dist = Math.abs(centerY - ev.clientY)

      this.$set(this.mElEmphasisMouse, i, clamp(dist / halfHeight + 1 - dist / thresholdY, 0, 1))
    }
  }

  private mounted () {
    window.addEventListener('mousemove', this.onMouseMove)
  }

  private beforeDestroy () {
    window.removeEventListener('mousemove', this.onMouseMove)
  }
}

</script>
<style lang="scss" scoped>

.index {
  position: fixed;
  right: 100px;
  margin-top: 100px;
  display: flex;
  flex-direction: column;
  align-items: flex-end;

  > * {
    color: #777;
    margin: 0;
    padding: 0;
  }
}

h4, h5, h6 {
  cursor: pointer;
}

</style>

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
  private mElEmphasis: { [index: number]: number } = []

  private elStyle (idx: number) {
    const emphasis = this.mElEmphasis[idx] ?? 0

    return {
      'line-height': `${1 + emphasis}em`
    }
  }

  private onMouseMove (ev: MouseEvent) {
    const threshold = 75

    for (let i = 0; i < this.indexItems.length; ++i) {
      const itemEl = [this.$refs[`item-${i}`]].flat()[0] as Element
      const rect = itemEl.getBoundingClientRect()
      const center = new Vec2(rect.right, (rect.top + rect.bottom) / 2)
      const dist = new Vec2(ev.clientX, ev.clientY).subtraction(center).magnitude()

      this.$set(this.mElEmphasis, i, clamp(1 - dist / threshold, 0, 1))
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

<template>
  <div class="content-container" ref="content-container">
    <div class="content" ref="content">
      <div
        v-for="(html, idx) in contentHtml" :key="idx"
        ref="content-item"
        v-html="html"
      ></div>
      <div class="bottom-padding"></div>
    </div>
    <transition name="fade" appear>
      <ContentIndex
        v-if="indexItems.length > 0"
        :index-items="indexItems"
        :scroll-position="scrollPos"
        :content-height="scrollHeight"
      ></ContentIndex>
    </transition>
  </div>
</template>
<script lang="ts">

import Vue from 'vue'
import Component from 'vue-class-component'
import { Prop } from 'vue-property-decorator'
import ContentIndex, { IndexItem } from '@/components/ContentIndex.vue'

@Component({
  components: {
    ContentIndex
  }
})
export default class ContentPage extends Vue {
  @Prop({
    required: true,
    type: Array
  })
  private contentHtml!: string[];

  @Prop({ required: true })
  private showIndex!: boolean;

  private indexItems: IndexItem[] = []
  private scrollHeight = 0
  private scrollPos = 0

  private onScroll (ev: Event) {
    this.scrollPos = (ev.target as Element).scrollTop
  }

  private mounted () {
    if (!this.showIndex) {
      return
    }

    this.$nextTick(() => {
      const containerEl = [this.$refs['content-container']].flat()[0] as Element
      containerEl.addEventListener('scroll', this.onScroll)

      setTimeout(() => {
        const contentEl = [this.$refs.content].flat()[0] as Element
        const replacementTags: { [tag: string]: IndexItem['tag'] } = {
          H1: 'h4',
          H2: 'h5',
          H3: 'h6'
        }

        this.indexItems = Array.from(contentEl.querySelectorAll('h1, h2, h3')).map(el => ({
          tag: replacementTags[el.tagName],
          text: el.textContent ?? ''
        }))
      }, 500)

      this.scrollHeight = [this.$refs['content-item']]
        .flat()
        .reduce((accum, el) => accum + (el as Element).scrollHeight, 0)
    })
  }

  private beforeDestroy () {
    const containerEl = [this.$refs['content-container']].flat()[0] as Element
    containerEl.removeEventListener('scroll', this.onScroll)
  }
}

</script>
<style lang="scss" scoped>

.content-container {
  display: flex;
  max-height: 100%;
  overflow-y: auto;
  overscroll-behavior-y: contain;

  &::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.content {
  max-width: 1280px;
  hyphens: auto;
  text-align: justify;

  .bottom-padding {
    height: 300px;
  }
}

.fade-enter-active {
  transition: opacity .25s;
}
.fade-enter {
  opacity: 0;
}

</style>

<template>
  <div class="content-container">
    <div class="content" ref="content">
      <div
        v-for="(html, idx) in contentHtml" :key="idx"
        v-html="html"
      ></div>
      <div class="bottom-padding"></div>
    </div>
    <transition name="fade" appear>
      <div v-show="showIndex && indexReady" class="index">
        <component
          v-for="({ tag, text }, idx) in indexItems" :key="idx"
          :is="tag"
        >
          {{ text }}
        </component>
      </div>
    </transition>
  </div>
</template>
<script lang="ts">

import Vue from 'vue'
import Component from 'vue-class-component'
import { Prop } from 'vue-property-decorator'

interface IndexItem {
  tag: string;
  text: string;
}

@Component
export default class ContentPage extends Vue {
  @Prop({
    required: true,
    type: Array
  })
  private contentHtml!: string[];

  @Prop({ required: true })
  private showIndex!: boolean;

  private indexReady = false;

  private indexItems: IndexItem[] = []

  private mounted () {
    this.$nextTick(() => {
      const contentEl = [this.$refs.content].flat()[0] as Element
      const contentElHeaders = contentEl.querySelectorAll('h1, h2, h3')
      const headerEls: Element[] = []

      const replacementTags: { [tag: string]: string } = {
        H1: 'h4',
        H2: 'h5',
        H3: 'h6'
      }

      for (let i = 0; i < contentElHeaders.length; ++i) {
        headerEls.push(contentElHeaders[i])
      }

      this.indexItems = headerEls.map(el => ({
        tag: replacementTags[el.tagName],
        text: el.textContent ?? ''
      }))

      console.log(contentElHeaders, this.indexItems)

      setTimeout(() => {
        this.indexReady = true
      }, 500)
    })
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
    height: 0;
  }
}

.index {
  position: fixed;
  right: 100px;
  margin-left: auto;
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

.fade-enter-active {
  transition: opacity .25s;
}
.fade-enter {
  opacity: 0;
}

</style>

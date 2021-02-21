import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'
import ContentView from '@/views/Content.vue'
import ContentPage from '@/components/ContentPage.vue'

Vue.use(VueRouter)

const ctx = require.context('~/', true, /\.md/)
export const rootPages = [
  'index',
  'about',
  'experience',
  'projects',
  'contact',
  'links'
]
const noIndexPages = [
  'index',
  'contact',
  'links'
]

interface Content {
  contentHtml: string[];
  showIndex: boolean;
}
const content: Content[] = rootPages.map(page => {
  const pages = ctx.keys().filter(key => key.includes(`/${page}/`))

  return {
    contentHtml: pages.sort().map(subPage => ctx(subPage)),
    showIndex: !noIndexPages.includes(page)
  }
})

const routes: RouteConfig[] = [
  {
    path: '/',
    name: 'Home',
    component: ContentView,
    children: rootPages.map((page, idx) => ({
      path: page,
      name: page,
      component: ContentPage,
      props: content[idx]
    }))
  }
]

const router = new VueRouter({
  routes
})

export default router

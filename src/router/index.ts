import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'
import Home from '@/views/Home.vue'
import ContentPage from '@/components/ContentPage.vue'

Vue.use(VueRouter)

const ctx = require.context('~/', true, /\.md/)
export const rootPages = [
  'about',
  'experience',
  'projects',
  'contact',
  'links'
]

interface Content {
  html: string[];
}
const content: Content[] = rootPages.map(page => {
  const pages = ctx.keys().filter(key => key.includes(`/${page}/`))

  return {
    html: pages.sort().map(subPage => ctx(subPage))
  }
})

const routes: Array<RouteConfig> = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    redirect: '/about',
    children: rootPages.map((page, idx) => ({
      path: page,
      name: page,
      component: ContentPage,
      props: {
        contentHtml: content[idx].html
      }
    }))
  }
]

const router = new VueRouter({
  routes
})

export default router

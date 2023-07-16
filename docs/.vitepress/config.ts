import { defineConfig } from 'vitepress'

export default defineConfig({
  lang: 'en-US',
  title: 'Semantic API',
  description: 'Official documentation for Semantic API',

  lastUpdated: true,
  cleanUrls: true,

  themeConfig: {
    nav: nav(),
    sidebar: {
      '/guide/': sidebarGuide(),
      '/reference/': sidebarReference()
    }
  }
})

function nav() {
  return [
    { text: 'Guide', link: '/guide/what-is-semantic-api', activeMatch: '/guide/' },
    { text: 'Reference', link: '/reference/entrypoint', activeMatch: '/reference' }
  ]
}

function sidebarGuide() {
  return [
    {
      text: 'Introduction',
      collapsed: false,
      items: [
        { text: 'What is Semantic API?', link: '/guide/what-is-semantic-api' }
      ]
    }
  ]
}

function sidebarReference() {
  return [
    {
      text: 'Entrypoint',
      link: '/reference/entrypoint'
    },
    {
      text: '@semantic-api/api',
      collapsed: false,
      items: [
        { text: 'Algorithm', link: '/reference/api-algorithm' },
        { text: 'Collection', link: '/reference/api-collection' },
        { text: 'Context', link: '/reference/api-context' },
        { text: 'Description', link: '/reference/api-description' },
      ]
    }
  ]
}

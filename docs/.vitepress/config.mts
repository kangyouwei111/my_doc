import { defineConfig } from 'vitepress'

const repository = process.env.GITHUB_REPOSITORY?.split('/')[1]
const isGitHubActions = process.env.GITHUB_ACTIONS === 'true'

export default defineConfig({
  title: 'Papertrail',
  description: '把复杂工作写成清晰、可执行的文档。',
  lang: 'zh-CN',
  cleanUrls: true,
  lastUpdated: true,
  base: isGitHubActions && repository ? `/${repository}/` : '/',
  themeConfig: {
    logo: '/logo.svg',
    siteTitle: 'Papertrail',
    nav: [
      { text: '指南', link: '/guide/what-is-papertrail' },
      { text: '工作流', link: '/workflow/overview' },
      { text: '参考', link: '/reference/cli' },
      {
        text: '更多',
        items: [
          { text: '更新日志', link: '/changelog' },
          { text: 'GitHub', link: 'https://github.com' }
        ]
      }
    ],
    sidebar: {
      '/guide/': [
        {
          text: '开始使用',
          items: [
            { text: 'Papertrail 是什么', link: '/guide/what-is-papertrail' },
            { text: '5 分钟快速开始', link: '/guide/quick-start' },
            { text: '核心概念', link: '/guide/concepts' }
          ]
        },
        {
          text: '配置与协作',
          items: [
            { text: '项目配置', link: '/guide/configuration' },
            { text: '团队协作', link: '/guide/collaboration' }
          ]
        }
      ],
      '/workflow/': [
        {
          text: '工作流',
          items: [
            { text: '工作流总览', link: '/workflow/overview' },
            { text: '发布检查清单', link: '/workflow/release-checklist' }
          ]
        }
      ],
      '/reference/': [
        {
          text: '参考',
          items: [
            { text: 'CLI 命令', link: '/reference/cli' },
            { text: '配置项', link: '/reference/config' }
          ]
        }
      ]
    },
    socialLinks: [
      { icon: 'github', link: 'https://github.com' }
    ],
    search: {
      provider: 'local'
    },
    editLink: {
      pattern: 'https://github.com/:repo/edit/main/docs/:path',
      text: '在 GitHub 上编辑此页'
    },
    footer: {
      message: '清晰记录，持续交付。',
      copyright: 'Copyright © 2026 Papertrail'
    },
    docFooter: {
      prev: '上一页',
      next: '下一页'
    },
    outline: {
      label: '本页目录'
    },
    lastUpdatedText: '最近更新',
    returnToTopLabel: '回到顶部',
    sidebarMenuLabel: '菜单',
    darkModeSwitchLabel: '外观',
    langMenuLabel: '语言'
  }
})

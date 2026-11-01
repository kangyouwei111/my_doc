# 项目配置

站点配置位于 `docs/.vitepress/config.mts`。VitePress 会读取它来生成导航、侧边栏、搜索和站点元信息。

## 调整站点信息

```ts
export default defineConfig({
  title: '你的项目名',
  description: '一句话描述文档站',
  lang: 'zh-CN'
})
```

## 增加导航

把链接放进 `themeConfig.nav`：

```ts
nav: [
  { text: '指南', link: '/guide/what-is-papertrail' },
  { text: 'API', link: '/reference/api' }
]
```

如果导航指向一个目录，建议同时在 `sidebar` 中配置对应页面，这样读者在浏览时不会迷路。

## GitHub Pages 路径

配置已经支持两种场景：

- 本地开发使用 `/`。
- GitHub Actions 使用 `/<仓库名>/`。

因此不要手动修改 `base`。如果你使用自定义域名，按照 GitHub Pages 的规则添加 `docs/public/CNAME`，并将 `base` 保持为 `/`。

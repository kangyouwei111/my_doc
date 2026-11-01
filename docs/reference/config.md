# 配置项

本页整理模板中最常调整的配置。

| 配置 | 位置 | 作用 |
| --- | --- | --- |
| `title` | `config.mts` | 浏览器标题和站点名称 |
| `description` | `config.mts` | 搜索引擎描述 |
| `base` | `config.mts` | 部署到子路径时的资源前缀 |
| `themeConfig.nav` | `config.mts` | 顶部导航 |
| `themeConfig.sidebar` | `config.mts` | 文档侧边栏 |

## 环境变量

GitHub Actions 会自动提供 `GITHUB_REPOSITORY` 和 `GITHUB_ACTIONS`。模板用它们推导仓库路径，不需要额外的 Secret。

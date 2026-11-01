# 5 分钟快速开始

这份指南会带你在本地启动文档站，并发布第一篇页面。

## 1. 准备环境

需要 Node.js 18 或更高版本，以及 pnpm 9 或更高版本。

```bash
node --version
pnpm --version
```

## 2. 安装并启动

```bash
pnpm install
pnpm dev
```

打开终端提示的本地地址，VitePress 会在文件变更后自动刷新。

## 3. 创建一页文档

在 `docs/guide/` 下新建 Markdown 文件：

```md
# 我的第一篇文档

用一句话说明这页文档的目的。

## 下一步

列出读者现在可以执行的动作。
```

然后在 `docs/.vitepress/config.mts` 的 `sidebar` 中加入链接，页面就会出现在导航里。

## 4. 构建检查

提交前运行一次生产构建：

```bash
pnpm build
```

构建产物在 `docs/.vitepress/dist`，它不需要提交到 Git，因为 GitHub Actions 会自动生成并发布。

::: warning 常见问题
如果页面链接在 GitHub Pages 中出现 404，请确认仓库名没有被硬编码到配置里。本模板会通过 `GITHUB_REPOSITORY` 自动设置 `base`。
:::

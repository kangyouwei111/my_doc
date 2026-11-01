# Papertrail 文档站

基于 [VitePress](https://vitepress.dev/) 的中文文档系统，适合直接部署到 GitHub Pages。

## 本地开发

```bash
pnpm install
pnpm dev
```

生产构建与预览：

```bash
pnpm build
pnpm preview
```

## 发布到 GitHub Pages

1. 将项目推送到 GitHub 的 `main` 分支。
2. 在仓库的 **Settings → Pages** 中，将 Source 设置为 **GitHub Actions**。
3. 后续每次推送到 `main`，`.github/workflows/deploy.yml` 都会自动构建并发布站点。

配置会在 GitHub Actions 中自动使用 `/<仓库名>/` 作为 `base`，无需手动改路径。

## 私有密码仓库

站点构建时会读取 Gitee 私有仓库 `kangyouwei111/my_pwd` 的 `master/pwd.json`，并只将 `GitHub_page_1` 的 SHA-256 哈希写入静态站点。Gitee Token 不会进入前端代码。

在 GitHub 仓库的 **Settings → Secrets and variables → Actions** 中创建名为 `GITEE_TOKEN` 的 Secret，值为 Gitee 只读 Personal Access Token。不要把 Token 写入代码、`.env` 或任何已提交文件。

本地开发时可以复制 `.env.local.example` 为 `.env.local`，填入 Token：

```env
GITEE_TOKEN=你的Gitee只读Token
```

然后启动开发服务器：

```bash
pnpm dev
```

`.env.local` 已被 `.gitignore` 忽略，不会提交到仓库。GitHub Actions 仍然使用名为 `GITEE_TOKEN` 的 Actions Secret。若本地没有 Token，开发服务器仍可启动，但密码验证会提示配置不可用；生产构建会要求 Token 存在。

## 目录结构

```text
docs/
├─ .vitepress/       # VitePress 配置与主题
├─ guide/            # 入门与协作指南
├─ workflow/         # 工作流与检查清单
├─ reference/        # CLI 和配置参考
└─ index.md          # 首页
```

新增页面后，在 `docs/.vitepress/config.mts` 中把它加入 `nav` 或 `sidebar`，即可出现在站点导航中。

# CLI 命令

项目脚本集中在 `package.json`，常用命令如下：

| 命令 | 用途 |
| --- | --- |
| `pnpm dev` | 启动本地开发服务器 |
| `pnpm build` | 构建生产版本 |
| `pnpm preview` | 预览生产构建 |

## 指定端口

```bash
pnpm dev -- --port 4173
```

## 检查生产构建

```bash
pnpm build && pnpm preview
```

预览命令需要先完成构建。生产构建失败时，优先从第一条错误开始修复，后续错误可能只是连锁反应。

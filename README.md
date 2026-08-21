# fn-knock website

fn-knock 敲门官网前端，使用 Vue 3、TypeScript、Vue Router、Tailwind CSS 和 Vite 构建。

## 开发

项目使用 Bun 管理依赖：

```bash
bun install
cp .env.example .env
bun run dev
```

`VITE_API_BASE_URL` 控制前端认证请求的 API 地址；未配置时使用生产 API。
`VITE_RELEASE_API_URL` 控制全站版本号与 `/changelog` 更新日志的数据地址；
默认请求 `https://cor.fnknock.cn/latest.json`。

## 前端目录

- `src/components/home`：首页业务区块
- `src/components/install`：安装页共用组件
- `src/components/layout`：全站页头、页尾与登录界面
- `src/components/ui`：无业务依赖的基础 UI
- `src/composables`：可复用交互和状态逻辑
- `src/config`：站点内容、下载地址及静态配置
- `src/services`：前端 API 访问层
- `src/pages`：路由页面编排

## 质量检查

```bash
bun run typecheck
bun run lint
bun run test
bun run format:check
bun run build
```

也可以执行 `bun run check` 一次运行全部前端门禁。提交前应确保该命令通过。

## 构建

```bash
bun run build
bun run preview
```

生产环境使用 HTML5 History 路由，静态服务器需要将未知路径回退到 `index.html`，以支持 `/linux`、`/windows` 等地址直接访问。

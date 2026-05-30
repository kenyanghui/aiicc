# AIICC — Next.js 16 开发须知

## Next.js 16 主要差异

本文档基于 `node_modules/next/dist/docs/` 中的官方文档编写。

### 1. params 和 searchParams 是 Promise

在 Next.js 16 服务端 Page 组件中，`params` 和 `searchParams` 是 **Promise**，必须 `await`：

```tsx
// ✅ 正确
export default async function Page(props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params;
}

// ✅ query params
export default async function Page(props: {
  searchParams: Promise<{ q: string }>
}) {
  const { q } = (await props.searchParams).q;
}
```

客户端组件中仍然使用 `useParams()` 和 `useSearchParams()` hook。

### 2. 路由处理器 (Route Handlers)

使用 Web Request / Response API：

```ts
export async function GET(request: Request) {
  return Response.json({ ok: true });
}

export async function POST(request: Request) {
  const body = await request.json();
  return Response.json({ ok: true, data: body });
}
```

可用 `NextRequest` / `NextResponse` 获取扩展能力（URL 解析、Cookie、Headers 等）。

### 3. Tailwind CSS v4

使用 `@import "tailwindcss"` **而非** 旧的 `@tailwind` 指令：

```css
/* globals.css — ✅ 正确 */
@import "tailwindcss";

/* ❌ 不要使用旧的 @tailwind 指令 */
```

Tailwind v4 配置通过 CSS 完成，`tailwind.config.js` 不再必需。

### 4. 构建与 ESLint

- 使用 `eslint` CLI 直接运行，**不是** `next lint`：
  ```bash
  npx eslint .
  ```
- 构建使用 `next build`，Turbopack 是默认 bundler。

### 5. 参考文档位置

所有官方文档位于 `node_modules/next/dist/docs/`：

| 主题 | 路径 |
|------|------|
| 安装与起步 | `01-app/01-getting-started/01-installation.md` |
| 项目结构 | `01-app/01-getting-started/02-project-structure.md` |
| Layouts 和 Pages | `01-app/01-getting-started/03-layouts-and-pages.md` |
| 客户端/服务端组件 | `01-app/01-getting-started/05-server-and-client-components.md` |
| 路由处理器 | `01-app/01-getting-started/15-route-handlers.md` |
| 数据获取与缓存 | `01-app/01-getting-started/06-fetching-data.md` |
| 文件约定 | `01-app/03-api-reference/03-file-conventions/` |
| PostCSS 配置 | `01-app/03-api-reference/05-config/postcss.md` |
| Turbopack | `01-app/03-api-reference/08-turbopack.md` |

### 6. 本项目技术栈

| 技术 | 版本 |
|------|------|
| Next.js | 16.2.6 |
| React | 19.2.4 |
| Tailwind CSS | v4 |
| Prisma | ^5.22.0 |
| TypeScript | ^5 |

更多细节请参考对应的官方文档文件。

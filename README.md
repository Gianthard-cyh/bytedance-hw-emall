# 字节跳动前端训练营作业2 - 购物商城
- 使用React作为前端框架
- 使用Vite + Rolldown作为打包器
- TailwindCSS作为原子化CSS框架
- 采用 shadcn-ui 作为组件库，兼具丰富组件与高度可定制性，灵活度优于传统方案。

- 开发过程中发现分类选择器的项目中，每个分类项的逻辑是内聚的，可以将其封装为一个组件，提高代码的可维护性和可复用性。
- 在开发商品列表时，发现商品卡片的图片加载是一个异步操作，为了避免图片加载时页面闪烁的问题，在图片加载过程中显示骨架，防止页面布局跳变

## 项目结构
- `src/App.tsx`：应用入口，基于 `window.location.pathname` 的简易路由切换列表与详情页。
- `src/pages/productDetail.tsx`：商品详情页视图与交互。
- `src/components/`：UI 组件与业务组件
  - `components/product/`：商品相关组件（卡片、分页、工具栏、详情模块）
  - `components/ui/`：基础 UI 组件与其样式变体（按 shadcn-ui 组织）
- `src/lib/utils.ts`：通用工具函数（例如 `cn`、`getProductIdFromPath`）。
- `src/lib/data.ts`：数据层（Mock 数据统一出口：`fetchProductList`、`fetchProductDetail`）。
- `src/types/`：类型声明文件（例如 `mockjs.d.ts`）。

## 重要改动与优化
- 移除列表与推荐区的 DOM 事件绑定，改为组件级 `onClick` 回调，更符合 React 思路：
  - 列表点击逻辑改为在 `ProductCard` 上直接处理，避免 `useEffect` 中手动查询与清理事件。
  - 参考位置：`src/components/productList.tsx:146`、`src/components/product/DetailRecommendations.tsx:36`。
- 抽取公共逻辑：
  - `getProductIdFromPath` 移至 `src/lib/utils.ts`，供详情页与其它模块复用（`src/pages/productDetail.tsx:2`）。
  - 统一 Mock 数据到 `src/lib/data.ts`，将列表与详情的生成逻辑集中管理，减少重复与耦合（`src/components/productList.tsx:19`、`src/pages/productDetail.tsx:7`）。
- 纯渲染约束：
  - 避免在渲染期间调用 `Math.random`，推荐区使用根据 `id` 与索引的确定性公式生成评分与价格（`src/pages/productDetail.tsx:112`）。
- Fast Refresh 规则落实：
  - 将 `buttonVariants`、`navigationMenuTriggerStyle` 从组件文件中拆分到独立的 `*-variants.ts`，确保组件文件只导出组件，提升热更新稳定性（`src/components/ui/button-variants.ts`、`src/components/ui/navigation-menu-variants.ts`）。

## 代码约定
- 组件文件只导出组件；样式变体（cva）放到 `*-variants.ts`。
- 事件处理优先使用组件 props（如 `onClick`），避免直接操作 DOM。
- 列表与分页：排序与分页逻辑在列表组件内以 `useMemo` 和局部状态管理。
- 数据层：统一通过 `src/lib/data.ts` 暴露方法，类型通过泛型声明，避免 `any`。
- 路由：简化为 `location.pathname` 解析，不引入路由库，保持作业场景清晰可控。

## 开发与质量
- 启动开发：`pnpm dev`
- 构建产物：`pnpm build`（包含 TypeScript 类型检查）
- 代码检查：`pnpm lint`

## 后续可演进方向
- 引入路由（如 React Router），替换 `window.location.href` 导航，支持历史与更复杂的路径。
- 将 Mock 数据替换为真实 API，并在 `src/lib/data.ts` 中加入缓存与错误处理策略。
- 增加单元测试（例如组件渲染与交互测试），确保重构后行为稳定。

# 字节跳动前端训练营作业2 - 购物商城（详述）

本次作业以电商商品展示与购物车为核心，围绕“路由导航、筛选、详情交互、购物车与结算反馈、数据一致性”进行搭建与迭代。下面从架构、实现步骤、关键决策与质量验证进行完整叙述。

## 技术栈
- 前端框架：React
- 构建工具：Vite（Rolldown）
- 样式：TailwindCSS
- 组件库：shadcn-ui（Select、Sonner Toaster、Radix 系组件）
- 状态管理：Zustand
- 路由管理：React Router

## 项目结构
- `src/App.tsx`：应用框架与路由配置
  - 路由：`/` 与 `/products`（合并为同一页面）、`/product/:id`、`/cart`
- `src/pages/products.tsx`：商品页面（筛选 + 列表）
- `src/pages/productDetail.tsx`：详情页面（画廊、信息、推荐、加入购物车）
- `src/pages/cart.tsx`：购物车页面（列表、总计、结算与反馈）
- `src/components/`：组件
  - `components/product/`：`Card`、`Toolbar`、`Pager`、`DetailGallery`、`DetailInfo`、`DetailRecommendations`
  - `components/ui/`：按 shadcn-ui 的组织方式（`button`、`select`、`sonner`、`tooltip` 等）
- `src/store/products.ts`：商品状态（列表、筛选、推荐、结算减库存）
- `src/store/cart.ts`：购物车状态（增删改清）
- `src/lib/data.ts`：数据层（统一 `Product` 结构，包含详情字段）
- `src/lib/utils.ts`：工具（`cn`、类别规范化 `normalizeCategoryId` 等）

## 数据模型统一（核心）
- 统一使用 `Product` 结构，包含列表必要字段与详情字段：
  - `id`、`name`、`price`、`rating`、`image`、`category`
  - `images`、`colors`、`sizes`、`stock`、`desc`
- 列表与详情、推荐均基于同一结构，避免 `Product` 与 `ProductDetail` 割裂导致重复映射与不一致。
- 位置：`src/lib/data.ts:1`

## 路由与导航
- 使用 React Router 管理路由与导航：
  - `BrowserRouter` 在根挂载：`src/main.tsx:9`
  - 路由配置：`src/App.tsx:20`（`/` 与 `/products` 同指向 `ProductsPage`）；详情与购物车对应独立页面
- 导航栏使用 `Link`：`src/components/navBar.tsx:25`

## 筛选系统
- 左侧筛选器（类别 + 价格区间）与商品列表联动：
  - 全局筛选状态：`src/store/products.ts:12`（`filters`、`setFilters`、`clearFilters`）
  - 列表应用筛选：`src/components/productList.tsx:28`
  - 类别规范化：`src/lib/utils.ts:12`（支持中英文键）
- 类别项不再包含“全部”，当未选择类别时自然展示全部；勾选多个类别为并集过滤。

## 详情页交互
- 规格选择：使用 `Select` 组件重构“尺码”“颜色”，交互更清晰：`src/components/product/DetailInfo.tsx:56`、`:72`
- 数量输入：输入框控制，始终为正数：`src/components/product/DetailInfo.tsx:91`
- 加入购物车：
  - 成功使用 Sonner toast 反馈，并提供“去购物车”快捷入口：`src/pages/productDetail.tsx:87`
  - 成功后重置数量为 1：`src/pages/productDetail.tsx:86`
  - 按钮禁用规则：当购物车已有数量 + 当前选择数量 > 库存时禁用：`src/pages/productDetail.tsx:47`
  - 禁用原因直接文字展示（如未选尺码/颜色、库存不足等）：`src/components/product/DetailInfo.tsx:100`
  - 当库存不足时的文案包含“购物车已有 X 件”：`src/components/product/DetailInfo.tsx:41`

## 购物车与结算
- 购物车页面：列表项展示图片、名称、单价、规格与数量，可调整或移除：`src/pages/cart.tsx:41`
- 空状态美化：图标 + 文案 + CTA：`src/pages/cart.tsx:27`
- 结算模拟：
  - 校验库存并批量扣减，成功清空购物车并 toast 提示：`src/store/products.ts:28`、`src/pages/cart.tsx:63`
  - 库存不足时 toast 提示不足项摘要：`src/pages/cart.tsx:66`

## 关键决策与权衡
- 路由集成：用 React Router 替换手写 `window.location` 导航，获得历史管理与更可控的路由结构。
- 数据一致性：统一 `Product` 结构，使得渲染期间不需要派生详情；推荐数据也使用同一结构。
- 交互反馈：采用 Sonner toast，提供轻量、可操作的反馈；避免模态打断流程。
- 筛选语义：移除“全部”后，空选择即“全部”，避免与其它项的冲突逻辑。
- 组件化约束：样式变体与组件分离，组件文件仅导出组件，保持热更新稳定。

## 运行与质量
- 启动开发：`pnpm dev`
- 构建产物：`pnpm build`（包含 TypeScript 类型检查）
- 代码检查：`pnpm lint`
- 预览：`pnpm preview`

## 可继续演进的方向
- 将数据源替换为真实 API，并在 `store/products` 层加入缓存与错误处理策略。
- 类别筛选改为单选或 URL 同步（`?cat=phone&min=100&max=1000`），支持刷新状态恢复。
- 推荐区展示更多维度（销量、评价），并支持一键加入购物车。
- 加入单元测试与端到端测试，确保筛选、加入购物车、结算的核心流程稳定。

---
本次作业完成了路由、筛选、数据模型统一、购物车与结算反馈的闭环，实现了较完整的用户路径与交互体验，并通过统一的数据结构与状态管理提升可维护性与扩展性。

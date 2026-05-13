# React TypeScript Book Memo

一个简单的 Book Memo 前端项目，用来记录书名、作者和阅读笔记。项目只使用前端技术，不包含 Java 后端、数据库、REST API 或 Docker。数据会保存在浏览器的 `localStorage` 中，刷新页面后仍然保留。

## 项目概要

Book Memo 是一个适合初学者阅读和练习的 React 小项目。它提供新增、编辑、显示和删除读书笔记的功能，代码结构尽量保持简单清晰。当前 UI 使用 Tailwind CSS 风格的设计令牌和 shadcn/ui 组件结构重构，表单、卡片、按钮和输入框更统一。

## 使用技术

- React
- TypeScript
- Vite
- CSS
- Tailwind CSS
- shadcn/ui
- localStorage
- 中日英语言切换
- GitHub Pages
- GitHub Actions

## 本地运行方法

先安装依赖：

```bash
npm install
```

启动开发服务器：

```bash
npm run dev
```

启动后，在浏览器中打开终端提示的本地地址，通常是：

```text
http://localhost:5173/
```

## 构建方法

```bash
npm run build
```

构建产物会生成在 `dist` 目录中。

## UI 说明

主要 UI 已拆分为 shadcn/ui 风格组件：

- `Button`：语言切换、主题切换、保存、更新、编辑和删除按钮
- `Card`：表单区域和 memo 列表区域
- `Input`：书名和作者输入框
- `Textarea`：笔记输入框
- `Label`：表单字段标签

## GitHub Pages 部署说明

本项目已经配置 GitHub Pages 自动部署：

- `vite.config.ts` 设置了 `base: '/react-ts-book-memo/'`，适配 GitHub Pages 的仓库路径。
- `.github/workflows/deploy.yml` 会在 `main` 分支收到 push 后自动运行。
- Workflow 会执行 `npm ci`、`npm run build`，然后把 `dist` 目录部署到 GitHub Pages。

第一次使用 GitHub Pages 时，需要在 GitHub 仓库页面中设置：

1. 打开仓库的 **Settings**。
2. 点击左侧菜单 **Pages**。
3. 在 **Build and deployment** 的 **Source** 中选择 **GitHub Actions**。
4. 保存后，push 到 `main` 分支即可触发自动部署。

部署完成后，可以访问：

```text
https://atsuyoshijp-bit.github.io/react-ts-book-memo/
```

## 功能列表

- 显示所有 book memos
- 新增 book memo
- 编辑 book memo
- 删除 book memo
- 使用 localStorage 保存 memo 数据
- 中日英语言切换
- 浅色 / 深色 / 自动主题切换
- 当前语言和主题选择会保存到 localStorage，刷新页面后仍然保留
- 刷新页面后 memo 数据仍然保留

## 主要文件

- `src/main.tsx`：React 应用入口
- `src/App.tsx`：Book Memo 主界面和功能逻辑
- `src/App.css`：Tailwind / shadcn UI 全局样式和设计令牌
- `src/components/ui/`：shadcn/ui 风格基础组件
- `src/lib/utils.ts`：组件 className 工具函数
- `src/types.ts`：TypeScript 数据类型
- `src/i18n.ts`：中日英 UI 翻译文案和语言类型
- `vite.config.ts`：Vite 配置，包含 GitHub Pages 的 base 路径和 Tailwind 插件
- `components.json`：shadcn/ui 配置
- `.github/workflows/deploy.yml`：GitHub Pages 自动部署流程
- `README.md`：项目说明
- `AGENTS.md`：仓库协作说明

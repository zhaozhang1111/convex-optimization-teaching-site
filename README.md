# Lagrangian Duality Teaching Site

一个可持续扩展的教学网站原型，当前完成了第一章：

- 固定不同的 `x`，展示一族关于 `λ` 的仿射函数 `L(x, λ)`
- 对这一族仿射函数取逐点下确界，得到 `g(λ)=inf_x L(x, λ)`
- 图形化解释为什么 `g(λ)` 是 concave function
- 图形化解释 `g(λ) <= p*` 的 lower bound 性质
- 证明按行动态出现
- 当前 `λ` 下由哪一个 `x` 决定下包络，也会被直接显示

## 运行方式

```bash
npm install
npm run dev
```

浏览器打开：

```bash
http://localhost:5173
```

## 构建生产版本

```bash
npm run build
npm run preview
```

## 当前项目结构

```text
src/
  components/
    AnimatedProof.tsx
    MathCard.tsx
    RangeControl.tsx
  pages/
    DualityIntroPage.tsx
  App.tsx
  main.tsx
  styles.css
```

## 后续建议扩展

后续可以在 `src/pages/` 中继续加入：

- `KKTPage.tsx`
- `StrongDualityPage.tsx`
- `ConvexityBasicsPage.tsx`
- `ExercisesPage.tsx`

然后在 `App.tsx` 中加入简单导航，逐步升级为完整教学网站。

## 推荐开发路线

### 第一步
先把 `DualityIntroPage.tsx` 这一页持续打磨，用于课堂演示与学生自学。

### 第二步
把后续内容拆成独立页面，例如 KKT、强对偶、Slater 条件。

### 第三步
增加顶部导航、章节菜单、练习模式、中英双语切换，形成完整教学网站。

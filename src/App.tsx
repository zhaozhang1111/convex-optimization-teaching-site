import React, { useState } from "react";

function NavButton({
  active,
  children,
  onClick,
}: {
  active: boolean;
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: "10px 16px",
        borderRadius: 14,
        border: "1px solid #d4d4d8",
        background: active ? "#18181b" : "#ffffff",
        color: active ? "#ffffff" : "#3f3f46",
        cursor: "pointer",
        fontWeight: 600,
      }}
    >
      {children}
    </button>
  );
}

function Card({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        background: "#fff",
        border: "1px solid #e4e4e7",
        borderRadius: 20,
        padding: 24,
        boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
      }}
    >
      <h3 style={{ marginTop: 0, marginBottom: 12 }}>{title}</h3>
      <div style={{ color: "#52525b", lineHeight: 1.8 }}>{children}</div>
    </div>
  );
}

function DualPage() {
  return (
    <div style={{ display: "grid", gap: 20 }}>
      <Card title="Chapter 1 · Lagrangian Dual Function">
        这一页先保留为稳定入口页。下一步我们会把你之前那套“仿射函数族 →
        逐点下确界 → concave → lower bound”的完整动画版本，安全地嵌回这里。
      </Card>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
          gap: 20,
        }}
      >
        <Card title="Step 1">固定不同的 x，形成一族关于 λ 的仿射函数。</Card>
        <Card title="Step 2">对仿射函数逐点取下确界，得到 concave 的 g(λ)。</Card>
        <Card title="Step 3">验证 g(λ) ≤ p*，说明对偶函数给出 lower bound。</Card>
      </div>
    </div>
  );
}

function KKTPage() {
  return (
    <div style={{ display: "grid", gap: 20 }}>
      <Card title="Chapter 2 · KKT Conditions">
        这一页先把 KKT 的结构搭起来，后面再逐步加入动画、例题和图形解释。
      </Card>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
          gap: 20,
        }}
      >
        <Card title="1. Primal feasibility">
          原问题的可行性条件必须满足。
        </Card>
        <Card title="2. Dual feasibility">
          拉格朗日乘子必须满足符号限制，如 λ ≥ 0。
        </Card>
        <Card title="3. Stationarity">
          最优点处，拉格朗日函数对决策变量的一阶导数为 0。
        </Card>
        <Card title="4. Complementary slackness">
          λh(x)=0。约束不紧时，乘子不能发力；乘子发力时，约束必须是紧的。
        </Card>
      </div>

      <Card title="本页后续扩展">
        下一步可以加入：
        <br />
        1. 例题 min (x-2)^2+1, s.t. x≥1
        <br />
        2. KKT 四条条件逐行动画
        <br />
        3. 互补松弛的图形解释
      </Card>
    </div>
  );
}

export default function App() {
  const [page, setPage] = useState<"dual" | "kkt">("dual");

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(to bottom right, #fefce8, #ffffff, #fafafa)",
        padding: 24,
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      }}
    >
      <div style={{ maxWidth: 1200, margin: "0 auto", display: "grid", gap: 24 }}>
        <div
          style={{
            background: "#fff",
            border: "1px solid #e4e4e7",
            borderRadius: 24,
            padding: 24,
            boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
          }}
        >
          <div style={{ color: "#71717a", fontSize: 14, marginBottom: 8 }}>
            Convex Optimization Visual Teaching Website
          </div>
          <h1 style={{ margin: 0, fontSize: 36 }}>凸优化可视化教学网站</h1>
          <p style={{ color: "#52525b", lineHeight: 1.8, marginTop: 12 }}>
            先把网站骨架稳定下来，再逐页增强内容。当前先做两页：
            Dual Function 与 KKT Conditions。
          </p>

          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 16 }}>
            <NavButton active={page === "dual"} onClick={() => setPage("dual")}>
              Chapter 1 · Dual Function
            </NavButton>
            <NavButton active={page === "kkt"} onClick={() => setPage("kkt")}>
              Chapter 2 · KKT Conditions
            </NavButton>
          </div>
        </div>

        {page === "dual" ? <DualPage /> : <KKTPage />}
      </div>
    </div>
  );
}
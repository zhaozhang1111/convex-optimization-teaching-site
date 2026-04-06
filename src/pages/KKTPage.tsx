import { useState } from "react";

export default function KKTPage() {
  const [showAnswer, setShowAnswer] = useState(false);

  return (
    <div style={{ padding: "40px", maxWidth: "1100px", margin: "0 auto" }}>
      
      {/* 标题 */}
      <h1 style={{ fontSize: "34px", marginBottom: "10px" }}>
        Chapter 2 · KKT Conditions
      </h1>
      <p style={{ color: "#666", marginBottom: "30px" }}>
        KKT 条件是连接原问题与对偶问题的核心桥梁。
      </p>

      {/* 四条条件 */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: "20px" }}>
        
        <Card title="1. Primal feasibility">
          原问题约束必须满足：x ≥ 1
        </Card>

        <Card title="2. Dual feasibility">
          拉格朗日乘子必须满足：λ ≥ 0
        </Card>

        <Card title="3. Stationarity">
          ∂L/∂x = 0
          <br />
          ⇒ 2(x−2) − λ = 0
        </Card>

        <Card title="4. Complementary slackness">
          λ(1 − x) = 0
        </Card>

      </div>

      {/* 例子 */}
      <div style={{ marginTop: "40px" }}>
        <h2>Example</h2>
        <p>
          min (x − 2)² + 1 <br />
          s.t. x ≥ 1
        </p>
      </div>

      {/* 推导 */}
      <div style={{ marginTop: "20px", background: "#fafafa", padding: "20px", borderRadius: "12px" }}>
        <h3>Derivation</h3>
        <p>L(x,λ) = (x − 2)² + 1 + λ(1 − x)</p>
        <p>∂L/∂x = 2(x−2) − λ = 0</p>
        <p>x = 2 + λ/2</p>
      </div>

      {/* 互补松弛解释 */}
      <div style={{ marginTop: "30px" }}>
        <h3>Complementary Slackness Intuition</h3>
        <p>
          如果约束不紧（x &gt; 1），那么 λ = 0 <br />
          如果 λ &gt; 0，那么必须 x = 1
        </p>
      </div>

      {/* 小练习 */}
      <div style={{ marginTop: "40px" }}>
        <h3>Exercise</h3>
        <p>最优解是多少？</p>

        <button onClick={() => setShowAnswer(!showAnswer)}>
          {showAnswer ? "隐藏答案" : "显示答案"}
        </button>

        {showAnswer && (
          <div style={{ marginTop: "10px", background: "#fffbe6", padding: "10px" }}>
            x* = 2, λ* = 0
          </div>
        )}
      </div>

    </div>
  );
}

/* 简单卡片组件 */
function Card({ title, children }: any) {
  return (
    <div style={{
      border: "1px solid #ddd",
      borderRadius: "12px",
      padding: "20px",
      background: "white"
    }}>
      <h3>{title}</h3>
      <p>{children}</p>
    </div>
  );
}
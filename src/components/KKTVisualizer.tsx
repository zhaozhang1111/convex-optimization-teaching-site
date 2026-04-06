import { useMemo, useState } from "react";

function StatusBadge({
  ok,
  label,
  detail,
}: {
  ok: boolean;
  label: string;
  detail: string;
}) {
  return (
    <div
      style={{
        border: "1px solid #e4e4e7",
        borderRadius: "14px",
        padding: "14px 16px",
        background: ok ? "#f0fdf4" : "#fff7ed",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "10px",
        }}
      >
        <div style={{ fontWeight: 600 }}>{label}</div>
        <div
          style={{
            fontSize: "12px",
            fontWeight: 700,
            padding: "4px 10px",
            borderRadius: "999px",
            background: ok ? "#dcfce7" : "#ffedd5",
            color: ok ? "#166534" : "#9a3412",
          }}
        >
          {ok ? "Satisfied" : "Not yet"}
        </div>
      </div>
      <div style={{ marginTop: "8px", color: "#52525b", lineHeight: "1.7" }}>
        {detail}
      </div>
    </div>
  );
}

function InfoCard({
  title,
  value,
  sub,
}: {
  title: string;
  value: string;
  sub?: string;
}) {
  return (
    <div
      style={{
        border: "1px solid #e4e4e7",
        borderRadius: "14px",
        padding: "16px",
        background: "#fafafa",
      }}
    >
      <div style={{ fontSize: "13px", color: "#71717a" }}>{title}</div>
      <div style={{ marginTop: "6px", fontSize: "24px", fontWeight: 700 }}>
        {value}
      </div>
      {sub && (
        <div style={{ marginTop: "6px", fontSize: "13px", color: "#71717a" }}>
          {sub}
        </div>
      )}
    </div>
  );
}

export default function KKTVisualizer() {
  const [x, setX] = useState(2.0);
  const [lambda, setLambda] = useState(0.0);

  const constraintBoundary = 1;
  const eps = 0.05;

  const h = 1 - x;
  const stationarity = 2 * (x - 2) - lambda;
  const compSlack = lambda * (1 - x);

  const primalFeasible = x >= 1 - 1e-9;
  const dualFeasible = lambda >= -1e-9;
  const stationarityOk = Math.abs(stationarity) < eps;
  const complementarySlacknessOk = Math.abs(compSlack) < eps;

  const isBinding = Math.abs(x - constraintBoundary) < 0.05;
  const unconstrainedMinimizer = 2;

  const xPercent = useMemo(() => {
    const min = 0.5;
    const max = 3.0;
    return ((x - min) / (max - min)) * 100;
  }, [x]);

  return (
    <div
      style={{
        marginTop: "36px",
        border: "1px solid #e4e4e7",
        borderRadius: "20px",
        padding: "24px",
        background: "white",
        boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
      }}
    >
      <h3 style={{ fontSize: "24px", marginTop: 0, marginBottom: "8px" }}>
        KKT 图形解释 2.0
      </h3>
      <p style={{ color: "#666", marginTop: 0, marginBottom: "22px", lineHeight: 1.8 }}>
        同时拖动 <strong>x</strong> 和 <strong>λ</strong>，
        观察 KKT 四条条件如何一起决定最优性。
      </p>

      {/* 主图 + 右侧信息 */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(0, 1.35fr) 320px",
          gap: "20px",
          alignItems: "start",
        }}
      >
        <div>
          {/* 一维可行域图 */}
          <div
            style={{
              position: "relative",
              height: "170px",
              border: "1px solid #e4e4e7",
              borderRadius: "16px",
              background: "linear-gradient(to bottom, #fafafa, #ffffff)",
              overflow: "hidden",
            }}
          >
            {/* 可行域背景 */}
            <div
              style={{
                position: "absolute",
                left: "20%",
                right: 0,
                top: 0,
                bottom: 0,
                background: "rgba(34,197,94,0.08)",
              }}
            />

            {/* 约束线 x = 1 */}
            <div
              style={{
                position: "absolute",
                left: "20%",
                top: 0,
                bottom: 0,
                width: "3px",
                background: "#dc2626",
              }}
            />

            {/* 无约束极小点 x=2 */}
            <div
              style={{
                position: "absolute",
                left: "60%",
                top: "28px",
                transform: "translateX(-50%)",
                color: "#3f3f46",
                fontSize: "12px",
                fontWeight: 600,
              }}
            >
              unconstrained minimizer x = 2
            </div>
            <div
              style={{
                position: "absolute",
                left: "60%",
                top: "48px",
                width: "2px",
                height: "76px",
                background: "#94a3b8",
                opacity: 0.65,
              }}
            />

            {/* 当前点 x */}
            <div
              style={{
                position: "absolute",
                left: `${xPercent}%`,
                top: "50%",
                transform: "translate(-50%, -50%)",
                width: "18px",
                height: "18px",
                borderRadius: "50%",
                background: "#111827",
                boxShadow: "0 0 0 6px rgba(17,24,39,0.10)",
              }}
            />

            {/* 标签 */}
            <div
              style={{
                position: "absolute",
                left: `${xPercent}%`,
                top: "calc(50% + 22px)",
                transform: "translateX(-50%)",
                fontSize: "12px",
                fontWeight: 700,
                color: "#111827",
                background: "white",
                border: "1px solid #e4e4e7",
                borderRadius: "999px",
                padding: "4px 10px",
              }}
            >
              x = {x.toFixed(2)}
            </div>

            {/* 说明文字 */}
            <div
              style={{
                position: "absolute",
                left: "16px",
                top: "14px",
                fontSize: "12px",
                color: "#52525b",
              }}
            >
              红线：constraint boundary x = 1
            </div>

            <div
              style={{
                position: "absolute",
                left: "16px",
                bottom: "12px",
                fontSize: "12px",
                color: "#52525b",
              }}
            >
              绿色区域：feasible region x ≥ 1
            </div>
          </div>

          {/* 控件 */}
          <div
            style={{
              marginTop: "18px",
              display: "grid",
              gap: "18px",
              border: "1px solid #e4e4e7",
              borderRadius: "16px",
              padding: "18px",
              background: "#fafafa",
            }}
          >
            <div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "8px",
                  fontSize: "14px",
                }}
              >
                <span>x</span>
                <strong>{x.toFixed(2)}</strong>
              </div>
              <input
                type="range"
                min={0.5}
                max={3.0}
                step={0.01}
                value={x}
                onChange={(e) => setX(Number(e.target.value))}
                style={{ width: "100%" }}
              />
            </div>

            <div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "8px",
                  fontSize: "14px",
                }}
              >
                <span>λ</span>
                <strong>{lambda.toFixed(2)}</strong>
              </div>
              <input
                type="range"
                min={0}
                max={3.0}
                step={0.01}
                value={lambda}
                onChange={(e) => setLambda(Number(e.target.value))}
                style={{ width: "100%" }}
              />
            </div>
          </div>
        </div>

        <div style={{ display: "grid", gap: "12px" }}>
          <InfoCard
            title="Constraint status"
            value={isBinding ? "Binding" : x > 1 ? "Slack" : "Violated"}
            sub="判断当前约束是否紧。"
          />
          <InfoCard
            title="Stationarity"
            value={stationarity.toFixed(3)}
            sub="∂L/∂x = 2(x−2) − λ"
          />
          <InfoCard
            title="Complementary slackness"
            value={compSlack.toFixed(3)}
            sub="λ(1−x)"
          />
          <InfoCard
            title="Current interpretation"
            value={
              isBinding
                ? "约束正在起作用"
                : x > 1
                ? "约束未起作用"
                : "当前点不可行"
            }
          />
        </div>
      </div>

      {/* KKT 状态面板 */}
      <div style={{ marginTop: "24px" }}>
        <h4 style={{ marginBottom: "14px" }}>KKT 状态面板</h4>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
            gap: "14px",
          }}
        >
          <StatusBadge
            ok={primalFeasible}
            label="1. Primal feasibility"
            detail={`要求 x ≥ 1。当前 x = ${x.toFixed(2)}。`}
          />
          <StatusBadge
            ok={dualFeasible}
            label="2. Dual feasibility"
            detail={`要求 λ ≥ 0。当前 λ = ${lambda.toFixed(2)}。`}
          />
          <StatusBadge
            ok={stationarityOk}
            label="3. Stationarity"
            detail={`要求 2(x−2) − λ = 0。当前值为 ${stationarity.toFixed(3)}。`}
          />
          <StatusBadge
            ok={complementarySlacknessOk}
            label="4. Complementary slackness"
            detail={`要求 λ(1−x)=0。当前值为 ${compSlack.toFixed(3)}。`}
          />
        </div>
      </div>

      {/* 教学解释 */}
      <div
        style={{
          marginTop: "24px",
          border: "1px solid #fde68a",
          borderRadius: "16px",
          background: "#fffbeb",
          padding: "18px 20px",
          lineHeight: 1.8,
        }}
      >
        <div style={{ fontWeight: 700, marginBottom: "8px", color: "#92400e" }}>
          教学提示
        </div>
        <div style={{ color: "#52525b" }}>
          当 <strong>x &gt; 1</strong> 时，约束是 slack，此时若要满足互补松弛，
          通常必须有 <strong>λ = 0</strong>。  
          当 <strong>λ &gt; 0</strong> 时，若要满足互补松弛，
          则必须有 <strong>x = 1</strong>，也就是约束变成 binding。
          同时还要检查 stationarity 是否成立，这样学生就能看到四条 KKT 条件是如何联动的。
        </div>
      </div>
    </div>
  );
}
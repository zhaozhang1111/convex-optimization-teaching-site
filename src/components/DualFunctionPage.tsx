import React, { useEffect, useMemo, useState } from "react";

const WIDTH = 860;
const HEIGHT = 420;
const PAD = 54;

function cls(...items: Array<string | false | null | undefined>) {
  return items.filter(Boolean).join(" ");
}

function linspace(start: number, end: number, n: number) {
  const arr: number[] = [];
  for (let i = 0; i < n; i++) {
    arr.push(start + ((end - start) * i) / (n - 1));
  }
  return arr;
}

function mapX(x: number, xmin: number, xmax: number) {
  return PAD + ((x - xmin) / (xmax - xmin)) * (WIDTH - 2 * PAD);
}

function mapY(y: number, ymin: number, ymax: number) {
  return HEIGHT - PAD - ((y - ymin) / (ymax - ymin)) * (HEIGHT - 2 * PAD);
}

function pathFromFn(
  xs: number[],
  fn: (v: number) => number,
  xmin: number,
  xmax: number,
  ymin: number,
  ymax: number
) {
  return xs
    .map(
      (x, i) =>
        `${i === 0 ? "M" : "L"}${mapX(x, xmin, xmax)},${mapY(fn(x), ymin, ymax)}`
    )
    .join(" ");
}

function envelopePathFromPoints(
  pts: { x: number; y: number }[],
  xmin: number,
  xmax: number,
  ymin: number,
  ymax: number
) {
  return pts
    .map(
      (p, i) =>
        `${i === 0 ? "M" : "L"}${mapX(p.x, xmin, xmax)},${mapY(p.y, ymin, ymax)}`
    )
    .join(" ");
}

function SliderControl({
  label,
  min,
  max,
  step,
  value,
  onChange,
  format,
}: {
  label: string;
  min: number;
  max: number;
  step: number;
  value: number;
  onChange: (value: number) => void;
  format?: (v: number) => string;
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <span>{label}</span>
        <span className="font-semibold">
          {format ? format(value) : value.toFixed(2)}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="h-2 w-full cursor-pointer appearance-none rounded-full bg-zinc-200 accent-blue-600"
      />
    </div>
  );
}

function Toggle({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className="flex w-full items-center justify-between rounded-2xl border px-4 py-3 text-left transition hover:bg-zinc-50"
    >
      <span className="text-sm">{label}</span>
      <span
        className={cls(
          "rounded-full px-3 py-1 text-xs font-semibold",
          checked ? "bg-amber-100 text-amber-700" : "bg-zinc-100 text-zinc-500"
        )}
      >
        {checked ? "ON" : "OFF"}
      </span>
    </button>
  );
}

function PlotAxes({
  xmin,
  xmax,
  ymin,
  ymax,
  xlabel,
  ylabel,
}: {
  xmin: number;
  xmax: number;
  ymin: number;
  ymax: number;
  xlabel: string;
  ylabel: string;
}) {
  const xAxisY = mapY(0, ymin, ymax);
  const yAxisX = mapX(0, xmin, xmax);
  const xticks = linspace(xmin, xmax, 6);
  const yticks = linspace(ymin, ymax, 6);

  return (
    <g>
      {xticks.map((t, i) => (
        <g key={`xt-${i}`}>
          <line
            x1={mapX(t, xmin, xmax)}
            y1={PAD}
            x2={mapX(t, xmin, xmax)}
            y2={HEIGHT - PAD}
            stroke="currentColor"
            opacity="0.08"
          />
          <text
            x={mapX(t, xmin, xmax)}
            y={HEIGHT - PAD + 22}
            textAnchor="middle"
            className="fill-current text-[11px]"
          >
            {t.toFixed(1)}
          </text>
        </g>
      ))}
      {yticks.map((t, i) => (
        <g key={`yt-${i}`}>
          <line
            x1={PAD}
            y1={mapY(t, ymin, ymax)}
            x2={WIDTH - PAD}
            y2={mapY(t, ymin, ymax)}
            stroke="currentColor"
            opacity="0.08"
          />
          <text
            x={PAD - 12}
            y={mapY(t, ymin, ymax) + 4}
            textAnchor="end"
            className="fill-current text-[11px]"
          >
            {t.toFixed(1)}
          </text>
        </g>
      ))}
      <line
        x1={PAD}
        y1={xAxisY}
        x2={WIDTH - PAD}
        y2={xAxisY}
        stroke="currentColor"
        opacity="0.55"
      />
      <line
        x1={yAxisX}
        y1={PAD}
        x2={yAxisX}
        y2={HEIGHT - PAD}
        stroke="currentColor"
        opacity="0.55"
      />
      <text x={WIDTH - PAD + 18} y={xAxisY + 4} className="fill-current text-xs">
        {xlabel}
      </text>
      <text x={yAxisX + 8} y={PAD - 12} className="fill-current text-xs">
        {ylabel}
      </text>
    </g>
  );
}

function AnimatedProof({
  lines,
  speed = 1400,
}: {
  lines: string[];
  speed?: number;
}) {
  const [visible, setVisible] = useState(1);

  useEffect(() => {
    setVisible(1);
    const timer = window.setInterval(() => {
      setVisible((v) => (v < lines.length ? v + 1 : 1));
    }, speed);
    return () => window.clearInterval(timer);
  }, [lines, speed]);

  return (
    <div className="space-y-2 text-sm leading-7">
      {lines.map((line, i) => (
        <div
          key={i}
          className={cls(
            "transition-all duration-300",
            i < visible ? "opacity-100 translate-x-0" : "opacity-20 -translate-x-1",
            i === visible - 1 && "font-semibold text-amber-700"
          )}
        >
          {line}
        </div>
      ))}
    </div>
  );
}

export default function DualFunctionPage() {
  const steps = [
    {
      title: "第1步：固定不同 x，形成一族关于 λ 的仿射函数",
      desc: "先固定不同的 x，把 L(x,λ) 看成关于 λ 的函数。",
    },
    {
      title: "第2步：对仿射函数逐点取下确界，得到 concave 的 g(λ)",
      desc: "对每个 λ，在所有直线中取最低的一条。",
    },
    {
      title: "第3步：利用可行性验证 g(λ) ≤ p* 的 lower bound",
      desc: "把图像直观和公式证明对应起来。",
    },
  ];

  const [currentStep, setCurrentStep] = useState(0);
  const [autoPlay, setAutoPlay] = useState(false);
  const [lambda, setLambda] = useState(0.8);
  const [xProbe, setXProbe] = useState(2.0);
  const [curveCount, setCurveCount] = useState(9);
  const [showEnvelope, setShowEnvelope] = useState(true);
  const [showDerivation, setShowDerivation] = useState(true);
  const [animationSpeed, setAnimationSpeed] = useState(0.8);

  const lDomain = [0, 4] as const;
  const gDomain = [-7.5, 2.5] as const;
  const ls = useMemo(() => linspace(lDomain[0], lDomain[1], 280), []);

  const f = (x: number) => (x - 2) * (x - 2) + 1;
  const h = (x: number) => 1 - x;
  const L = (x: number, l: number) => f(x) + l * h(x);
  const xStar = (l: number) => 2 + l / 2;
  const g = (l: number) => 1 - l - (l * l) / 4;
  const pStar = 1;

  useEffect(() => {
    if (!autoPlay) return;
    const interval = Math.max(150, 700 / animationSpeed);
    const timer = window.setInterval(() => {
      setLambda((prev) => {
        const next = prev + 0.03;
        if (next > 4) {
          setCurrentStep((s) => (s < 2 ? s + 1 : 0));
          return 0;
        }
        return next;
      });
    }, interval);
    return () => window.clearInterval(timer);
  }, [autoPlay, animationSpeed]);

  const xFamily = useMemo(() => {
    const arr = linspace(0.2, 4.8, curveCount);
    return Array.from(
      new Set([...arr.map((v) => Number(v.toFixed(2))), Number(xProbe.toFixed(2))])
    ).sort((a, b) => a - b);
  }, [curveCount, xProbe]);

  const envelope = useMemo(() => {
    return ls.map((l) => ({ x: l, y: Math.min(...xFamily.map((x) => L(x, l))) }));
  }, [ls, xFamily]);

  const currentG = g(lambda);
  const minimizerXAtLambda = xStar(lambda);
  const currentLxPath = pathFromFn(
    ls,
    (l) => L(xProbe, l),
    lDomain[0],
    lDomain[1],
    gDomain[0],
    gDomain[1]
  );
  const envelopePath = envelopePathFromPoints(
    envelope,
    lDomain[0],
    lDomain[1],
    gDomain[0],
    gDomain[1]
  );
  const dualPath = pathFromFn(
    ls,
    g,
    lDomain[0],
    lDomain[1],
    gDomain[0],
    gDomain[1]
  );

  const proofLines = [
    "g(θλ₁+(1-θ)λ₂) = infₓ L(x, θλ₁+(1-θ)λ₂)",
    "= infₓ [θL(x,λ₁)+(1-θ)L(x,λ₂)]",
    "≥ θ infₓL(x,λ₁) + (1-θ) infₓL(x,λ₂)",
    "= θg(λ₁) + (1-θ)g(λ₂)",
    "⇒ g(λ) is concave.",
  ];

  return (
    <div className="space-y-6">
      <div className="rounded-[28px] border border-zinc-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="mb-2 text-sm text-amber-700">拉格朗日对偶函数教学页</div>
            <h1 className="text-4xl font-bold tracking-tight text-zinc-900">
              Chapter 1 · Lagrangian Dual Function
            </h1>
            <p className="mt-3 max-w-4xl text-sm leading-7 text-zinc-500">
              先固定不同的 x，得到一族关于 λ 的仿射函数；再对它们逐点取下确界，形成
              concave 的拉格朗日对偶函数 g(λ)。
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setCurrentStep((s) => Math.max(0, s - 1))}
              className="rounded-2xl border px-4 py-2 text-sm"
            >
              上一步
            </button>
            <button
              onClick={() => setCurrentStep((s) => Math.min(2, s + 1))}
              className="rounded-2xl bg-zinc-900 px-4 py-2 text-sm text-white"
            >
              下一步
            </button>
            <button
              onClick={() => setAutoPlay((v) => !v)}
              className="rounded-2xl border px-4 py-2 text-sm"
            >
              {autoPlay ? "暂停动画" : "播放动画"}
            </button>
          </div>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-4">
        {steps.map((s, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentStep(idx)}
            className={cls(
              "rounded-[22px] border p-4 text-left transition",
              idx === currentStep ? "border-amber-300 bg-amber-50" : "bg-white hover:bg-zinc-50"
            )}
          >
            <div className="text-xs text-zinc-400">Step {idx + 1}</div>
            <div className="mt-1 font-semibold text-zinc-900">{s.title}</div>
          </button>
        ))}
        <div className="rounded-[22px] border bg-white p-4">
          <div className="text-xs text-zinc-400">当前 λ</div>
          <div className="mt-1 text-2xl font-bold text-zinc-900">{lambda.toFixed(2)}</div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.4fr_0.6fr]">
        <div className="rounded-[28px] border border-zinc-200 bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-bold tracking-tight text-zinc-900">
            {steps[currentStep].title}
          </h2>
          <p className="mt-1 text-sm leading-7 text-zinc-500">{steps[currentStep].desc}</p>

          <div className="mt-6 rounded-[28px] border bg-white p-3">
            <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} className="w-full text-zinc-700">
              <PlotAxes
                xmin={lDomain[0]}
                xmax={lDomain[1]}
                ymin={gDomain[0]}
                ymax={gDomain[1]}
                xlabel="λ"
                ylabel={currentStep === 2 ? "g(λ)" : "L(x, λ) / g(λ)"}
              />

              {(currentStep === 0 || currentStep === 1) &&
                xFamily.map((x, idx) => {
                  const p = pathFromFn(
                    ls,
                    (l) => L(x, l),
                    lDomain[0],
                    lDomain[1],
                    gDomain[0],
                    gDomain[1]
                  );
                  const isProbe = Math.abs(x - xProbe) < 0.08;
                  const isMinimizer = Math.abs(x - minimizerXAtLambda) < 0.18 && currentStep === 1;
                  return (
                    <g key={`${x}-${idx}`}>
                      <path
                        d={p}
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={isMinimizer ? 4.8 : isProbe ? 4.2 : 1.7}
                        opacity={isMinimizer ? 0.96 : isProbe ? 0.88 : 0.18 + idx / (xFamily.length * 3.2)}
                        strokeDasharray={isMinimizer || isProbe ? "0" : "8 6"}
                      />
                    </g>
                  );
                })}

              {currentStep === 0 && (
                <path d={currentLxPath} fill="none" stroke="currentColor" strokeWidth="5" opacity="0.95" />
              )}

              {(currentStep === 1 || currentStep === 2) && (
                <path d={dualPath} fill="none" stroke="currentColor" strokeWidth="6" opacity="0.95" />
              )}

              {currentStep === 1 && showEnvelope && (
                <path d={envelopePath} fill="none" stroke="currentColor" strokeWidth="7" opacity="0.98" />
              )}

              {currentStep === 2 && (
                <>
                  <line
                    x1={PAD}
                    y1={mapY(pStar, gDomain[0], gDomain[1])}
                    x2={WIDTH - PAD}
                    y2={mapY(pStar, gDomain[0], gDomain[1])}
                    stroke="currentColor"
                    strokeWidth="2.5"
                    opacity="0.55"
                    strokeDasharray="8 6"
                  />
                  <text
                    x={WIDTH - PAD - 70}
                    y={mapY(pStar, gDomain[0], gDomain[1]) - 10}
                    className="fill-current text-xs"
                  >
                    p* = 1
                  </text>
                </>
              )}

              <circle
                cx={mapX(lambda, lDomain[0], lDomain[1])}
                cy={mapY(currentG, gDomain[0], gDomain[1])}
                r="7"
                fill="currentColor"
              />
              <circle
                cx={mapX(lambda, lDomain[0], lDomain[1])}
                cy={mapY(currentG, gDomain[0], gDomain[1])}
                r="11"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                opacity="0.9"
              />
              <line
                x1={mapX(lambda, lDomain[0], lDomain[1])}
                y1={mapY(currentG, gDomain[0], gDomain[1])}
                x2={mapX(lambda, lDomain[0], lDomain[1])}
                y2={HEIGHT - PAD}
                stroke="currentColor"
                strokeDasharray="6 6"
                opacity="0.45"
              />

              <text
                x={mapX(lambda, lDomain[0], lDomain[1]) + 10}
                y={mapY(currentG, gDomain[0], gDomain[1]) - 12}
                className="fill-current text-xs"
              >
                g({lambda.toFixed(2)}) = {currentG.toFixed(2)}
              </text>

              <text x={PAD + 12} y={PAD + 18} className="fill-current text-sm font-semibold">
                {currentStep === 0
                  ? "固定不同的 x，把 L(x,λ) 看成关于 λ 的函数，就得到一族仿射函数（直线）"
                  : currentStep === 1
                  ? `对每一个 λ，在所有直线中取最低值，得到 g(λ)=infₓL(x,λ)；当前决定下包络的 x 约为 ${minimizerXAtLambda.toFixed(
                      2
                    )}`
                  : "整条 g(λ) 曲线都在 p* 下方，因此提供原问题最优值的下界"}
              </text>
            </svg>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-[28px] border border-zinc-200 bg-white p-5 shadow-sm">
            <div className="mb-3 text-sm font-semibold">交互控制</div>
            <div className="space-y-5">
              <SliderControl label="当前 λ" min={0} max={4} step={0.02} value={lambda} onChange={setLambda} />
              <SliderControl label="高亮 x" min={0.2} max={4.8} step={0.02} value={xProbe} onChange={setXProbe} />
              <SliderControl
                label="仿射函数数量"
                min={3}
                max={14}
                step={1}
                value={curveCount}
                onChange={setCurveCount}
                format={(v) => String(Math.round(v))}
              />
              <SliderControl
                label="动画速度"
                min={0.4}
                max={1.8}
                step={0.1}
                value={animationSpeed}
                onChange={setAnimationSpeed}
                format={(v) => `${v.toFixed(1)}×`}
              />
              <Toggle label="显示逐点下确界" checked={showEnvelope} onChange={setShowEnvelope} />
              <Toggle label="显示板书推导" checked={showDerivation} onChange={setShowDerivation} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="rounded-[22px] border bg-white p-4">
              <div className="text-zinc-400">当前高亮 x</div>
              <div className="mt-1 text-2xl font-bold">{xProbe.toFixed(2)}</div>
            </div>
            <div className="rounded-[22px] border bg-white p-4">
              <div className="text-zinc-400">g(λ)</div>
              <div className="mt-1 text-2xl font-bold">{currentG.toFixed(2)}</div>
            </div>
            <div className="rounded-[22px] border bg-white p-4">
              <div className="text-zinc-400">当前最优 x*(λ)</div>
              <div className="mt-1 text-2xl font-bold">{minimizerXAtLambda.toFixed(2)}</div>
            </div>
            <div className="rounded-[22px] border bg-white p-4">
              <div className="text-zinc-400">关系</div>
              <div className="mt-1 text-lg font-bold">g(λ)=L(x*(λ),λ)</div>
            </div>
          </div>
        </div>
      </div>

      {showDerivation && (
        <div className="rounded-[28px] border border-zinc-200 bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-bold tracking-tight text-zinc-900">板书式推导区</h2>
          <p className="mt-1 text-sm leading-7 text-zinc-500">
            把图像和公式逐行对应起来，适合讲课。
          </p>

          <div className="mt-5 grid gap-4 xl:grid-cols-3">
            <div className="rounded-[24px] border border-amber-200 bg-gradient-to-br from-amber-50 to-white p-5">
              <div className="mb-3 text-sm font-semibold tracking-wide text-amber-700">问题设定</div>
              <div className="space-y-2 text-[15px] leading-8 text-zinc-800">
                <div>原问题：min f(x) = (x - 2)² + 1</div>
                <div>约束：x ≥ 1</div>
                <div>标准形式：h(x)=1-x ≤ 0</div>
                <div>L(x,λ)=f(x)+λh(x), λ ≥ 0</div>
              </div>
            </div>

            <div className="rounded-[24px] border border-amber-200 bg-gradient-to-br from-amber-50 to-white p-5">
              <div className="mb-3 text-sm font-semibold tracking-wide text-amber-700">
                核心证明：为什么 g(λ) 是 concave？
              </div>
              <AnimatedProof lines={proofLines} speed={1400} />
            </div>

            <div className="rounded-[24px] border border-amber-200 bg-gradient-to-br from-amber-50 to-white p-5">
              <div className="mb-3 text-sm font-semibold tracking-wide text-amber-700">关键结论</div>
              <div className="space-y-2 text-[15px] leading-8 text-zinc-800">
                <div>固定 x 时，L(x,λ) 对 λ 是仿射函数。</div>
                <div>g(λ)=infₓL(x,λ) 是仿射函数族的逐点下确界。</div>
                <div>因此 g(λ) 必为 concave。</div>
                <div>同时对任意可行 x，都有 g(λ) ≤ f(x)。</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
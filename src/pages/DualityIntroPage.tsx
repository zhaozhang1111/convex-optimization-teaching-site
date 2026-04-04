import { motion } from 'framer-motion';
import { BookOpen, ChevronLeft, ChevronRight, Pause, Play, RotateCcw, Sigma, Sparkles } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import AnimatedProof from '../components/AnimatedProof';
import MathCard from '../components/MathCard';
import RangeControl from '../components/RangeControl';

const WIDTH = 860;
const HEIGHT = 430;
const PAD = 58;

function linspace(start: number, end: number, n: number) {
  const out: number[] = [];
  for (let i = 0; i < n; i += 1) out.push(start + ((end - start) * i) / (n - 1));
  return out;
}

function mapX(x: number, xmin: number, xmax: number) {
  return PAD + ((x - xmin) / (xmax - xmin)) * (WIDTH - 2 * PAD);
}

function mapY(y: number, ymin: number, ymax: number) {
  return HEIGHT - PAD - ((y - ymin) / (ymax - ymin)) * (HEIGHT - 2 * PAD);
}

function pathFromFn(
  xs: number[],
  fn: (x: number) => number,
  xmin: number,
  xmax: number,
  ymin: number,
  ymax: number,
) {
  return xs
    .map((x, i) => `${i === 0 ? 'M' : 'L'}${mapX(x, xmin, xmax)},${mapY(fn(x), ymin, ymax)}`)
    .join(' ');
}

function envelopePath(
  pts: { x: number; y: number }[],
  xmin: number,
  xmax: number,
  ymin: number,
  ymax: number,
) {
  return pts
    .map((p, i) => `${i === 0 ? 'M' : 'L'}${mapX(p.x, xmin, xmax)},${mapY(p.y, ymin, ymax)}`)
    .join(' ');
}

function StepBadge({ active, index, title }: { active: boolean; index: number; title: string }) {
  return (
    <button className={`step-badge ${active ? 'step-badge-active' : ''}`} type="button">
      <div className="step-index">Step {index}</div>
      <div className="step-title">{title}</div>
    </button>
  );
}

function Toggle({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <button className={`toggle-row ${checked ? 'toggle-row-on' : ''}`} type="button" onClick={() => onChange(!checked)}>
      <span>{label}</span>
      <span className="toggle-pill">{checked ? 'ON' : 'OFF'}</span>
    </button>
  );
}

export default function DualityIntroPage() {
  const [step, setStep] = useState(0);
  const [autoPlay, setAutoPlay] = useState(false);
  const [lambda, setLambda] = useState(0.8);
  const [highlightX, setHighlightX] = useState(2.0);
  const [lineCount, setLineCount] = useState(9);
  const [animationSpeed, setAnimationSpeed] = useState(0.8);
  const [showEnvelope, setShowEnvelope] = useState(true);
  const [showConcavityProof, setShowConcavityProof] = useState(true);
  const [showLowerBound, setShowLowerBound] = useState(true);

  const lambdaDomain = [0, 4] as const;
  const valueDomain = [-8.2, 5.1] as const;

  const lambdas = useMemo(() => linspace(lambdaDomain[0], lambdaDomain[1], 260), []);

  const f = (x: number) => (x - 2) ** 2 + 1;
  const h = (x: number) => 1 - x;
  const L = (x: number, l: number) => f(x) + l * h(x);
  const dual = (l: number) => 1 - l - l * l / 4;
  const xStar = (l: number) => 2 + l / 2;
  const pStar = 1;

  useEffect(() => {
    if (!autoPlay) return undefined;
    const interval = Math.max(180, 780 / animationSpeed);
    const timer = window.setInterval(() => {
      setLambda((prev) => {
        const next = prev + 0.03;
        if (next > 4) return 0;
        return next;
      });
    }, interval);
    return () => window.clearInterval(timer);
  }, [autoPlay, animationSpeed]);

  const xFamily = useMemo(() => {
    const xs = linspace(0.2, 4.8, lineCount);
    const all = Array.from(new Set([...xs.map((x) => Number(x.toFixed(2))), Number(highlightX.toFixed(2))]));
    return all.sort((a, b) => a - b);
  }, [highlightX, lineCount]);

  const currentMinimizer = xStar(lambda);
  const currentG = dual(lambda);

  const lowerEnvelope = useMemo(() => {
    return lambdas.map((l) => ({ x: l, y: Math.min(...xFamily.map((x) => L(x, l))) }));
  }, [L, lambdas, xFamily]);

  const currentLinePath = pathFromFn(lambdas, (l) => L(highlightX, l), lambdaDomain[0], lambdaDomain[1], valueDomain[0], valueDomain[1]);
  const dualPath = pathFromFn(lambdas, dual, lambdaDomain[0], lambdaDomain[1], valueDomain[0], valueDomain[1]);
  const envelopeSvg = envelopePath(lowerEnvelope, lambdaDomain[0], lambdaDomain[1], valueDomain[0], valueDomain[1]);

  const steps = [
    '固定不同的 x，形成一族关于 λ 的仿射函数',
    '对仿射函数逐点取下确界，得到 concave 的 g(λ)',
    '利用可行性验证 g(λ) ≤ p* 的 lower bound',
  ];

  return (
    <div className="page-shell">
      <div className="hero-card">
        <div>
          <div className="hero-kicker"><BookOpen size={16} /> 拉格朗日对偶性图形化教学网站</div>
          <h1>Chapter 1 · Lagrangian Dual Function</h1>
          <p>
            这一版先把核心内容做扎实：固定不同的 x，得到一族关于 λ 的仿射函数；再对它们逐点取下确界，形成
            concave 的拉格朗日对偶函数 g(λ)。
          </p>
        </div>
        <div className="hero-actions">
          <button className="btn secondary" type="button" onClick={() => setStep((s) => Math.max(0, s - 1))}>
            <ChevronLeft size={16} /> 上一步
          </button>
          <button className="btn" type="button" onClick={() => setStep((s) => Math.min(2, s + 1))}>
            下一步 <ChevronRight size={16} />
          </button>
          <button className="btn secondary" type="button" onClick={() => setAutoPlay((v) => !v)}>
            {autoPlay ? <Pause size={16} /> : <Play size={16} />} {autoPlay ? '暂停动画' : '播放动画'}
          </button>
          <button
            className="btn ghost"
            type="button"
            onClick={() => {
              setStep(0);
              setAutoPlay(false);
              setLambda(0.8);
              setHighlightX(2.0);
              setLineCount(9);
              setAnimationSpeed(0.8);
            }}
          >
            <RotateCcw size={16} /> 重置
          </button>
        </div>
      </div>

      <div className="step-grid">
        {steps.map((title, i) => (
          <div key={i} onClick={() => setStep(i)}>
            <StepBadge active={step === i} index={i + 1} title={title} />
          </div>
        ))}
      </div>

      <div className="content-grid">
        <div className="panel main-panel">
          <div className="panel-header">
            <div>
              <div className="panel-kicker"><Sparkles size={16} /> 核心动态图</div>
              <h2>{steps[step]}</h2>
            </div>
          </div>

          <div className="plot-box">
            <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} className="plot-svg">
              {linspace(lambdaDomain[0], lambdaDomain[1], 6).map((t, i) => (
                <g key={`x-${i}`}>
                  <line x1={mapX(t, ...lambdaDomain)} y1={PAD} x2={mapX(t, ...lambdaDomain)} y2={HEIGHT - PAD} className="grid-line" />
                  <text x={mapX(t, ...lambdaDomain)} y={HEIGHT - PAD + 22} textAnchor="middle" className="axis-text">{t.toFixed(1)}</text>
                </g>
              ))}
              {linspace(valueDomain[0], valueDomain[1], 6).map((t, i) => (
                <g key={`y-${i}`}>
                  <line x1={PAD} y1={mapY(t, ...valueDomain)} x2={WIDTH - PAD} y2={mapY(t, ...valueDomain)} className="grid-line" />
                  <text x={PAD - 12} y={mapY(t, ...valueDomain) + 4} textAnchor="end" className="axis-text">{t.toFixed(1)}</text>
                </g>
              ))}
              <line x1={PAD} y1={mapY(0, ...valueDomain)} x2={WIDTH - PAD} y2={mapY(0, ...valueDomain)} className="axis-line" />
              <line x1={mapX(0, ...lambdaDomain)} y1={PAD} x2={mapX(0, ...lambdaDomain)} y2={HEIGHT - PAD} className="axis-line" />
              <text x={WIDTH - PAD + 12} y={mapY(0, ...valueDomain) + 4} className="axis-title">λ</text>
              <text x={mapX(0, ...lambdaDomain) + 8} y={PAD - 12} className="axis-title">L(x,λ), g(λ)</text>

              {xFamily.map((x, idx) => {
                const d = pathFromFn(lambdas, (l) => L(x, l), lambdaDomain[0], lambdaDomain[1], valueDomain[0], valueDomain[1]);
                const active = Math.abs(x - highlightX) < 0.08;
                const minimizerActive = Math.abs(x - currentMinimizer) < 0.16;
                return (
                  <g key={`${x}-${idx}`}>
                    <path
                      d={d}
                      fill="none"
                      className={minimizerActive && step >= 1 ? 'line-family line-minimizer' : active ? 'line-family line-highlight' : 'line-family'}
                      style={{ opacity: active || minimizerActive ? 1 : 0.28 + idx / (xFamily.length * 5) }}
                    />
                    {idx < 5 && (
                      <text x={mapX(3.7, ...lambdaDomain)} y={mapY(L(x, 3.7), ...valueDomain) - 4} className="line-label">
                        x={x.toFixed(1)}
                      </text>
                    )}
                  </g>
                );
              })}

              <path d={currentLinePath} fill="none" className="line-highlight-strong" />

              {showEnvelope && step >= 1 && <path d={envelopeSvg} fill="none" className="envelope-line" />}
              {step >= 1 && <path d={dualPath} fill="none" className="dual-line" />}

              {step >= 1 && (
                <>
                  <circle cx={mapX(lambda, ...lambdaDomain)} cy={mapY(currentG, ...valueDomain)} r="6.8" className="point-core" />
                  <circle cx={mapX(lambda, ...lambdaDomain)} cy={mapY(currentG, ...valueDomain)} r="11" className="point-ring" />
                  <line
                    x1={mapX(lambda, ...lambdaDomain)}
                    y1={mapY(currentG, ...valueDomain)}
                    x2={mapX(lambda, ...lambdaDomain)}
                    y2={HEIGHT - PAD}
                    className="guide-line"
                  />
                  <text x={mapX(lambda, ...lambdaDomain) + 10} y={mapY(currentG, ...valueDomain) - 14} className="callout-text">
                    g({lambda.toFixed(2)}) = {currentG.toFixed(2)}
                  </text>
                  <text x={mapX(lambda, ...lambdaDomain) + 10} y={mapY(currentG, ...valueDomain) + 6} className="callout-text-small">
                    attained by x*({lambda.toFixed(2)}) ≈ {currentMinimizer.toFixed(2)}
                  </text>
                </>
              )}

              {step === 1 && showConcavityProof && (
                <foreignObject x={mapX(0.18, ...lambdaDomain)} y={mapY(2.2, ...valueDomain)} width="372" height="154">
                  <div className="proof-on-plot">
                    <div className="proof-on-plot-title">Proof on the graph</div>
                    <div>g(θλ₁+(1-θ)λ₂) = infₓ L(x, θλ₁+(1-θ)λ₂)</div>
                    <div>= infₓ [θL(x,λ₁)+(1-θ)L(x,λ₂)]</div>
                    <div>≥ θ infₓL(x,λ₁) + (1-θ) infₓL(x,λ₂)</div>
                    <div>= θg(λ₁)+(1-θ)g(λ₂)</div>
                    <div className="proof-on-plot-strong">所以 g(λ) 是 concave function</div>
                  </div>
                </foreignObject>
              )}

              {step === 2 && showLowerBound && (
                <>
                  <line x1={PAD} y1={mapY(pStar, ...valueDomain)} x2={WIDTH - PAD} y2={mapY(pStar, ...valueDomain)} className="bound-line" />
                  <text x={WIDTH - PAD - 72} y={mapY(pStar, ...valueDomain) - 10} className="callout-text">p* = 1</text>
                </>
              )}
            </svg>
          </div>

          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} key={step} className="explain-strip">
            {step === 0 && '先固定不同的 x，把 L(x,λ) 看成 λ 的函数。每一个固定 x 都对应一条仿射函数。'}
            {step === 1 && `再对每个 λ 逐点取最小值。当前 λ=${lambda.toFixed(2)} 时，决定下包络的 x 约为 ${currentMinimizer.toFixed(2)}。`}
            {step === 2 && '对任意可行点都有 L(x,λ)≤f(x)，所以 g(λ)≤p*，这就是对偶下界。'}
          </motion.div>
        </div>

        <div className="panel side-panel">
          <div className="side-stack">
            <div className="side-card">
              <div className="side-card-title">交互控制</div>
              <RangeControl label="当前 λ" min={0} max={4} step={0.02} value={lambda} onChange={setLambda} />
              <RangeControl label="高亮 x" min={0.2} max={4.8} step={0.02} value={highlightX} onChange={setHighlightX} />
              <RangeControl label="仿射函数数量" min={3} max={14} step={1} value={lineCount} onChange={setLineCount} formatter={(v) => `${Math.round(v)}`} />
              <RangeControl label="动画速度" min={0.4} max={1.6} step={0.1} value={animationSpeed} onChange={setAnimationSpeed} formatter={(v) => `${v.toFixed(1)}×`} />
              <Toggle checked={showEnvelope} onChange={setShowEnvelope} label="显示逐点下确界" />
              <Toggle checked={showConcavityProof} onChange={setShowConcavityProof} label="图上显示 concave 证明" />
              <Toggle checked={showLowerBound} onChange={setShowLowerBound} label="显示 lower bound 参考线" />
            </div>

            <div className="metric-grid">
              <div className="metric-card">
                <div className="metric-label">当前高亮 x</div>
                <div className="metric-value">{highlightX.toFixed(2)}</div>
              </div>
              <div className="metric-card">
                <div className="metric-label">g(λ)</div>
                <div className="metric-value">{currentG.toFixed(2)}</div>
              </div>
              <div className="metric-card">
                <div className="metric-label">x*(λ)</div>
                <div className="metric-value">{currentMinimizer.toFixed(2)}</div>
              </div>
              <div className="metric-card">
                <div className="metric-label">关系</div>
                <div className="metric-value metric-value-small">g(λ)=L(x*(λ),λ)</div>
              </div>
            </div>

            <MathCard title="问题设定">
              <div>Primal: minimize f(x) = (x - 2)² + 1</div>
              <div>subject to x ≥ 1</div>
              <div>Rewrite: h(x) = 1 - x ≤ 0</div>
              <div>L(x,λ)=f(x)+λh(x), λ≥0</div>
            </MathCard>

            <MathCard title="第 1 步：一族仿射函数">
              <div>固定 x 时：</div>
              <div>L(x,λ) = (x - 2)² + 1 + λ(1 - x)</div>
              <div>因此它关于 λ 是 affine function。</div>
            </MathCard>

            <MathCard title="第 2 步：为什么 g(λ) 是 concave？">
              <div>g(λ)=infₓL(x,λ)</div>
              <AnimatedProof speed={animationSpeed} />
            </MathCard>

            <MathCard title="第 3 步：lower bound">
              <div>对任意可行 x，1-x≤0 且 λ≥0</div>
              <div>所以 λ(1-x)≤0</div>
              <div>L(x,λ)=f(x)+λ(1-x)≤f(x)</div>
              <div>因此 g(λ)=infₓL(x,λ)≤p*</div>
            </MathCard>
          </div>
        </div>
      </div>
    </div>
  );
}

import { BookOpen, CheckCircle2, Compass, Sigma, Target } from 'lucide-react';
import MathCard from '../components/MathCard';

const kktItems = [
  {
    title: '1. Primal feasibility',
    text: '原问题约束必须满足。本例中要求 x ≥ 1。',
  },
  {
    title: '2. Dual feasibility',
    text: '拉格朗日乘子必须满足 λ ≥ 0。',
  },
  {
    title: '3. Stationarity',
    text: '在最优点处，拉格朗日函数对决策变量的一阶导数为 0。',
  },
  {
    title: '4. Complementary slackness',
    text: 'λ(1-x)=0。约束不紧时乘子为 0；乘子发力时约束必须是紧的。',
  },
];

export default function KKTPage() {
  return (
    <div className="page-shell">
      <div className="hero-card">
        <div>
          <div className="hero-kicker"><Target size={16} /> KKT 条件教学页面</div>
          <h1>Chapter 2 · KKT Conditions</h1>
          <p>
            这一页先把 KKT 条件讲清楚：先记住四条最优性条件，再把它们与本例
            min (x-2)²+1, subject to x ≥ 1 联系起来。
          </p>
        </div>
      </div>

      <div className="kkt-grid">
        <div className="panel">
          <div className="panel-header">
            <div>
              <div className="panel-kicker"><Sigma size={16} /> KKT 的四条核心条件</div>
              <h2>从定义到直觉</h2>
            </div>
          </div>

          <div className="kkt-cards">
            {kktItems.map((item) => (
              <div key={item.title} className="kkt-card">
                <div className="kkt-card-title"><CheckCircle2 size={16} /> {item.title}</div>
                <div className="kkt-card-text">{item.text}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="panel side-panel">
          <div className="side-stack">
            <MathCard title="一句话理解">
              <div>原问题可行：解不能违反约束。</div>
              <div>对偶可行：乘子要满足符号限制。</div>
              <div>驻点条件：目标和约束平衡后，一阶导数归零。</div>
              <div>互补松弛：约束不紧时，乘子不能发力。</div>
            </MathCard>

            <MathCard title="本例中的 KKT">
              <div>Primal feasibility: x ≥ 1</div>
              <div>Dual feasibility: λ ≥ 0</div>
              <div>Stationarity: ∂L/∂x = 2(x-2)-λ = 0</div>
              <div>Complementary slackness: λ(1-x)=0</div>
            </MathCard>

            <MathCard title="教学提示">
              <div>先让学生背下四条条件。</div>
              <div>再用本例验证 x*=2, λ*=0 满足全部 KKT 条件。</div>
              <div>下一章就可以自然过渡到 Strong Duality。</div>
            </MathCard>
          </div>
        </div>
      </div>

      <div className="panel kkt-bottom-panel">
        <div className="panel-header">
          <div>
            <div className="panel-kicker"><BookOpen size={16} /> 课堂串讲顺序</div>
            <h2>推荐讲法</h2>
          </div>
        </div>
        <div className="explain-strip">
          先讲 primal feasibility 与 dual feasibility，告诉学生“解和乘子都要合法”；
          再讲 stationarity，说明最优点处目标与约束作用平衡；最后讲 complementary slackness，
          让学生理解“约束不紧时，乘子不发力；乘子发力时，约束一定是紧的”。
        </div>
      </div>
    </div>
  );
}

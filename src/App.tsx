import { BookOpen, Sigma } from 'lucide-react';
import { useState } from 'react';
import DualityIntroPage from './pages/DualityIntroPage';
import KKTPage from './pages/KKTPage';

function NavButton({
  active,
  label,
  onClick,
}: {
  active: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button type="button" onClick={onClick} className={`top-nav-btn ${active ? 'top-nav-btn-active' : ''}`}>
      {label}
    </button>
  );
}

export default function App() {
  const [page, setPage] = useState<'dual' | 'kkt'>('dual');

  return (
    <>
      <div className="site-top-shell">
        <div className="site-top-card">
          <div>
            <div className="site-top-kicker">Convex Optimization Visual Teaching Website</div>
            <h1>凸优化可视化教学网站</h1>
            <p>
              先把视觉风格统一下来，再逐页增加内容。当前已经包括 Dual Function 与 KKT Conditions。
            </p>
          </div>
          <div className="site-top-actions">
            <NavButton active={page === 'dual'} label="Chapter 1 · Dual Function" onClick={() => setPage('dual')} />
            <NavButton active={page === 'kkt'} label="Chapter 2 · KKT Conditions" onClick={() => setPage('kkt')} />
          </div>
        </div>
      </div>

      {page === 'dual' ? <DualityIntroPage /> : <KKTPage />}
    </>
  );
}

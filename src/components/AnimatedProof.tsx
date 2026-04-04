import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

type Props = {
  speed?: number;
};

const lines = [
  'g(θλ₁ + (1-θ)λ₂) = infₓ L(x, θλ₁ + (1-θ)λ₂)',
  '= infₓ [θL(x, λ₁) + (1-θ)L(x, λ₂)]',
  '≥ θ infₓ L(x, λ₁) + (1-θ) infₓ L(x, λ₂)',
  '= θ g(λ₁) + (1-θ) g(λ₂)',
  '因此，g(λ) 是 concave function。',
];

export default function AnimatedProof({ speed = 1 }: Props) {
  const [visible, setVisible] = useState(1);

  useEffect(() => {
    setVisible(1);
    const interval = Math.max(900, 1700 / speed);
    const timer = window.setInterval(() => {
      setVisible((v) => (v < lines.length ? v + 1 : v));
    }, interval);
    return () => window.clearInterval(timer);
  }, [speed]);

  return (
    <div className="proof-lines">
      {lines.map((line, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0.15, x: -10 }}
          animate={{
            opacity: i < visible ? 1 : 0.16,
            x: i < visible ? 0 : -10,
          }}
          transition={{ duration: 0.45 }}
          className={`proof-line ${i === visible - 1 ? 'proof-line-active' : ''} ${i === 2 ? 'proof-line-key' : ''}`}
        >
          {line}
        </motion.div>
      ))}
    </div>
  );
}

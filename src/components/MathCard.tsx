import { ReactNode } from 'react';

type Props = {
  title: string;
  children: ReactNode;
};

export default function MathCard({ title, children }: Props) {
  return (
    <div className="math-card">
      <div className="math-card-title">{title}</div>
      <div className="math-card-content">{children}</div>
    </div>
  );
}

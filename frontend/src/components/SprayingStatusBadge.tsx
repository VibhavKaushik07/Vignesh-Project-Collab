import React from 'react';
import { CheckCircle2, AlertTriangle, XCircle } from 'lucide-react';

interface Props {
  status: 'Optimal' | 'Moderate' | 'Unsuitable' | string;
  size?: 'sm' | 'md' | 'lg';
}

export const SprayingStatusBadge: React.FC<Props> = ({ status, size = 'md' }) => {
  const s = (status || '').toLowerCase();

  let bg = 'bg-emerald-100 text-emerald-800 border-emerald-300';
  let icon = <CheckCircle2 className="w-4 h-4 text-emerald-600" />;
  let label = 'Optimal Spraying Window';

  if (s.includes('moderat') || s.includes('caution')) {
    bg = 'bg-amber-100 text-amber-900 border-amber-300';
    icon = <AlertTriangle className="w-4 h-4 text-amber-600" />;
    label = 'Exercise Caution (Moderate)';
  } else if (s.includes('unsuitable') || s.includes('danger') || s.includes('not recommended')) {
    bg = 'bg-rose-100 text-rose-900 border-rose-300';
    icon = <XCircle className="w-4 h-4 text-rose-600" />;
    label = 'Unsuitable for Spraying';
  }

  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-xs' : size === 'lg' ? 'px-4 py-2 text-base' : 'px-3 py-1.5 text-sm';

  return (
    <div className={`inline-flex items-center gap-2 rounded-lg font-medium border shadow-xs ${bg} ${sizeClasses}`}>
      {icon}
      <span>{label}</span>
    </div>
  );
};

import React from 'react';
import { AlertTriangle, ShieldCheck, AlertCircle, Skull } from 'lucide-react';

interface Props {
  band: string;
  showDetails?: boolean;
}

export const ToxicityBadge: React.FC<Props> = ({ band, showDetails = false }) => {
  const b = (band || '').toLowerCase();

  let bgColor = 'bg-emerald-50 text-emerald-800 border-emerald-300';
  let triangleColor = 'bg-emerald-500';
  let label = 'Green (Slightly Toxic)';
  let icon = <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />;

  if (b.includes('blue')) {
    bgColor = 'bg-sky-50 text-sky-800 border-sky-300';
    triangleColor = 'bg-sky-500';
    label = 'Blue (Moderately Toxic)';
    icon = <AlertCircle className="w-3.5 h-3.5 text-sky-600" />;
  } else if (b.includes('yellow')) {
    bgColor = 'bg-amber-50 text-amber-800 border-amber-300';
    triangleColor = 'bg-amber-500';
    label = 'Yellow (Highly Toxic)';
    icon = <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />;
  } else if (b.includes('red')) {
    bgColor = 'bg-rose-50 text-rose-800 border-rose-300';
    triangleColor = 'bg-rose-600';
    label = 'Red (Extremely Toxic)';
    icon = <Skull className="w-3.5 h-3.5 text-rose-600" />;
  }

  return (
    <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${bgColor}`}>
      <span className={`w-2.5 h-2.5 rounded-sm transform rotate-45 ${triangleColor}`} />
      {icon}
      <span>{showDetails ? label : `${band} Triangle`}</span>
    </div>
  );
};

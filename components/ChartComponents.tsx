import React from 'react';
import { Crown } from 'lucide-react';

export const CustomTick = (props: any) => {
  const { x, y, payload } = props;
  
  return (
    <g transform={`translate(${x},${y})`}>
      <text 
        x={0} 
        y={0} 
        dy={16} 
        textAnchor="middle" 
        fill="#94a3b8" 
        fontSize={14}
        fontWeight="bold"
      >
        {payload.value}
      </text>
    </g>
  );
};

export const CustomBarLabel = (props: any) => {
  const { x, y, width, value, maxScore } = props;

  // Logic: Is this team the winner (or tied for winner)?
  const isWinner = value === maxScore && value > 0;
  
  return (
    <g>
      {isWinner && (
        <foreignObject x={x + width / 2 - 20} y={y - 45} width={40} height={40}>
            <div className="animate-bounce">
                <Crown className="text-yellow-400 fill-yellow-400 w-10 h-10 drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]" />
            </div>
        </foreignObject>
      )}
      <text
        x={x + width / 2}
        y={y - 10}
        fill="#f8fafc" // Always light text (slate-50) for contrast against dark bg
        textAnchor="middle"
        fontSize={18}
        fontWeight="bold"
        style={{ filter: 'drop-shadow(0px 1px 2px rgba(0,0,0,0.5))' }}
      >
        {value}
      </text>
    </g>
  );
};
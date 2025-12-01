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
        <foreignObject x={x + width / 2 - 16} y={y - 36} width={32} height={32}>
            <div className="animate-bounce">
                <Crown className="text-yellow-500 fill-yellow-500 w-8 h-8 drop-shadow-lg" />
            </div>
        </foreignObject>
      )}
      <text
        x={x + width / 2}
        y={y - 10}
        fill={isWinner ? "#ffb74d" : "#e2e8f0"}
        textAnchor="middle"
        fontSize={18}
        fontWeight="bold"
      >
        {value}
      </text>
    </g>
  );
};
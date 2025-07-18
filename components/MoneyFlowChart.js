import React, { useState, useCallback, useEffect, useRef } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Sector } from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';

// Sample data - replace with actual data from your backend
const moneyInData = [
  { name: 'Salary', value: 5000, color: 'var(--chart-1)' },
  { name: 'Investments', value: 2000, color: 'var(--chart-2)' },
  { name: 'Freelance', value: 1500, color: 'var(--chart-3)' },
  { name: 'Other', value: 500, color: 'var(--chart-4)' },
];

const moneyOutData = [
  { name: 'Bills', value: 1200, color: 'var(--destructive)' },
  { name: 'Shopping', value: 800, color: 'var(--chart-2)' },
  { name: 'Food', value: 600, color: 'var(--chart-3)' },
  { name: 'Transport', value: 400, color: 'var(--chart-4)' },
  { name: 'Other', value: 300, color: 'var(--chart-5)' },
];

const renderActiveShape = (props) => {
  const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill } = props;
  
  return (
    <g>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius + 10} // Add 10px to make it move outward
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
        style={{
          filter: `url(#glow)`,
          transition: 'all 0.2s ease-out',
        }}
      />
    </g>
  );
};

const getTooltipPosition = (index, total) => {
  // Calculate fixed positions for tooltips based on index
  const positions = [
    { x: -160, y: -20 },  // Left position (blue)
    { x: 40, y: -120 },   // Top position (pink)
    { x: 160, y: -20 },   // Right position (purple)
    { x: 40, y: 120 }     // Bottom position (green)
  ];
  
  // Use modulo to cycle through positions if there are more segments than positions
  return positions[index % positions.length];
};

export default function MoneyFlowChart() {
  const [flowType, setFlowType] = useState('in');
  const [activeIndex, setActiveIndex] = useState(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const chartRef = useRef(null);
  const data = flowType === 'in' ? moneyInData : moneyOutData;
  
  // Calculate total and percentages
  const total = data.reduce((sum, item) => sum + item.value, 0);
  const dataWithPercentages = data.map(item => ({
    ...item,
    percentage: (item.value / total) * 100
  }));

  const clearActiveState = useCallback(() => {
    setActiveIndex(null);
    setTooltipPosition({ x: 0, y: 0 });
  }, []);

  const onPieEnter = useCallback((data, index) => {
    if (!data) return;
    setActiveIndex(index);
    
    // Use fixed positions instead of calculating from angles
    const position = getTooltipPosition(index, dataWithPercentages.length);
    setTooltipPosition(position);
  }, [dataWithPercentages.length]);

  // Add global mouse move handler
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!chartRef.current) return;
      
      const chartBounds = chartRef.current.getBoundingClientRect();
      const isInsideChart = 
        e.clientX >= chartBounds.left &&
        e.clientX <= chartBounds.right &&
        e.clientY >= chartBounds.top &&
        e.clientY <= chartBounds.bottom;

      if (!isInsideChart) {
        clearActiveState();
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [clearActiveState]);

  return (
    <div 
      className="bg-card rounded-3xl p-4 h-full"
      ref={chartRef}
    >
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold text-card-foreground">Money Flow</h3>
        <div className="flex gap-2">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setFlowType('in')}
            className={`px-2.5 py-1 rounded-lg text-sm font-medium transition-all duration-200 ${
              flowType === 'in'
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground hover:text-foreground hover:bg-muted/80'
            }`}
          >
            Money In
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setFlowType('out')}
            className={`px-2.5 py-1 rounded-lg text-sm font-medium transition-all duration-200 ${
              flowType === 'out'
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground hover:text-foreground hover:bg-muted/80'
            }`}
          >
            Money Out
          </motion.button>
        </div>
      </div>

      <div className="relative h-[220px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart onMouseLeave={clearActiveState}>
            <defs>
              <filter id="glow" height="200%" width="200%" x="-50%" y="-50%">
                <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                <feMerge>
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
              {dataWithPercentages.map((entry, index) => (
                <filter
                  key={`shadow-${index}`}
                  id={`shadow-${index}`}
                  x="-50%"
                  y="-50%"
                  width="200%"
                  height="200%"
                >
                  <feOffset dx="0" dy="2" />
                  <feGaussianBlur stdDeviation="2" />
                  <feComposite operator="out" in="SourceGraphic" />
                  <feColorMatrix
                    type="matrix"
                    values="0 0 0 0 0   0 0 0 0 0   0 0 0 0 0  0 0 0 0.1 0"
                  />
                  <feBlend in="SourceGraphic" />
                </filter>
              ))}
            </defs>
            <Pie
              data={dataWithPercentages}
              cx="50%"
              cy="50%"
              innerRadius={45}
              outerRadius={75}
              paddingAngle={2}
              dataKey="value"
              startAngle={90}
              endAngle={450}
              activeShape={renderActiveShape}
              activeIndex={activeIndex}
              isAnimationActive={true}
              animationBegin={0}
              animationDuration={400}
              animationEasing="ease"
            >
              {dataWithPercentages.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry.color}
                  style={{
                    filter: activeIndex === index ? `url(#glow)` : `url(#shadow-${index})`,
                    transition: 'all 0.2s ease-out',
                    cursor: 'pointer',
                    transform: `scale(${activeIndex === index ? 1.02 : 1})`,
                    transformOrigin: 'center',
                    transformBox: 'fill-box',
                  }}
                  onMouseEnter={(e) => {
                    e.stopPropagation();
                    onPieEnter(entry, index);
                  }}
                  onMouseLeave={(e) => {
                    e.stopPropagation();
                    clearActiveState();
                  }}
                />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>

        {/* Hover Details Box */}
        <AnimatePresence initial={false} mode="wait" onExitComplete={() => clearActiveState()}>
          {activeIndex !== null && (
            <motion.div
              key={`tooltip-${activeIndex}`}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ 
                opacity: 1, 
                scale: 1,
                transition: {
                  type: "spring",
                  stiffness: 300,
                  damping: 20,
                  duration: 0.2
                }
              }}
              exit={{ 
                opacity: 0, 
                scale: 0.95,
                transition: { 
                  duration: 0.1,
                  ease: "easeOut"
                } 
              }}
              className="absolute bg-white border border-gray-200 rounded-lg p-2.5 shadow-lg pointer-events-none"
              style={{
                left: `calc(50% + ${tooltipPosition.x}px)`,
                top: `calc(50% + ${tooltipPosition.y}px)`,
                transform: 'translate(-50%, -50%)',
                zIndex: 10,
                minWidth: '140px'
              }}
            >
              <motion.div 
                className="flex items-center gap-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.1 }}
              >
                <div
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: dataWithPercentages[activeIndex].color }}
                />
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {dataWithPercentages[activeIndex].name}
                  </p>
                  <p className="text-xs text-gray-600">
                    RM {dataWithPercentages[activeIndex].value.toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-500">
                    {dataWithPercentages[activeIndex].percentage.toFixed(1)}%
                  </p>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
} 
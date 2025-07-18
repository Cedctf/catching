import { motion } from 'framer-motion';

export default function SimpleBarChart({ data, title, formatValue }) {
  if (!data || data.length === 0) {
    return (
      <div className="text-center text-gray-500 py-8">No data available</div>
    );
  }

  const maxValue = Math.max(...data.map(d => d.value));

  return (
    <div className="grid gap-2 -mb-2" style={{ gridTemplateColumns: `repeat(${data.length}, 1fr)` }}>
      {data.map((item, index) => {
        const height = maxValue > 0 ? (item.value / maxValue) * 100 : 0;
        return (
          <div key={index} className="text-center">
            <div className="h-24 flex items-end justify-center mb-1">
              <motion.div 
                className="bg-[#002fa7] w-8 rounded-t transition-all duration-300 hover:bg-[#002fa7]/90 cursor-pointer"
                style={{ height: `${Math.max(height, 5)}%` }}
                title={`${item.label}: ${formatValue ? formatValue(item.value) : item.value}`}
                initial={{ height: 0, scaleY: 0 }}
                animate={{ 
                  height: `${Math.max(height, 5)}%`,
                  scaleY: 1
                }}
                transition={{ 
                  duration: 0.8,
                  delay: index * 0.1,
                  ease: "easeOut"
                }}
                whileHover={{ 
                  scale: 1.05,
                  transition: { duration: 0.2 }
                }}
              />
            </div>
            <motion.div 
              className="text-xs text-gray-600"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: index * 0.1 + 0.5 }}
            >
              {item.label}
            </motion.div>
            <motion.div 
              className="text-xs font-medium text-gray-900"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: index * 0.1 + 0.6 }}
            >
              {formatValue ? formatValue(item.value) : item.value}
            </motion.div>
          </div>
        );
      })}
    </div>
  );
}
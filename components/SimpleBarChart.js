export default function SimpleBarChart({ data, title, formatValue }) {
  if (!data || data.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">{title}</h3>
        <div className="text-center text-gray-500 py-8">No data available</div>
      </div>
    );
  }

  const maxValue = Math.max(...data.map(d => d.value));

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold mb-4">{title}</h3>
      <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${data.length}, 1fr)` }}>
        {data.map((item, index) => {
          const height = maxValue > 0 ? (item.value / maxValue) * 100 : 0;
          return (
            <div key={index} className="text-center">
              <div className="h-32 flex items-end justify-center mb-2">
                <div 
                  className="bg-blue-500 w-8 rounded-t transition-all duration-300 hover:bg-blue-600"
                  style={{ height: `${Math.max(height, 5)}%` }}
                  title={`${item.label}: ${formatValue ? formatValue(item.value) : item.value}`}
                ></div>
              </div>
              <div className="text-xs text-gray-600 mb-1">
                {item.label}
              </div>
              <div className="text-xs font-medium text-gray-900">
                {formatValue ? formatValue(item.value) : item.value}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
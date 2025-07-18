export default function AnalyticsCard({ title, value, subtitle, icon, color = "gray" }) {
  const colorClasses = {
    green: "bg-green-100 text-green-600",
    blue: "bg-blue-100 text-blue-600", 
    purple: "bg-purple-100 text-purple-600",
    yellow: "bg-yellow-100 text-yellow-600",
    red: "bg-red-100 text-red-600",
    gray: "bg-gray-100 text-gray-600"
  };

  const valueColorClasses = {
    green: "text-green-600",
    blue: "text-blue-600",
    purple: "text-purple-600", 
    yellow: "text-yellow-600",
    red: "text-red-600",
    gray: "text-gray-900"
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center">
        <div className={`p-2 rounded-lg ${colorClasses[color]}`}>
          <span className="text-2xl">{icon}</span>
        </div>
        <div className="ml-4">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className={`text-2xl font-bold ${valueColorClasses[color]}`}>{value}</p>
          {subtitle && (
            <p className="text-xs text-gray-500">{subtitle}</p>
          )}
        </div>
      </div>
    </div>
  );
}
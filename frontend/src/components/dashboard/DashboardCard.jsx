const DashboardCard = ({
  title,
  value,
  color,
  icon,
}) => {
  return (
    <div
      className="
      rounded-2xl
      p-6
      bg-slate-900
      border
      border-slate-800
      hover:border-cyan-500
      transition
      shadow-lg"
    >
      <div className="flex justify-between items-center">

        <div>

          <p className="text-slate-400 text-sm">
            {title}
          </p>

          <h2 className="text-4xl font-bold mt-3 text-white">
            {value}
          </h2>

        </div>

        <div
          className={`w-14 h-14 rounded-xl flex items-center justify-center ${color}`}
        >
          {icon}
        </div>

      </div>
    </div>
  );
};

export default DashboardCard;
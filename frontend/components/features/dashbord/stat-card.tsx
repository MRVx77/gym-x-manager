type StatCardProps = {
  label: string;
  value: string | number;
  accent?: "default" | "warning" | "danger";
};

export function StatCard({ label, value, accent = "default" }: StatCardProps) {
  const accentColor = {
    default: "text-white",
    warning: "text-yellow-400",
    danger: "text-red-400",
  }[accent];

  return (
    <div className="bg-white/5 rounded-xl p-4 border border-white/10">
      <p className="text-sm font-medium text-white/60">{label}</p>
      <p className={`text-3xl font-bold ${accentColor}`}>{value}</p>
    </div>
  );
}

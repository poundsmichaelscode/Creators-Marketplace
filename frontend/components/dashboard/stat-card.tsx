export function StatCard({ title, value, hint }: { title: string; value: string | number; hint?: string }) {
  return (
    <div className="card p-5">
      <p className="text-sm text-slate-400">{title}</p>
      <p className="mt-2 text-3xl font-semibold">{value}</p>
      {hint ? <p className="mt-2 text-xs text-slate-500">{hint}</p> : null}
    </div>
  );
}

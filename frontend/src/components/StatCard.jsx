export default function StatCard({ icon: Icon, label, value, accent = false }) {
  return (
    <div className="bg-secondary rounded-[16px] p-6 border border-white/10">
      <div className="flex items-center justify-between mb-3">
        <div className="w-10 h-10 rounded-[12px] bg-primary/20 flex items-center justify-center">
          <Icon size={20} className="text-primary" />
        </div>
      </div>
      <p className={`text-3xl font-bold mb-1 ${accent ? 'text-accent' : 'text-white'}`}>
        {value}
      </p>
      <p className="text-slate-400 text-sm">{label}</p>
    </div>
  );
}
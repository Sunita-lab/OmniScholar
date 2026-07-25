import { ClipboardList } from 'lucide-react';

const statusStyle = {
  submitted: 'bg-primary/15 text-primary',
  late: 'bg-warning/15 text-warning',
  graded: 'bg-success/15 text-success',
  pending: 'bg-slate-500/15 text-slate-400',
};

export default function AssignmentCard({ title, courseName, deadline, status, onClick }) {
  const daysLeft = Math.ceil((new Date(deadline) - new Date()) / (1000 * 60 * 60 * 24));

  return (
    <div
      onClick={onClick}
      className="bg-surface rounded-[16px] border border-border p-5 cursor-pointer hover:border-primary/40 hover:-translate-y-0.5 transition-all duration-200"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="w-10 h-10 rounded-[12px] bg-primary/10 flex items-center justify-center">
          <ClipboardList size={18} className="text-primary" />
        </div>
        <span className={`text-xs font-medium px-2.5 py-1 rounded-full capitalize ${statusStyle[status]}`}>
          {status}
        </span>
      </div>
      <h3 className="font-semibold text-text-primary mb-1 line-clamp-2">{title}</h3>
      <p className="text-text-secondary text-sm mb-3">{courseName}</p>
      <p className="text-xs text-text-secondary">
        {daysLeft < 0 ? 'Deadline passed' : daysLeft === 0 ? 'Due today' : `${daysLeft} days left`}
      </p>
    </div>
  );
}
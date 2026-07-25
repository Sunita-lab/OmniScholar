import { useState, useEffect } from 'react';
import { BookOpen, ClipboardList, Award, Flame, Clock, CheckCircle2, FileText } from 'lucide-react';
import api from '../lib/api';

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return { text: 'Good Morning', emoji: '🌅' };
  if (hour < 17) return { text: 'Good Afternoon', emoji: '☀️' };
  return { text: 'Good Evening', emoji: '🌙' };
};

const getDaysLeft = (deadline) => {
  const diff = Math.ceil((new Date(deadline) - new Date()) / (1000 * 60 * 60 * 24));
  if (diff < 0) return { label: 'Overdue', color: 'bg-error/20 text-error' };
  if (diff === 0) return { label: 'Due Today', color: 'bg-error/20 text-error' };
  if (diff === 1) return { label: 'Tomorrow', color: 'bg-warning/20 text-warning' };
  return { label: `${diff} days`, color: 'bg-primary/20 text-primary' };
};

export default function StudentDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const greeting = getGreeting();

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const { data } = await api.get('/dashboard/student');
        setStats(data);
      } catch (error) {
        console.error('Failed to load dashboard', error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading) return <p className="text-text-secondary">Loading dashboard...</p>;
  if (!stats) return <p className="text-error">Failed to load dashboard. Please try refreshing.</p>;

  return (
    <div className="space-y-6">
      {/* Greeting */}
      <div>
        <h1 className="text-4xl font-bold text-text-primary mb-1">
          {greeting.text} {greeting.emoji}
        </h1>
        <p className="text-text-secondary">Continue building your knowledge today.</p>
      </div>

      {/* Quick Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <QuickStat icon={BookOpen} label="Enrolled Courses" value={stats.enrolledCoursesCount} />
        <QuickStat icon={ClipboardList} label="Pending" value={stats.pendingAssignmentsCount} />
        <QuickStat icon={Award} label="Graded" value={stats.gradeOverview.length} accent />
        <QuickStat icon={Flame} label="Submitted" value={stats.submittedAssignmentsCount} />
      </div>

      {/* Main Grid: Assignments + Recent Grades */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Assignments Widget */}
        <div className="lg:col-span-2 bg-secondary rounded-[16px] p-6 border border-white/10 hover:border-primary/20 transition-colors">
          <div className="flex items-center gap-2 mb-5">
            <ClipboardList size={18} className="text-primary" />
            <h3 className="text-white font-semibold text-lg">Upcoming Assignments</h3>
          </div>
          {stats.pendingAssignments.length === 0 ? (
            <div className="text-center py-6">
              <CheckCircle2 size={32} className="text-primary mx-auto mb-2" />
              <p className="text-slate-400 text-sm">You're all caught up!</p>
            </div>
          ) : (
            <div className="space-y-1">
              {stats.pendingAssignments.map((a) => {
                const badge = getDaysLeft(a.deadline);
                return (
                  <div
                    key={a._id}
                    className="flex items-center justify-between py-3 border-b border-white/5 last:border-0"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-[10px] bg-white/5 flex items-center justify-center">
                        <FileText size={15} className="text-slate-400" />
                      </div>
                      <p className="text-white text-sm font-medium">{a.title}</p>
                    </div>
                    <span className={`text-xs font-medium font-mono px-2.5 py-1 rounded-full ${badge.color}`}>
                      {badge.label}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Recent Grades */}
        <div className="bg-secondary rounded-[16px] p-6 border border-white/10 hover:border-primary/20 transition-colors">
          <div className="flex items-center gap-2 mb-5">
            <Award size={18} className="text-accent" />
            <h3 className="text-white font-semibold text-lg">Recent Grades</h3>
          </div>
          {stats.gradeOverview.length === 0 ? (
            <p className="text-slate-400 text-sm">No grades yet.</p>
          ) : (
            <div className="space-y-3">
              {stats.gradeOverview.slice(0, 5).map((g, i) => (
                <div key={i} className="flex items-center justify-between border-b border-white/5 pb-2.5 last:border-0">
                  <p className="text-white text-sm truncate mr-2">{g.assignment?.title}</p>
                  <span className="text-accent font-mono font-semibold text-sm whitespace-nowrap">
                    {g.marks}/{g.assignment?.maxMarks}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Recent Activity Timeline */}
      <div className="bg-secondary rounded-[16px] p-6 border border-white/10 hover:border-primary/20 transition-colors">
        <div className="flex items-center gap-2 mb-5">
          <Clock size={18} className="text-primary" />
          <h3 className="text-white font-semibold text-lg">Recent Activity</h3>
        </div>
        {stats.recentActivity.length === 0 ? (
          <p className="text-slate-400 text-sm">No activity yet. Submit your first assignment to get started.</p>
        ) : (
          <div className="relative pl-6">
            <div className="absolute left-[7px] top-1 bottom-1 w-px bg-white/10" />
            {stats.recentActivity.map((activity, i) => (
              <div key={activity._id} className="relative pb-5 last:pb-0">
                <div
                  className={`absolute -left-6 top-1 w-3.5 h-3.5 rounded-full border-2 border-secondary ${
                    activity.status === 'graded' ? 'bg-accent' : 'bg-primary'
                  }`}
                />
                <p className="text-white text-sm font-medium">
                  {activity.status === 'graded' ? 'Graded' : activity.status === 'late' ? 'Submitted (Late)' : 'Submitted'}
                </p>
                <p className="text-slate-400 text-xs mt-0.5 font-mono">
                  {new Date(activity.submittedAt).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'short',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function QuickStat({ icon: Icon, label, value, accent = false }) {
  return (
    <div className="bg-secondary rounded-[16px] p-5 border border-white/10 hover:border-primary/30 hover:-translate-y-0.5 transition-all duration-200">
      <div className="w-9 h-9 rounded-[12px] bg-primary/20 flex items-center justify-center mb-3">
        <Icon size={18} className="text-primary" />
      </div>
      <p className={`text-2xl font-bold font-mono mb-0.5 ${accent ? 'text-accent' : 'text-white'}`}>
        {value}
      </p>
      <p className="text-slate-400 text-xs">{label}</p>
    </div>
  );
}
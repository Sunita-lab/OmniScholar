import { useState, useEffect } from 'react';
import { BookOpen, Users, ClipboardList, Inbox, Clock, Users2 } from 'lucide-react';
import api from '../lib/api';

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return { text: 'Good Morning', emoji: '🌅' };
  if (hour < 17) return { text: 'Good Afternoon', emoji: '☀️' };
  return { text: 'Good Evening', emoji: '🌙' };
};

export default function TeacherDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const greeting = getGreeting();

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const { data } = await api.get('/dashboard/teacher');
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
        <p className="text-text-secondary">Here's what's happening across your courses.</p>
      </div>

      {/* Quick Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <QuickStat icon={BookOpen} label="Total Courses" value={stats.totalCourses} />
        <QuickStat icon={Users} label="Total Students" value={stats.totalStudents} />
        <QuickStat icon={ClipboardList} label="Assignments Created" value={stats.totalAssignments} />
        <QuickStat icon={Inbox} label="Pending Reviews" value={stats.recentSubmissions.length} accent />
      </div>

      {/* Main Grid: Submissions Queue + Course Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Submissions Queue */}
        <div className="lg:col-span-2 bg-secondary rounded-[16px] p-6 border border-white/10 hover:border-primary/20 transition-colors">
          <div className="flex items-center gap-2 mb-5">
            <Inbox size={18} className="text-primary" />
            <h3 className="text-white font-semibold text-lg">Submissions Queue</h3>
          </div>
          {stats.recentSubmissions.length === 0 ? (
            <div className="text-center py-6">
              <p className="text-slate-400 text-sm">No pending submissions to review.</p>
            </div>
          ) : (
            <div className="space-y-1">
              {stats.recentSubmissions.map((s) => (
                <div
                  key={s._id}
                  className="flex items-center justify-between py-3 border-b border-white/5 last:border-0"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary text-xs font-semibold">
                      {s.student?.fullName?.charAt(0)}
                    </div>
                    <div>
                      <p className="text-white text-sm font-medium">{s.assignment?.title}</p>
                      <p className="text-slate-400 text-xs">{s.student?.fullName}</p>
                    </div>
                  </div>
                  <span
                    className={`text-xs font-medium font-mono px-2.5 py-1 rounded-full ${
                      s.status === 'late' ? 'bg-warning/20 text-warning' : 'bg-primary/20 text-primary'
                    }`}
                  >
                    {s.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Course Breakdown */}
        <div className="bg-secondary rounded-[16px] p-6 border border-white/10 hover:border-primary/20 transition-colors">
          <div className="flex items-center gap-2 mb-5">
            <Users2 size={18} className="text-accent" />
            <h3 className="text-white font-semibold text-lg">Your Courses</h3>
          </div>
          {stats.courseBreakdown.length === 0 ? (
            <p className="text-slate-400 text-sm">No courses yet. Create one to get started.</p>
          ) : (
            <div className="space-y-3">
              {stats.courseBreakdown.map((c) => (
                <div key={c._id} className="flex items-center justify-between border-b border-white/5 pb-2.5 last:border-0">
                  <p className="text-white text-sm truncate mr-2">{c.title}</p>
                  <span className="text-accent font-mono font-semibold text-sm whitespace-nowrap">
                    {c.studentCount}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
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
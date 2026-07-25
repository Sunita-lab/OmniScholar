import { useState, useEffect } from 'react';
import { BookOpen, Users, ClipboardList, Inbox } from 'lucide-react';
import StatCard from '../components/StatCard';
import api from '../lib/api';

export default function TeacherDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

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

  if (loading) {
    return <p className="text-text-secondary">Loading dashboard...</p>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-text-primary mb-1">Teaching Overview</h1>
      <p className="text-text-secondary mb-8">Here's what's happening across your courses.</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard icon={BookOpen} label="Total Courses" value={stats.totalCourses} />
        <StatCard icon={Users} label="Total Students" value={stats.totalStudents} />
        <StatCard icon={ClipboardList} label="Assignments Created" value={stats.totalAssignments} />
        <StatCard icon={Inbox} label="Pending Reviews" value={stats.recentSubmissions.length} accent />
      </div>

      <div className="bg-secondary rounded-[16px] p-6 border border-white/10">
        <h3 className="text-white font-semibold mb-4">Recent Submissions Queue</h3>
        {stats.recentSubmissions.length === 0 ? (
          <p className="text-slate-400 text-sm">No pending submissions to review.</p>
        ) : (
          <div className="space-y-3">
            {stats.recentSubmissions.map((s) => (
              <div key={s._id} className="flex items-center justify-between border-b border-white/5 pb-3 last:border-0">
                <div>
                  <p className="text-white text-sm font-medium">{s.assignment?.title}</p>
                  <p className="text-slate-400 text-xs mt-0.5">by {s.student?.fullName}</p>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  s.status === 'late' ? 'bg-warning/20 text-warning' : 'bg-primary/20 text-primary'
                }`}>
                  {s.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AssignmentCard from '../components/AssignmentCard';
import api from '../lib/api';
import { useAuth } from '../context/AuthContext';

export default function Assignments() {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAll = async () => {
      try {
        if (user.role === 'student') {
          const { data: enrollments } = await api.get('/courses/my-enrollments');
          const { data: submissions } = await api.get('/submissions/my-submissions');

          const submissionMap = {};
          submissions.forEach((s) => {
            submissionMap[s.assignment?._id] = s.status;
          });

          let all = [];
          for (const enr of enrollments) {
            const { data } = await api.get(`/assignments/course/${enr.course._id}`);
            all = [
              ...all,
              ...data.map((a) => ({
                ...a,
                courseName: enr.course.title,
                status: submissionMap[a._id] || 'pending',
              })),
            ];
          }
          setAssignments(all);
        } else {
          const { data: courses } = await api.get('/courses');
          let all = [];
          for (const c of courses.courses.filter((c) => c.instructor?._id === user._id)) {
            const { data } = await api.get(`/assignments/course/${c._id}`);
            all = [...all, ...data.map((a) => ({ ...a, courseName: c.title, status: 'active' }))];
          }
          setAssignments(all);
        }
      } catch (error) {
        console.error('Failed to load assignments', error);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, [user]);

  if (loading) return <p className="text-text-secondary">Loading assignments...</p>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-text-primary mb-1">Assignments</h1>
        <p className="text-text-secondary">
          {user.role === 'student' ? 'Track and submit your work.' : 'Manage assignments across your courses.'}
        </p>
      </div>

      {assignments.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-2xl mb-2">📋</p>
          <p className="text-text-primary font-medium">No assignments yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {assignments.map((a) => (
            <AssignmentCard
              key={a._id}
              title={a.title}
              courseName={a.courseName}
              deadline={a.deadline}
              status={a.status}
              onClick={() => navigate(`/assignments/${a._id}`)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
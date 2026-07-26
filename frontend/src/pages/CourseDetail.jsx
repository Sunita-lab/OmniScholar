import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Star, Users, Clock, BookOpen, Award, Globe, ChevronDown,
  PlayCircle, FileText, Link2, CheckCircle2, Lock
} from 'lucide-react';
import api from '../lib/api';
import { useAuth } from '../context/AuthContext';
import CourseCard from '../components/CourseCard';

const lessonIcons = {
  video: PlayCircle,
  pdf: FileText,
  text: FileText,
  link: Link2,
};

export default function CourseDetail() {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [related, setRelated] = useState([]);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [expandedModule, setExpandedModule] = useState(0);
  const [enrolling, setEnrolling] = useState(false);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await api.get(`/courses/${id}`);
        setCourse(data);

        const relRes = await api.get('/courses', { params: { category: data.category, limit: 4 } });
        setRelated(relRes.data.courses.filter((c) => c._id !== id).slice(0, 3));

        if (user?.role === 'student') {
          const enrollRes = await api.get('/courses/my-enrollments');
          setIsEnrolled(enrollRes.data.some((e) => e.course?._id === id));
        }
      } catch (error) {
        console.error('Failed to load course', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, user]);

  const handleEnroll = async () => {
    setEnrolling(true);
    try {
      await api.post(`/courses/${id}/enroll`);
      setIsEnrolled(true);
    } catch (error) {
      console.error('Enrollment failed', error);
    } finally {
      setEnrolling(false);
    }
  };

  if (loading) return <p className="text-text-secondary">Loading course...</p>;
  if (!course) return <p className="text-error">Course not found.</p>;

  const totalLessons = course.modules?.reduce((acc, m) => acc + (m.lessons?.length || 0), 0) || 0;

  return (
    <div className="-m-5 sm:-m-8">
      {/* Hero */}
      <div className="bg-secondary px-5 sm:px-8 py-10 sm:py-14">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10 items-center">
          {/* Left: Info */}
          <div>
            <div className="flex flex-wrap gap-2 mb-4">
              <Badge>{course.difficulty}</Badge>
              {course.certificateEnabled && <Badge>Certificate</Badge>}
              <Badge>{course.language}</Badge>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-3 leading-tight">
              {course.title}
            </h1>
            <p className="text-slate-300 text-base sm:text-lg mb-6">{course.subtitle || course.description}</p>

            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-primary/30 flex items-center justify-center text-white font-semibold shrink-0">
                {course.instructor?.fullName?.charAt(0)}
              </div>
              <div>
                <p className="text-white text-sm font-medium">{course.instructor?.fullName}</p>
                <p className="text-slate-400 text-xs">Instructor</p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 sm:gap-5 text-slate-300 text-sm mb-8">
              <span className="flex items-center gap-1.5">
                <Users size={16} /> {course.totalStudents} learners
              </span>
              <span className="flex items-center gap-1.5">
                <Clock size={16} /> {course.estimatedHours} hours
              </span>
              <span className="flex items-center gap-1.5">
                <BookOpen size={16} /> {totalLessons} lessons
              </span>
              {course.rating > 0 && (
                <span className="flex items-center gap-1.5">
                  <Star size={16} className="text-accent" /> {course.rating.toFixed(1)}
                </span>
              )}
            </div>

            {user?.role === 'student' && (
              <button
                onClick={handleEnroll}
                disabled={isEnrolled || enrolling}
                className="w-full sm:w-auto bg-primary hover:bg-primary-hover text-white font-medium px-8 py-3.5 rounded-[12px] transition-colors disabled:opacity-70"
              >
                {isEnrolled ? 'Enrolled ✓' : enrolling ? 'Enrolling...' : 'Enroll Now'}
              </button>
            )}
              {user?.role === 'student' && isEnrolled && (
  <ClaimCertificateButton courseId={id} />
)}
            
          </div>

          {/* Right: Module Constellation Preview */}
          <div className="relative h-56 sm:h-72 lg:h-80 bg-white/5 rounded-[16px] border border-white/10 flex items-center justify-center overflow-hidden">
            <ModuleConstellation modules={course.modules} />
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="bg-background px-5 sm:px-8 py-8 sm:py-10 space-y-6 sm:space-y-8">
        {/* Course Overview */}
        <div className="bg-surface rounded-[16px] border border-border p-5 sm:p-6">
          <h2 className="text-xl sm:text-2xl font-bold text-text-primary mb-4">Course Overview</h2>
          <p className="text-text-secondary mb-6">{course.description}</p>

          {course.learningObjectives?.length > 0 && (
            <div className="mb-6">
              <h3 className="font-semibold text-text-primary mb-3">What You'll Learn</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {course.learningObjectives.map((obj, i) => (
                  <div key={i} className="flex items-start gap-2 text-sm text-text-secondary">
                    <CheckCircle2 size={16} className="text-primary mt-0.5 shrink-0" />
                    {obj}
                  </div>
                ))}
              </div>
            </div>
          )}

          {course.prerequisites?.length > 0 && (
            <div>
              <h3 className="font-semibold text-text-primary mb-3">Prerequisites</h3>
              <div className="flex flex-wrap gap-2">
                {course.prerequisites.map((p, i) => (
                  <span key={i} className="text-xs bg-background border border-border px-3 py-1.5 rounded-full text-text-secondary">
                    {p}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modules Accordion */}
        <div className="bg-surface rounded-[16px] border border-border p-5 sm:p-6">
          <h2 className="text-xl sm:text-2xl font-bold text-text-primary mb-4">Course Content</h2>
          <div className="space-y-3">
            {course.modules?.map((module, idx) => (
              <div key={module._id || idx} className="border border-border rounded-[12px] overflow-hidden">
                <button
                  onClick={() => setExpandedModule(expandedModule === idx ? -1 : idx)}
                  className="w-full flex items-center justify-between gap-3 px-4 py-3.5 hover:bg-background transition-colors"
                >
                  <div className="text-left min-w-0">
                    <p className="font-medium text-text-primary truncate">
                      Module {idx + 1}: {module.title}
                    </p>
                    <p className="text-text-secondary text-xs mt-0.5">
                      {module.lessons?.length || 0} lessons
                    </p>
                  </div>
                  <ChevronDown
                    size={18}
                    className={`text-text-secondary transition-transform shrink-0 ${expandedModule === idx ? 'rotate-180' : ''}`}
                  />
                </button>
                {expandedModule === idx && (
                  <div className="border-t border-border px-4 py-2">
                    {module.lessons?.map((lesson, lIdx) => {
                      const Icon = lessonIcons[lesson.contentType] || FileText;
                      return (
                        <div key={lesson._id || lIdx} className="flex items-center gap-3 py-2.5">
                          <Icon size={16} className="text-text-secondary shrink-0" />
                          <span className="text-sm text-text-primary flex-1 min-w-0 truncate">{lesson.title}</span>
                          {lesson.duration > 0 && (
                            <span className="text-xs text-text-secondary shrink-0">{lesson.duration} min</span>
                          )}
                          {isEnrolled ? (
                            <PlayCircle size={16} className="text-primary shrink-0" />
                          ) : (
                            <Lock size={14} className="text-text-secondary shrink-0" />
                          )}
                        </div>
                      );
                    })}
                    {(!module.lessons || module.lessons.length === 0) && (
                      <p className="text-text-secondary text-sm py-2">No lessons added yet.</p>
                    )}
                  </div>
                )}
              </div>
            ))}
            {(!course.modules || course.modules.length === 0) && (
              <p className="text-text-secondary text-sm">No modules added yet.</p>
            )}
          </div>
        </div>

        {/* Resources */}
        {course.resources?.length > 0 && (
          <div className="bg-surface rounded-[16px] border border-border p-5 sm:p-6">
            <h2 className="text-xl sm:text-2xl font-bold text-text-primary mb-4">Resources</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {course.resources.map((r, i) => (
                <a
                  key={i}
                  href={r.fileUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-3 p-3.5 border border-border rounded-[12px] hover:border-primary/40 transition-colors"
                >
                  <FileText size={18} className="text-primary shrink-0" />
                  <span className="text-sm text-text-primary truncate">{r.title}</span>
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Related Courses */}
        {related.length > 0 && (
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-text-primary mb-4">Related Courses</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {related.map((c) => (
                <CourseCard key={c._id} course={c} isEnrolled={false} onClick={() => navigate(`/courses/${c._id}`)} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function Badge({ children }) {
  return (
    <span className="text-xs font-medium bg-white/10 text-white px-3 py-1.5 rounded-full capitalize">
      {children}
    </span>
  );
}

function ClaimCertificateButton({ courseId }) {
  const [status, setStatus] = useState('idle');
  const [message, setMessage] = useState('');

  const handleClaim = async () => {
    setStatus('loading');
    try {
      const { data } = await api.post(`/certificates/claim/${courseId}`);
      window.location.href = `/certificates/${data.verificationCode}`;
    } catch (error) {
      setMessage(error.response?.data?.message || 'Not eligible yet');
      setStatus('error');
    }
  };

  return (
    <div className="mt-3">
      <button
        onClick={handleClaim}
        disabled={status === 'loading'}
        className="text-accent text-sm font-medium hover:underline"
      >
        {status === 'loading' ? 'Checking...' : '🏆 Claim Certificate'}
      </button>
      {status === 'error' && <p className="text-text-secondary text-xs mt-1">{message}</p>}
    </div>
  );
}

function ModuleConstellation({ modules }) {
  if (!modules || modules.length === 0) {
    return <p className="text-slate-400 text-sm">No modules yet</p>;
  }

  const positions = modules.map((_, i) => ({
    x: 20 + (i % 3) * 30 + (Math.floor(i / 3) % 2) * 10,
    y: 15 + Math.floor(i / 3) * 30 + (i % 3) * 8,
  }));

  return (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      {positions.slice(1).map((pos, i) => (
        <line
          key={i}
          x1={positions[i].x}
          y1={positions[i].y}
          x2={pos.x}
          y2={pos.y}
          stroke="#14B8A6"
          strokeWidth="0.3"
          opacity="0.4"
        />
      ))}
      {positions.map((pos, i) => (
        <g key={i}>
          <circle cx={pos.x} cy={pos.y} r="3" fill="#0F766E" opacity="0.9">
            <animate attributeName="opacity" values="0.6;1;0.6" dur="2.5s" begin={`${i * 0.3}s`} repeatCount="indefinite" />
          </circle>
          <text x={pos.x} y={pos.y + 7} fontSize="3" fill="#94A3B8" textAnchor="middle">
            {modules[i].title?.slice(0, 12)}
          </text>
        </g>
      ))}
    </svg>
  );
}
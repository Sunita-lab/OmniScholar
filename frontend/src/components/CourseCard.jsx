import { Users, Clock, Layers } from 'lucide-react';

const categoryGradients = {
  'Web Development': 'from-teal-600 to-cyan-500',
  'AI': 'from-purple-600 to-indigo-500',
  'Programming': 'from-blue-600 to-teal-500',
  'Design': 'from-pink-500 to-rose-400',
  'Business': 'from-amber-600 to-orange-500',
  'Mathematics': 'from-emerald-600 to-teal-500',
  default: 'from-slate-600 to-slate-500',
};

const difficultyStyle = {
  beginner: 'bg-success/15 text-success',
  intermediate: 'bg-warning/15 text-warning',
  advanced: 'bg-error/15 text-error',
};

export default function CourseCard({ course, isEnrolled, onClick }) {
  const gradient = categoryGradients[course.category] || categoryGradients.default;

  return (
    <div
      onClick={onClick}
      className="bg-surface rounded-[16px] border border-border overflow-hidden cursor-pointer group hover:shadow-lg hover:-translate-y-1 transition-all duration-200"
    >
      {/* Card Top */}
      <div className={`h-36 bg-gradient-to-br ${gradient} relative overflow-hidden`}>
        {/* Mini constellation icon */}
        <div className="absolute top-3 left-3 flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-white/80" />
          <span className="w-3 h-px bg-white/50" />
          <span className="w-1.5 h-1.5 rounded-full bg-white/80" />
          <span className="w-3 h-px bg-white/50" />
          <span className="w-1.5 h-1.5 rounded-full bg-white/80" />
        </div>
        <span className="absolute top-3 right-3 bg-white/20 backdrop-blur-sm text-white text-xs font-medium px-2.5 py-1 rounded-full">
          {course.category}
        </span>
      </div>

      {/* Card Body */}
      <div className="p-4">
        <h3 className="font-semibold text-text-primary text-lg leading-snug line-clamp-2 mb-2">
          {course.title}
        </h3>

        <div className="flex items-center gap-2 mb-3">
          <div className="w-5 h-5 rounded-full bg-primary/15 flex items-center justify-center text-primary text-[10px] font-semibold">
            {course.instructor?.fullName?.charAt(0)}
          </div>
          <span className="text-text-secondary text-sm">{course.instructor?.fullName}</span>
        </div>

        <div className="flex items-center gap-3 text-text-secondary text-xs mb-3">
          <span className="flex items-center gap-1">
            <Clock size={13} /> {course.estimatedHours || 0} hrs
          </span>
          <span className="flex items-center gap-1">
            <Layers size={13} /> {course.modules?.length || 0} modules
          </span>
          <span className="flex items-center gap-1">
            <Users size={13} /> {course.totalStudents || 0}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className={`text-xs font-medium px-2 py-1 rounded-full capitalize ${difficultyStyle[course.difficulty]}`}>
            {course.difficulty}
          </span>
          <button className="text-primary text-sm font-medium hover:underline">
            {isEnrolled ? 'Continue →' : 'Enroll →'}
          </button>
        </div>
      </div>
    </div>
  );
}
import { useState, useEffect, useCallback } from 'react';
import { Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import CourseCard from '../components/CourseCard';
import api from '../lib/api';
import { useAuth } from '../context/AuthContext';

const categories = ['All', 'Web Development', 'Programming', 'AI', 'Design', 'Business', 'Mathematics'];
const difficulties = ['All', 'beginner', 'intermediate', 'advanced'];

export default function Courses() {
  const [courses, setCourses] = useState([]);
  const [enrolledIds, setEnrolledIds] = useState(new Set());
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [difficulty, setDifficulty] = useState('All');
  const [sort, setSort] = useState('newest');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  const fetchCourses = useCallback(async (pageNum, append = false) => {
    setLoading(true);
    try {
      const params = { page: pageNum, limit: 9, sort };
      if (search) params.search = search;
      if (category !== 'All') params.category = category;
      if (difficulty !== 'All') params.difficulty = difficulty;

      const { data } = await api.get('/courses', { params });
      setCourses((prev) => (append ? [...prev, ...data.courses] : data.courses));
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error('Failed to load courses', error);
    } finally {
      setLoading(false);
    }
  }, [search, category, difficulty, sort]);

  useEffect(() => {
    setPage(1);
    fetchCourses(1, false);
  }, [search, category, difficulty, sort, fetchCourses]);

  useEffect(() => {
    if (user?.role === 'student') {
      api.get('/courses/my-enrollments').then(({ data }) => {
        setEnrolledIds(new Set(data.map((e) => e.course?._id)));
      }).catch(() => {});
    }
  }, [user]);

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchCourses(nextPage, true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
  <div>
    <h1 className="text-3xl font-bold text-text-primary mb-1">Explore Courses</h1>
    <p className="text-text-secondary">Discover your next skill.</p>
  </div>
  {user.role === 'teacher' && (
    <button
      onClick={() => navigate('/courses/create')}
      className="bg-primary hover:bg-primary-hover text-white font-medium px-5 py-2.5 rounded-[12px] transition-colors"
    >
      + Create Course
    </button>
  )}
</div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary" size={20} />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="What do you want to master today?"
          className="w-full h-14 pl-12 pr-4 rounded-[16px] border border-border bg-surface text-text-primary placeholder:text-text-secondary focus:outline-none focus:ring-2 focus:ring-primary/30 transition-shadow"
        />
      </div>

      {/* Category Chips */}
      <div className="flex flex-wrap gap-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              category === cat
                ? 'bg-primary text-white'
                : 'bg-surface border border-border text-text-secondary hover:border-primary/40'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Difficulty Filter + Sort */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          {difficulties.map((d) => (
            <button
              key={d}
              onClick={() => setDifficulty(d)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium capitalize transition-colors ${
                difficulty === d
                  ? 'bg-secondary text-white'
                  : 'bg-surface border border-border text-text-secondary hover:border-primary/40'
              }`}
            >
              {d}
            </button>
          ))}
        </div>

        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="h-9 rounded-[10px] border border-border bg-surface px-3 text-sm text-text-primary"
        >
          <option value="newest">Newest</option>
          <option value="oldest">Oldest</option>
          <option value="title-asc">Title A-Z</option>
          <option value="rating">Highest Rated</option>
        </select>
      </div>

      {/* Course Grid */}
      {loading && courses.length === 0 ? (
        <p className="text-text-secondary">Loading courses...</p>
      ) : courses.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-2xl mb-2">✨</p>
          <p className="text-text-primary font-medium mb-1">Couldn't find that topic.</p>
          <p className="text-text-secondary text-sm">Try a different search or filter.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {courses.map((course) => (
              <CourseCard
                key={course._id}
                course={course}
                isEnrolled={enrolledIds.has(course._id)}
                onClick={() => navigate(`/courses/${course._id}`)}
              />
            ))}
          </div>

          {page < totalPages && (
            <div className="text-center pt-4">
              <button
                onClick={handleLoadMore}
                disabled={loading}
                className="px-6 py-2.5 rounded-[12px] border border-border text-text-primary font-medium hover:border-primary/40 transition-colors"
              >
                {loading ? 'Loading...' : 'Load More'}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
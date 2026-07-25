import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, X } from 'lucide-react';
import api from '../lib/api';
import { useAuth } from '../context/AuthContext';

export default function CreateAssignment() {
  const [courses, setCourses] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    course: '',
    deadline: '',
    maxMarks: 100,
    submissionType: 'file',
  });
  const [rubric, setRubric] = useState([{ criterion: '', maxPoints: '' }]);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/courses').then(({ data }) => {
      setCourses(data.courses.filter((c) => c.instructor?._id === user._id));
    });
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const updateRubric = (i, key, value) => {
    const updated = [...rubric];
    updated[i][key] = value;
    setRubric(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSaving(true);

    try {
      const { data } = await api.post('/assignments', {
        ...formData,
        maxMarks: Number(formData.maxMarks),
        rubric: rubric
          .filter((r) => r.criterion.trim())
          .map((r) => ({ criterion: r.criterion, maxPoints: Number(r.maxPoints) })),
      });
      navigate(`/assignments/${data._id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create assignment');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-3xl">
      <h1 className="text-3xl font-bold text-text-primary mb-1">Create Assignment</h1>
      <p className="text-text-secondary mb-8">Set up a new assignment for your students.</p>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-surface rounded-[16px] border border-border p-6 space-y-4">
          <Field label="Course">
            <select name="course" value={formData.course} onChange={handleChange} required className="input">
              <option value="">Select a course</option>
              {courses.map((c) => (
                <option key={c._id} value={c._id}>{c.title}</option>
              ))}
            </select>
          </Field>

          <Field label="Title">
            <input name="title" value={formData.title} onChange={handleChange} required className="input" />
          </Field>

          <Field label="Description">
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows={4}
              className="input"
            />
          </Field>

          <div className="grid grid-cols-3 gap-4">
            <Field label="Deadline">
              <input
                type="datetime-local"
                name="deadline"
                value={formData.deadline}
                onChange={handleChange}
                required
                className="input"
              />
            </Field>
            <Field label="Max Marks">
              <input
                type="number"
                name="maxMarks"
                value={formData.maxMarks}
                onChange={handleChange}
                required
                className="input"
              />
            </Field>
            <Field label="Submission Type">
              <select name="submissionType" value={formData.submissionType} onChange={handleChange} className="input">
                <option value="file">File</option>
                <option value="text">Text</option>
                <option value="both">Both</option>
              </select>
            </Field>
          </div>
        </div>

        {/* Rubric */}
        <div className="bg-surface rounded-[16px] border border-border p-6">
          <h3 className="font-semibold text-text-primary mb-3">Grading Rubric</h3>
          <div className="space-y-2">
            {rubric.map((r, i) => (
              <div key={i} className="flex items-center gap-2">
                <input
                  value={r.criterion}
                  onChange={(e) => updateRubric(i, 'criterion', e.target.value)}
                  placeholder="e.g. Code Quality"
                  className="input flex-1"
                />
                <input
                  type="number"
                  value={r.maxPoints}
                  onChange={(e) => updateRubric(i, 'maxPoints', e.target.value)}
                  placeholder="Points"
                  className="input w-24"
                />
                {rubric.length > 1 && (
                  <button
                    type="button"
                    onClick={() => setRubric(rubric.filter((_, idx) => idx !== i))}
                    className="text-text-secondary hover:text-error"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={() => setRubric([...rubric, { criterion: '', maxPoints: '' }])}
              className="flex items-center gap-1.5 text-primary text-sm font-medium hover:underline"
            >
              <Plus size={14} /> Add criterion
            </button>
          </div>
        </div>

        {error && <p className="text-error text-sm">{error}</p>}

        <button
          type="submit"
          disabled={saving}
          className="bg-primary hover:bg-primary-hover text-white font-medium px-8 py-3 rounded-[12px] transition-colors disabled:opacity-60"
        >
          {saving ? 'Creating...' : 'Create Assignment'}
        </button>
      </form>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div>
      <label className="block text-sm font-medium text-text-primary mb-1.5">{label}</label>
      {children}
    </div>
  );
}
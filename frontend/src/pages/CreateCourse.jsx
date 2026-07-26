import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, X } from 'lucide-react';
import api from '../lib/api';

const categories = ['Web Development', 'Programming', 'AI', 'Design', 'Business', 'Mathematics'];

export default function CreateCourse() {
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    description: '',
    category: 'Web Development',
    difficulty: 'beginner',
    estimatedHours: '',
    status: 'published',
  });
  const [objectives, setObjectives] = useState(['']);
  const [prerequisites, setPrerequisites] = useState(['']);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const updateList = (list, setList, index, value) => {
    const updated = [...list];
    updated[index] = value;
    setList(updated);
  };

  const addListItem = (list, setList) => setList([...list, '']);
  const removeListItem = (list, setList, index) => setList(list.filter((_, i) => i !== index));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSaving(true);

    try {
      const { data } = await api.post('/courses', {
        ...formData,
        estimatedHours: Number(formData.estimatedHours) || 0,
        learningObjectives: objectives.filter((o) => o.trim()),
        prerequisites: prerequisites.filter((p) => p.trim()),
      });
      navigate(`/courses/${data._id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create course');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl sm:text-3xl font-bold text-text-primary mb-1">Create a New Course</h1>
      <p className="text-text-secondary mb-6 sm:mb-8">Fill in the details to publish your course.</p>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-surface rounded-[16px] border border-border p-5 sm:p-6 space-y-4">
          <Field label="Title">
            <input
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="input"
            />
          </Field>

          <Field label="Subtitle">
            <input
              name="subtitle"
              value={formData.subtitle}
              onChange={handleChange}
              className="input"
            />
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

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Category">
              <select name="category" value={formData.category} onChange={handleChange} className="input">
                {categories.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </Field>

            <Field label="Difficulty">
              <select name="difficulty" value={formData.difficulty} onChange={handleChange} className="input">
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </Field>
          </div>

          <Field label="Estimated Hours">
            <input
              type="number"
              name="estimatedHours"
              value={formData.estimatedHours}
              onChange={handleChange}
              className="input"
            />
          </Field>
        </div>

        {/* Learning Objectives */}
        <div className="bg-surface rounded-[16px] border border-border p-5 sm:p-6">
          <h3 className="font-semibold text-text-primary mb-3">Learning Objectives</h3>
          <DynamicList
            items={objectives}
            onUpdate={(i, v) => updateList(objectives, setObjectives, i, v)}
            onAdd={() => addListItem(objectives, setObjectives)}
            onRemove={(i) => removeListItem(objectives, setObjectives, i)}
            placeholder="e.g. Build ML models from scratch"
          />
        </div>

        {/* Prerequisites */}
        <div className="bg-surface rounded-[16px] border border-border p-5 sm:p-6">
          <h3 className="font-semibold text-text-primary mb-3">Prerequisites</h3>
          <DynamicList
            items={prerequisites}
            onUpdate={(i, v) => updateList(prerequisites, setPrerequisites, i, v)}
            onAdd={() => addListItem(prerequisites, setPrerequisites)}
            onRemove={(i) => removeListItem(prerequisites, setPrerequisites, i)}
            placeholder="e.g. Basic Python knowledge"
          />
        </div>

        {error && <p className="text-error text-sm">{error}</p>}

        <button
          type="submit"
          disabled={saving}
          className="w-full sm:w-auto bg-primary hover:bg-primary-hover text-white font-medium px-8 py-3 rounded-[12px] transition-colors disabled:opacity-60"
        >
          {saving ? 'Creating...' : 'Create Course'}
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

function DynamicList({ items, onUpdate, onAdd, onRemove, placeholder }) {
  return (
    <div className="space-y-2">
      {items.map((item, i) => (
        <div key={i} className="flex items-center gap-2">
          <input
            value={item}
            onChange={(e) => onUpdate(i, e.target.value)}
            placeholder={placeholder}
            className="input flex-1"
          />
          {items.length > 1 && (
            <button type="button" onClick={() => onRemove(i)} className="text-text-secondary hover:text-error shrink-0">
              <X size={16} />
            </button>
          )}
        </div>
      ))}
      <button
        type="button"
        onClick={onAdd}
        className="flex items-center gap-1.5 text-primary text-sm font-medium hover:underline"
      >
        <Plus size={14} /> Add item
      </button>
    </div>
  );
}
import { useState, useEffect } from 'react';
import { Mail, Phone, Building2, GraduationCap, Award, Flame, X, Plus } from 'lucide-react';
import api from '../lib/api';
import { useAuth } from '../context/AuthContext';

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [skillInput, setSkillInput] = useState('');
  const [saving, setSaving] = useState(false);
  const { user, login } = useAuth();

  useEffect(() => {
    api.get('/auth/profile').then(({ data }) => {
      setProfile(data);
      setFormData({
        fullName: data.fullName || '',
        bio: data.bio || '',
        phone: data.phone || '',
        institute: data.institute || '',
        department: data.department || '',
        course: data.course || '',
        semester: data.semester || '',
        skills: data.skills || [],
      });
    });
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const addSkill = () => {
    if (skillInput.trim()) {
      setFormData({ ...formData, skills: [...formData.skills, skillInput.trim()] });
      setSkillInput('');
    }
  };

  const removeSkill = (skill) => {
    setFormData({ ...formData, skills: formData.skills.filter((s) => s !== skill) });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const { data } = await api.put('/auth/profile', formData);
      setProfile(data);
      login({ ...user, fullName: data.fullName, token: user.token });
      setEditing(false);
    } catch (error) {
      console.error('Update failed', error);
    } finally {
      setSaving(false);
    }
  };

  if (!profile) return <p className="text-text-secondary">Loading profile...</p>;

  return (
    <div className="max-w-4xl space-y-6">
      {/* Header */}
      <div className="bg-secondary rounded-[16px] p-8 relative overflow-hidden">
        <div className="relative z-10 flex items-center gap-5">
          <div className="w-20 h-20 rounded-full bg-primary flex items-center justify-center text-white text-2xl font-bold shrink-0">
            {profile.fullName?.charAt(0)}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">{profile.fullName}</h1>
            <p className="text-slate-400 text-sm">@{profile.username}</p>
            <span className="inline-block mt-2 text-xs font-medium bg-primary/20 text-primary px-3 py-1 rounded-full capitalize">
              {profile.role}
            </span>
          </div>
          <button
            onClick={() => setEditing(!editing)}
            className="ml-auto bg-white/10 hover:bg-white/20 text-white text-sm font-medium px-4 py-2 rounded-[10px] transition-colors"
          >
            {editing ? 'Cancel' : 'Edit Profile'}
          </button>
        </div>
      </div>

      {/* Learning Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatBox icon={Flame} label="Streak" value={profile.streak} />
        <StatBox icon={Award} label="XP" value={profile.xp} accent />
        <StatBox icon={GraduationCap} label="Level" value={profile.level} />
        <StatBox icon={Building2} label="Hours" value={profile.totalLearningHours} />
      </div>

      {editing ? (
        /* Edit Form */
        <div className="bg-surface rounded-[16px] border border-border p-6 space-y-4">
          <Field label="Full Name">
            <input name="fullName" value={formData.fullName} onChange={handleChange} className="input" />
          </Field>
          <Field label="Bio">
            <textarea name="bio" value={formData.bio} onChange={handleChange} rows={3} className="input" />
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Phone">
              <input name="phone" value={formData.phone} onChange={handleChange} className="input" />
            </Field>
            <Field label="Institute">
              <input name="institute" value={formData.institute} onChange={handleChange} className="input" />
            </Field>
            <Field label="Department">
              <input name="department" value={formData.department} onChange={handleChange} className="input" />
            </Field>
            <Field label="Semester">
              <input type="number" name="semester" value={formData.semester} onChange={handleChange} className="input" />
            </Field>
          </div>

          <Field label="Skills">
            <div className="flex flex-wrap gap-2 mb-2">
              {formData.skills.map((s) => (
                <span key={s} className="flex items-center gap-1.5 bg-primary/10 text-primary text-xs font-medium px-3 py-1.5 rounded-full">
                  {s}
                  <X size={12} className="cursor-pointer" onClick={() => removeSkill(s)} />
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                placeholder="Add a skill and press Enter"
                className="input flex-1"
              />
              <button type="button" onClick={addSkill} className="bg-primary text-white px-4 rounded-[12px]">
                <Plus size={16} />
              </button>
            </div>
          </Field>

          <button
            onClick={handleSave}
            disabled={saving}
            className="bg-primary hover:bg-primary-hover text-white font-medium px-6 py-2.5 rounded-[12px] transition-colors disabled:opacity-60"
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      ) : (
        /* View Mode */
        <div className="bg-surface rounded-[16px] border border-border p-6 space-y-5">
          {profile.bio && <p className="text-text-secondary">{profile.bio}</p>}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <InfoRow icon={Mail} label={profile.email} />
            {profile.phone && <InfoRow icon={Phone} label={profile.phone} />}
            {profile.institute && <InfoRow icon={Building2} label={profile.institute} />}
            {profile.department && <InfoRow icon={GraduationCap} label={`${profile.department}${profile.semester ? ` · Sem ${profile.semester}` : ''}`} />}
          </div>

          {profile.skills?.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-text-primary mb-2">Skills</h3>
              <div className="flex flex-wrap gap-2">
                {profile.skills.map((s) => (
                  <span key={s} className="bg-primary/10 text-primary text-xs font-medium px-3 py-1.5 rounded-full">
                    {s}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function StatBox({ icon: Icon, label, value, accent = false }) {
  return (
    <div className="bg-surface rounded-[16px] border border-border p-4 text-center">
      <Icon size={18} className={`mx-auto mb-2 ${accent ? 'text-accent' : 'text-primary'}`} />
      <p className={`text-xl font-bold font-mono ${accent ? 'text-accent' : 'text-text-primary'}`}>{value}</p>
      <p className="text-text-secondary text-xs">{label}</p>
    </div>
  );
}

function InfoRow({ icon: Icon, label }) {
  return (
    <div className="flex items-center gap-2.5 text-text-secondary">
      <Icon size={16} className="text-text-secondary" />
      {label}
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
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Clock, Award, FileText, Upload, CheckCircle2, Download } from 'lucide-react';
import api, { FILE_BASE_URL} from '../lib/api';
import { useAuth } from '../context/AuthContext';

function useCountdown(deadline) {
  const [timeLeft, setTimeLeft] = useState('');

  useEffect(() => {
    const update = () => {
      const diff = new Date(deadline) - new Date();
      if (diff <= 0) {
        setTimeLeft('Deadline passed');
        return;
      }
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const mins = Math.floor((diff / (1000 * 60)) % 60);
      setTimeLeft(`${days}d ${hours}h ${mins}m`);
    };
    update();
    const interval = setInterval(update, 60000);
    return () => clearInterval(interval);
  }, [deadline]);

  return timeLeft;
}

export default function AssignmentDetail() {
  const { id } = useParams();
  const [assignment, setAssignment] = useState(null);
  const [mySubmission, setMySubmission] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [textSubmission, setTextSubmission] = useState('');
  const [file, setFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const timeLeft = useCountdown(assignment?.deadline);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await api.get(`/assignments/${id}`);
        setAssignment(data);

        if (user.role === 'student') {
          const { data: mySubs } = await api.get('/submissions/my-submissions');
          const found = mySubs.find((s) => s.assignment?._id === id);
          setMySubmission(found || null);
        } else {
          const { data: subs } = await api.get(`/submissions/assignment/${id}`);
          setSubmissions(subs);
        }
      } catch (error) {
        console.error('Failed to load assignment', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, user]);

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      let files = [];
      if (file) {
        const formData = new FormData();
        formData.append('file', file);
        const { data } = await api.post('/upload', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        files = [{ title: file.name, fileUrl: data.fileUrl }];
      }

      const { data } = await api.post(`/submissions/${id}`, {
        files,
        textSubmission,
      });
      setMySubmission(data);
    } catch (error) {
      alert(error.response?.data?.message || 'Submission failed');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <p className="text-text-secondary">Loading...</p>;
  if (!assignment) return <p className="text-error">Assignment not found.</p>;

  const isUrgent = new Date(assignment.deadline) - new Date() < 24 * 60 * 60 * 1000;

  return (
    <div className="-m-8">
      {/* Hero */}
      <div className="bg-secondary px-8 py-12">
        <div className="flex flex-wrap gap-2 mb-4">
          <Badge>{assignment.submissionType}</Badge>
          <Badge>{assignment.maxMarks} Marks</Badge>
        </div>
        <h1 className="text-4xl font-bold text-white mb-3">{assignment.title}</h1>
        <p className="text-slate-300 text-lg max-w-2xl mb-6">{assignment.description}</p>

        <div className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-[12px] ${isUrgent ? 'bg-warning/20' : 'bg-white/10'}`}>
          <Clock size={16} className={isUrgent ? 'text-warning' : 'text-white'} />
          <span className={`text-sm font-mono font-medium ${isUrgent ? 'text-warning' : 'text-white'}`}>
            {timeLeft}
          </span>
        </div>
      </div>

      {/* Body */}
      <div className="bg-background px-8 py-10 space-y-6 max-w-4xl">
        {/* Rubric */}
        {assignment.rubric?.length > 0 && (
          <div className="bg-surface rounded-[16px] border border-border p-6">
            <div className="flex items-center gap-2 mb-4">
              <Award size={18} className="text-primary" />
              <h2 className="text-xl font-bold text-text-primary">Grading Rubric</h2>
            </div>
            <div className="space-y-3">
              {assignment.rubric.map((r, i) => (
                <div key={i}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-text-primary font-medium">{r.criterion}</span>
                    <span className="text-text-secondary font-mono">{r.maxPoints} pts</span>
                  </div>
                  <div className="h-1.5 bg-border rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full"
                      style={{ width: `${(r.maxPoints / assignment.maxMarks) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Resources */}
        {assignment.attachments?.length > 0 && (
          <div className="bg-surface rounded-[16px] border border-border p-6">
            <h2 className="text-xl font-bold text-text-primary mb-4">Resources</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {assignment.attachments.map((a, i) => (
                <a
                  key={i}
                  href={`${FILE_BASE_URL}${a.fileUrl}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-3 p-3.5 border border-border rounded-[12px] hover:border-primary/40 transition-colors"
                >
                  <FileText size={18} className="text-primary shrink-0" />
                  <span className="text-sm text-text-primary truncate">{a.title}</span>
                  <Download size={14} className="text-text-secondary ml-auto shrink-0" />
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Student: Submission Workspace */}
        {user.role === 'student' && (
          <div className="bg-surface rounded-[16px] border border-border p-6">
            <h2 className="text-xl font-bold text-text-primary mb-4">Your Submission</h2>

            {mySubmission ? (
              <div>
                <div className="flex items-center gap-2 mb-4 text-success">
                  <CheckCircle2 size={20} />
                  <span className="font-medium capitalize">{mySubmission.status}</span>
                </div>
                {mySubmission.textSubmission && (
                  <p className="text-text-secondary text-sm mb-3">{mySubmission.textSubmission}</p>
                )}
                {mySubmission.files?.map((f, i) => (
                  <a
                    key={i}
                    href={`${FILE_BASE_URL}${f.fileUrl}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-primary text-sm hover:underline flex items-center gap-1.5"
                  >
                    <FileText size={14} /> {f.title}
                  </a>
                ))}

                {mySubmission.status === 'graded' && (
                  <div className="mt-5 pt-5 border-t border-border">
                    <p className="text-2xl font-bold font-mono text-accent mb-2">
                      {mySubmission.marks} / {assignment.maxMarks}
                    </p>
                    {mySubmission.feedback && (
                      <p className="text-text-secondary text-sm bg-background p-3 rounded-[10px]">
                        {mySubmission.feedback}
                      </p>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {(assignment.submissionType === 'text' || assignment.submissionType === 'both') && (
                  <textarea
                    value={textSubmission}
                    onChange={(e) => setTextSubmission(e.target.value)}
                    placeholder="Write your submission here..."
                    rows={5}
                    className="w-full rounded-[12px] border border-border p-3 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
                  />
                )}
                {(assignment.submissionType === 'file' || assignment.submissionType === 'both') && (
                  <label className="flex flex-col items-center justify-center gap-2 border-2 border-dashed border-border rounded-[12px] p-8 cursor-pointer hover:border-primary/40 transition-colors">
                    <Upload size={24} className="text-text-secondary" />
                    <span className="text-sm text-text-secondary">
                      {file ? file.name : 'Click to upload a file'}
                    </span>
                    <input type="file" className="hidden" onChange={(e) => setFile(e.target.files[0])} />
                  </label>
                )}
                <button
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="w-full bg-primary hover:bg-primary-hover text-white font-medium py-3 rounded-[12px] transition-colors disabled:opacity-60"
                >
                  {submitting ? 'Submitting...' : 'Submit Assignment'}
                </button>
              </div>
            )}
          </div>
        )}

        {/* Teacher: Submissions List */}
        {user.role === 'teacher' && (
          <div className="bg-surface rounded-[16px] border border-border p-6">
            <h2 className="text-xl font-bold text-text-primary mb-4">
              Submissions ({submissions.length})
            </h2>
            {submissions.length === 0 ? (
              <p className="text-text-secondary text-sm">No submissions yet.</p>
            ) : (
              <div className="space-y-3">
                {submissions.map((s) => (
                  <SubmissionRow key={s._id} submission={s} maxMarks={assignment.maxMarks} />
                ))}
              </div>
            )}
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

function SubmissionRow({ submission, maxMarks }) {
  const [marks, setMarks] = useState(submission.marks || '');
  const [feedback, setFeedback] = useState(submission.feedback || '');
  const [saving, setSaving] = useState(false);
  const [graded, setGraded] = useState(submission.status === 'graded');

  const handleGrade = async () => {
    setSaving(true);
    try {
      await api.put(`/submissions/${submission._id}/grade`, { marks: Number(marks), feedback });
      setGraded(true);
    } catch (error) {
      alert(error.response?.data?.message || 'Grading failed');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="border border-border rounded-[12px] p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-primary/15 flex items-center justify-center text-primary text-xs font-semibold">
            {submission.student?.fullName?.charAt(0)}
          </div>
          <span className="text-sm font-medium text-text-primary">{submission.student?.fullName}</span>
        </div>
        <span className={`text-xs px-2 py-1 rounded-full capitalize ${
          submission.status === 'late' ? 'bg-warning/15 text-warning' : 'bg-primary/15 text-primary'
        }`}>
          {submission.status}
        </span>
      </div>

      {submission.files?.map((f, i) => (
        <a
          key={i}
          href={`${FILE_BASE_URL}${f.fileUrl}`}
          target="_blank"
          rel="noreferrer"
          className="text-primary text-sm hover:underline flex items-center gap-1.5 mb-2"
        >
          <FileText size={14} /> {f.title}
        </a>
      ))}
      {submission.textSubmission && (
        <p className="text-text-secondary text-sm mb-3">{submission.textSubmission}</p>
      )}

      <div className="flex items-center gap-2 mt-3">
        <input
          type="number"
          value={marks}
          onChange={(e) => setMarks(e.target.value)}
          placeholder="Marks"
          max={maxMarks}
          className="w-20 rounded-[10px] border border-border px-2.5 py-1.5 text-sm"
        />
        <input
          type="text"
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          placeholder="Feedback"
          className="flex-1 rounded-[10px] border border-border px-2.5 py-1.5 text-sm"
        />
        <button
          onClick={handleGrade}
          disabled={saving || !marks}
          className="bg-primary hover:bg-primary-hover text-white text-sm font-medium px-4 py-1.5 rounded-[10px] transition-colors disabled:opacity-50"
        >
          {graded ? 'Update' : 'Grade'}
        </button>
      </div>
    </div>
  );
}
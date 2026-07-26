import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Award, ShieldCheck } from 'lucide-react';
import api from '../lib/api';

export default function CertificateView() {
  const { code } = useParams();
  const [certificate, setCertificate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get(`/certificates/verify/${code}`)
      .then(({ data }) => setCertificate(data))
      .catch(() => setError('Certificate not found or invalid code.'))
      .finally(() => setLoading(false));
  }, [code]);

  if (loading) return <p className="text-text-secondary">Loading certificate...</p>;
  if (error) return <p className="text-error">{error}</p>;

  return (
    <div className="max-w-3xl mx-auto">
      {/* Certificate Card */}
      <div className="bg-gradient-to-br from-[#FFFDF7] to-[#FBF6E9] rounded-[20px] border-2 border-accent/30 p-10 sm:p-14 relative overflow-hidden shadow-lg">
        {/* Constellation watermark */}
        <svg viewBox="0 0 400 400" className="absolute inset-0 w-full h-full opacity-[0.04] pointer-events-none">
          {[...Array(15)].map((_, i) => (
            <circle
              key={i}
              cx={Math.random() * 400}
              cy={Math.random() * 400}
              r="3"
              fill="#D4A017"
            />
          ))}
        </svg>

        <div className="relative z-10 text-center">
          <div className="flex items-center justify-center gap-2 mb-6">
            <img src="/logo.png" alt="OmniScholar" className="w-8 h-8" />
            <span className="text-lg font-bold">
              <span className="text-primary">Omni</span>
              <span className="text-[#111827]">Scholar</span>
            </span>
          </div>

          <Award size={40} className="text-accent mx-auto mb-4" />

          <p className="text-[#64748B] text-sm uppercase tracking-widest mb-2">Certificate of Completion</p>
          <p className="text-[#64748B] text-sm mb-1">This certifies that</p>
          <h1 className="text-3xl sm:text-4xl font-bold text-[#111827] mb-4" style={{ fontFamily: 'Sora, sans-serif' }}>
            {certificate.student?.fullName}
          </h1>
          <p className="text-[#64748B] text-sm mb-1">has successfully completed</p>
          <h2 className="text-xl sm:text-2xl font-semibold text-primary mb-6">
            {certificate.course?.title}
          </h2>

          <div className="flex items-center justify-center gap-6 text-xs text-[#64748B] mb-8">
            <span className="capitalize">{certificate.course?.difficulty}</span>
            <span>•</span>
            <span>{certificate.course?.estimatedHours} hours</span>
            <span>•</span>
            <span>{new Date(certificate.issuedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
          </div>

          <div className="flex items-center justify-center gap-2 text-accent text-xs font-mono border-t border-accent/20 pt-5">
            <ShieldCheck size={14} />
            Verification Code: {certificate.verificationCode}
          </div>
        </div>
      </div>

      <p className="text-center text-text-secondary text-xs mt-4">
        Verify this certificate anytime at omnischolar.vercel.app/certificates/{certificate.verificationCode}
      </p>
    </div>
  );
}
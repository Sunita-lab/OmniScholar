import { Award } from 'lucide-react';

export default function CertificateCard({ certificate, onClick }) {
  return (
    <div
      onClick={onClick}
      className="bg-gradient-to-br from-secondary to-[#102A43] rounded-[16px] border border-accent/20 p-6 cursor-pointer hover:border-accent/50 hover:-translate-y-1 transition-all duration-200 relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 w-24 h-24 bg-accent/10 rounded-full blur-2xl" />
      <div className="relative z-10">
        <Award size={28} className="text-accent mb-4" />
        <h3 className="text-white font-semibold text-lg mb-1 line-clamp-2">{certificate.course?.title}</h3>
        <p className="text-slate-400 text-xs mb-4">
          Issued {new Date(certificate.issuedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
        </p>
        <p className="text-accent text-xs font-mono">{certificate.verificationCode}</p>
      </div>
    </div>
  );
}
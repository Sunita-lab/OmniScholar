import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Award } from 'lucide-react';
import CertificateCard from '../components/CertificateCard';
import api from '../lib/api';

export default function Certificates() {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/certificates/my-certificates')
      .then(({ data }) => setCertificates(data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="text-text-secondary">Loading certificates...</p>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-text-primary mb-1">Your Certificates</h1>
        <p className="text-text-secondary">Proof of what you've mastered.</p>
      </div>

      {certificates.length === 0 ? (
        <div className="text-center py-16">
          <Award size={32} className="text-text-secondary mx-auto mb-3" />
          <p className="text-text-primary font-medium mb-1">No certificates yet</p>
          <p className="text-text-secondary text-sm">Complete all assignments in a course to earn one.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {certificates.map((cert) => (
            <CertificateCard key={cert._id} certificate={cert} onClick={() => navigate(`/certificates/${cert.verificationCode}`)} />
          ))}
        </div>
      )}
    </div>
  );
}
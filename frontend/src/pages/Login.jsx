import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import ConstellationBackground from '../components/ConstellationBackground';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import api from '../lib/api';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { data } = await api.post('/auth/login', formData);
      login(data);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left: Constellation */}
      <div className="hidden lg:flex lg:w-1/2 bg-secondary relative overflow-hidden items-center justify-center">
        <ConstellationBackground />
        <div className="relative z-10 text-center px-12">
          <img src="/logo.png" alt="OmniScholar" className="w-20 h-20 mx-auto mb-5" />
<h1 className="text-5xl font-bold mb-4">
  <span className="text-primary">Omni</span>
  <span className="text-white">Scholar</span>
</h1>
          <p className="text-slate-300 text-lg">The universe of knowledge, mapped for you.</p>
        </div>
      </div>

      {/* Right: Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-background px-6">
        <div className="w-full max-w-sm">
          <h2 className="text-3xl font-bold text-text-primary mb-2">Welcome back</h2>
          <p className="text-text-secondary mb-8">Log in to continue your learning journey.</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
                required
                className="mt-1.5 rounded-[12px]"
              />
            </div>

            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                required
                className="mt-1.5 rounded-[12px]"
              />
            </div>

            {error && (
              <p className="text-error text-sm">{error}</p>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-primary hover:bg-primary-hover rounded-[12px] h-11"
            >
              {loading ? 'Logging in...' : 'Log In'}
            </Button>
          </form>

          <p className="text-center text-text-secondary text-sm mt-6">
            Don't have an account?{' '}
            <Link to="/register" className="text-primary font-medium hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
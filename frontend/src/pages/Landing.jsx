import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { BookOpen, Award, Users, Sparkles, ArrowRight, CheckCircle,UserPlus, Compass,TrendingUp, Menu, X } from 'lucide-react';

export default function Landing() {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
     {/* Navbar */}
<nav className="sticky top-0 z-50 bg-secondary/95 backdrop-blur-md border-b border-white/10">
  <div className="flex items-center justify-between px-5 sm:px-8 py-4 max-w-7xl mx-auto">
    <div className="flex items-center gap-2.5 sm:gap-3">
      <img src="/logo.png" alt="OmniScholar" className="w-11 h-11 sm:w-14 sm:h-12" />
      <span className="text-lg sm:text-xl font-bold">
        <span className="text-primary">Omni</span>
        <span className="text-white">Scholar</span>
      </span>
      <span className="hidden sm:inline-flex items-center text-[11px] font-semibold text-accent bg-accent/10 px-2 py-0.5 rounded-full ml-1">
        BETA
      </span>
    </div>

    <div className="hidden lg:flex items-center gap-8">
      <a href="#features" className="text-slate-300 text-sm font-medium hover:text-primary transition-colors">Features</a>
      <a href="#how-it-works" className="text-slate-300 text-sm font-medium hover:text-primary transition-colors">How It Works</a>
      <a href="#for-teachers" className="text-slate-300 text-sm font-medium hover:text-primary transition-colors">For Teachers</a>
    </div>

    <div className="hidden lg:flex items-center gap-2">
      <button onClick={() => navigate('/login')} className="text-white font-medium px-5 py-2.5 rounded-[12px] hover:bg-white/10 transition-colors">
        Log In
      </button>
      <button onClick={() => navigate('/register')} className="flex items-center gap-1.5 bg-primary hover:bg-primary-hover text-white font-medium px-5 py-2.5 rounded-[12px] shadow-sm transition-colors">
        Get Started <ArrowRight size={15} />
      </button>
    </div>

    {/* Mobile hamburger */}
    <button
      onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
      className="lg:hidden text-white p-2"
    >
      {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
    </button>
  </div>

  {/* Mobile menu dropdown */}
  {mobileMenuOpen && (
    <div className="lg:hidden bg-secondary border-t border-white/10 px-5 py-4 space-y-3">
      <a href="#features" onClick={() => setMobileMenuOpen(false)} className="block text-slate-300 text-sm font-medium py-2">Features</a>
      <a href="#how-it-works" onClick={() => setMobileMenuOpen(false)} className="block text-slate-300 text-sm font-medium py-2">How It Works</a>
      <a href="#for-teachers" onClick={() => setMobileMenuOpen(false)} className="block text-slate-300 text-sm font-medium py-2">For Teachers</a>
      <div className="flex flex-col gap-2 pt-2">
        <button onClick={() => navigate('/login')} className="text-white font-medium px-5 py-2.5 rounded-[12px] border border-white/20 text-center">
          Log In
        </button>
        <button onClick={() => navigate('/register')} className="bg-primary text-white font-medium px-5 py-2.5 rounded-[12px] text-center">
          Get Started
        </button>
      </div>
    </div>
  )}
</nav>
      {/* Hero */}
      <section className="relative bg-secondary overflow-hidden">
        <img
          src="/hero-bg.png"
          alt=""
          className="absolute inset-0 w-full h-full object-cover opacity-90"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-secondary via-secondary/70 to-transparent" />

        <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8 py-20 sm:py-28 lg:py-36">
          <div className="max-w-xl">
            <span className="inline-flex items-center gap-1.5 text-accent text-sm font-medium bg-accent/10 px-3.5 py-1.5 rounded-full mb-6">
              <Sparkles size={14} /> The Universe of Knowledge
            </span>
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
              Learning, mapped like the stars.
            </h1>
            <p className="text-slate-300 text-lg mb-8">
              OmniScholar connects courses, assignments, and progress into one
              constellation — helping you see exactly where you are, and what's next.
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4">
  <button
    onClick={() => navigate('/register')}
    className="w-full sm:w-auto flex items-center justify-center gap-2 bg-primary hover:bg-primary-hover text-white font-medium px-7 py-3.5 rounded-[12px] transition-colors"
  >
    Start Learning <ArrowRight size={18} />
  </button>
  <button
    onClick={() => navigate('/login')}
    className="w-full sm:w-auto flex items-center justify-center text-white font-medium px-7 py-3.5 rounded-[12px] border border-white/20 hover:bg-white/5 transition-colors"
  >
    Log In
  </button>
</div>
          </div>
        </div>
      </section>

      {/* How It Works */}
<section id="how-it-works" className="bg-secondary px-5 sm:px-8 py-24 relative overflow-hidden">
  <div className="max-w-7xl mx-auto relative">
    <div className="text-center mb-16">
      <span className="inline-flex items-center gap-1.5 text-primary text-sm font-medium bg-primary/10 px-3.5 py-1.5 rounded-full mb-5">
        How It Works
      </span>
      <h2 className="text-4xl font-bold text-white mb-3">
        Three steps to your next skill
      </h2>
      <p className="text-slate-300 text-lg">From sign-up to mastery, mapped out clearly.</p>
    </div>

    <div className="relative grid grid-cols-1 sm:grid-cols-3 gap-6">
      {/* Connecting line (desktop only) */}
      <div className="hidden sm:block absolute top-8 left-[16.5%] right-[16.5%] h-px bg-gradient-to-r from-primary/20 via-primary to-primary/20" />

      <StepCard
        number="01"
        icon={UserPlus}
        title="Create Your Account"
        description="Sign up as a student or teacher in under a minute — no setup required."
      />
      <StepCard
        number="02"
        icon={Compass}
        title="Explore or Build"
        description="Browse courses to enroll in, or build your own with modules and assignments."
      />
      <StepCard
        number="03"
        icon={TrendingUp}
        title="Track Your Progress"
        description="Submit work, get transparent feedback, and watch your dashboard grow."
      />
    </div>
  </div>
</section>
      {/* Features */}
      <section id="features" className="bg-secondary border-y border-border px-8 py-24">
  <div className="max-w-7xl mx-auto">
        <div className="text-center mb-14">
          <h2 className="text-4xl font-bold text-white mb-3">
            Everything you need to learn, in one place
          </h2>
          <p className="text-slate-300 text-lg">
            Built for students and teachers who want more than a checklist.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <FeatureCard
            icon={BookOpen}
            title="Structured Courses"
            description="Modules, lessons, and resources organized clearly — no digging through folders."
          />
          <FeatureCard
            icon={Users}
            title="Built for Both Roles"
            description="Purpose-built dashboards for teachers managing courses and students tracking progress."
          />
          <FeatureCard
            icon={Award}
            title="Transparent Grading"
            description="Rubric-based grading and feedback, so you always know how work is evaluated."
          />
        </div>
      
      </div></section>

      {/* For Teachers */}
<section id="for-teachers" className="bg-secondary py-24">
  <div className="max-w-7xl mx-auto px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
    <div>
      <span className="inline-flex items-center gap-1.5 text-primary text-sm font-medium bg-primary/10 px-3.5 py-1.5 rounded-full mb-5">
        For Teachers
      </span>
      <h2 className="text-4xl font-bold text-white mb-4">
        Teaching, without the busywork.
      </h2>
      <p className="text-slate-300 text-lg mb-6">
        Build courses with modules and lessons, set assignments with transparent
        rubrics, and grade submissions — all from one dashboard built for you.
      </p>
      <ul className="space-y-3 mb-8">
        {['Create and manage courses in minutes', 'Track every submission in one queue', 'Grade with clear, rubric-based feedback'].map((item) => (
          <li key={item} className="flex items-center gap-2.5 text-slate-300 text-sm">
            <CheckCircle size={16} className="text-primary shrink-0" />
            {item}
          </li>
        ))}
      </ul>
      <button
        onClick={() => navigate('/register')}
        className="bg-primary hover:bg-primary-hover text-white font-medium px-7 py-3.5 rounded-[12px] transition-colors"
      >
        Start Teaching
      </button>
    </div>
    <div className="bg-secondary rounded-[20px] p-8 h-72 flex items-center justify-center">
      <p className="text-slate-400 text-sm">Dashboard preview</p>
    </div>
  </div>
</section>

      {/* CTA */}
      <section className="bg-secondary py-20">
        <div className="max-w-3xl mx-auto text-center px-8">
          <h2 className="text-4xl font-bold text-white mb-4">
            Ready to start your journey?
          </h2>
          <p className="text-slate-300 text-lg mb-8">
            Join OmniScholar today — it's free to get started.
          </p>
          <button
            onClick={() => navigate('/register')}
            className="bg-primary hover:bg-primary-hover text-white font-medium px-8 py-3.5 rounded-[12px] transition-colors"
          >
            Create Free Account
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-secondary border-t border-white/10 px-8 py-10">
  <div className="max-w-7xl mx-auto flex items-center justify-between">
    <div className="flex items-center gap-2">
      <img src="/logo.png" alt="OmniScholar" className="w-6 h-6" />
      <span className="text-slate-400 text-sm">© 2026 OmniScholar. All rights reserved.</span>
    </div>
  </div>
</footer>
    </div>
  );
}

function StepCard({ number, icon: Icon, title, description }) {
  return (
    <div className="relative bg-white/5 backdrop-blur-sm rounded-[16px] border border-white/10 p-7 pt-9 hover:border-primary/40 hover:-translate-y-1 transition-all duration-200 text-center">
      <div className="relative w-16 h-16 rounded-full bg-gradient-to-br from-primary to-cyan-500 flex items-center justify-center mx-auto mb-5 shadow-md shadow-primary/20">
        <Icon size={24} className="text-white" />
        <span className="absolute -top-1.5 -right-1.5 w-6 h-6 rounded-full bg-secondary text-white text-[10px] font-bold font-mono flex items-center justify-center border-2 border-secondary">
          {number}
        </span>
      </div>
      <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
      <p className="text-slate-300 text-sm leading-relaxed">{description}</p>
    </div>
  );
}
function FeatureCard({ icon: Icon, title, description }) {
  return (
    <div className="bg-surface rounded-[16px] border border-border p-7 hover:border-primary/30 hover:-translate-y-1 transition-all duration-200">
      <div className="w-12 h-12 rounded-[14px] bg-primary/10 flex items-center justify-center mb-4">
        <Icon size={22} className="text-primary" />
      </div>
      <h3 className="text-lg font-semibold text-text-primary mb-2">{title}</h3>
      <p className="text-text-secondary text-sm leading-relaxed">{description}</p>
    </div>
  );
}
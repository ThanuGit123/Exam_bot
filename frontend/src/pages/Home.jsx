import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, Activity, CheckSquare, BarChart3, LineChart, Target } from 'lucide-react';

function DashboardGraphic() {
  const [progress, setProgress] = useState(0);
  const [efficiency, setEfficiency] = useState(85.0);
  
  useEffect(() => {
    // Animate progress to 84
    const timer = setTimeout(() => setProgress(84), 500);
    
    // Fluctuate efficiency
    const interval = setInterval(() => {
      setEfficiency(prev => {
        const fluctuate = (Math.random() * 1.5) - 0.5;
        let newEff = prev + fluctuate;
        if (newEff > 98) newEff = 98;
        if (newEff < 88) newEff = 88;
        return Number(newEff.toFixed(1));
      });
    }, 2000);
    
    return () => { clearTimeout(timer); clearInterval(interval); };
  }, []);

  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="relative w-full aspect-[4/3] bg-[#0f172a] border border-gray-800 rounded-xl overflow-hidden shadow-[0_0_40px_rgba(37,99,235,0.15)] flex flex-col p-4">
      {/* Mockup Header */}
      <div className="flex items-center gap-2 mb-4 border-b border-gray-800 pb-3">
        <div className="w-2.5 h-2.5 rounded-full bg-red-500"></div>
        <div className="w-2.5 h-2.5 rounded-full bg-yellow-500"></div>
        <div className="w-2.5 h-2.5 rounded-full bg-green-500"></div>
        <div className="ml-2 text-[10px] text-gray-600 font-mono">rankforge.ai/dashboard</div>
      </div>
      
      {/* Mockup Content Grid */}
      <div className="grid grid-cols-3 gap-4 flex-1">
        <div className="col-span-1 bg-[#1e293b] rounded-lg border border-gray-700/50 flex items-center justify-center relative overflow-hidden group">
          <div className="absolute inset-0 bg-blue-500/5 group-hover:bg-blue-500/10 transition-colors duration-500"></div>
          <div className="relative w-24 h-24">
            <svg className="w-full h-full transform -rotate-90">
              <circle cx="48" cy="48" r={radius} stroke="#0f172a" strokeWidth="8" fill="transparent" />
              <circle 
                cx="48" cy="48" r={radius} 
                stroke="#00f0ff" strokeWidth="8" fill="transparent" 
                strokeDasharray={circumference} 
                strokeDashoffset={strokeDashoffset} 
                className="drop-shadow-[0_0_5px_rgba(0,240,255,0.5)] transition-all duration-1500 ease-out" 
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center flex-col">
              <span className="text-xl font-bold text-white drop-shadow-[0_0_5px_rgba(255,255,255,0.5)]">
                {progress}%
              </span>
            </div>
          </div>
        </div>
        <div className="col-span-2 bg-[#1e293b] rounded-lg border border-gray-700/50 p-4 relative overflow-hidden flex flex-col justify-end group">
          <div className="absolute inset-0 bg-gradient-to-t from-blue-600/10 to-transparent opacity-50 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div className="absolute inset-0" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
          <svg className="w-full h-16 relative z-10" viewBox="0 0 100 40" preserveAspectRatio="none">
            <path d="M0,40 L10,35 L20,38 L30,25 L40,30 L50,15 L60,20 L70,5 L80,15 L90,5 L100,20 L100,40 Z" fill="rgba(37,99,235,0.2)" />
            <path 
              d="M0,40 L10,35 L20,38 L30,25 L40,30 L50,15 L60,20 L70,5 L80,15 L90,5 L100,20" 
              fill="none" stroke="#3b82f6" strokeWidth="1.5" 
              className="drop-shadow-[0_0_5px_rgba(37,99,235,0.5)]" 
              style={{ strokeDasharray: 200, strokeDashoffset: progress === 0 ? 200 : 0, transition: 'stroke-dashoffset 2s ease-out' }}
            />
          </svg>
        </div>
      </div>

      {/* Mockup Bottom Bar */}
      <div className="mt-4 bg-[#1e293b] border border-blue-500/30 rounded-lg p-3 flex items-center justify-between shadow-[0_0_15px_rgba(37,99,235,0.1)_inset]">
        <div>
          <div className="text-[10px] text-gray-400 mb-0.5">Real-time Analysis</div>
          <div className="text-xs font-bold text-white transition-all duration-300">Efficiency: {efficiency.toFixed(1)}%</div>
        </div>
        <div className="relative">
          <div className="absolute inset-0 bg-blue-400 blur-sm opacity-50 animate-pulse"></div>
          <LineChart className="w-5 h-5 text-blue-400 relative z-10" />
        </div>
      </div>
    </div>
  );
}

function Home() {
  return (
    <div className="min-h-screen bg-[#0b0f19] text-gray-100 font-sans selection:bg-blue-500/30 overflow-x-hidden">
      
      {/* Background ambient glows */}
      <div className="fixed top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-600/10 blur-[120px] pointer-events-none"></div>
      <div className="fixed top-[40%] right-[-10%] w-[30%] h-[40%] rounded-full bg-indigo-600/10 blur-[120px] pointer-events-none"></div>

      {/* Navigation */}
      <nav className="relative z-10 flex items-center justify-between px-6 py-5 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <GraduationCap className="w-6 h-6 text-blue-500" />
          <span className="text-xl font-bold tracking-tight text-white">RankForge</span>
        </div>
        
        <div className="hidden md:flex items-center gap-8 text-xs font-semibold text-gray-400">
          <a href="#" className="text-blue-500">Home</a>
          <a href="#" className="hover:text-white transition-colors">Features</a>
          <a href="#" className="hover:text-white transition-colors">How it works</a>
          <a href="#" className="hover:text-white transition-colors">Exams</a>
        </div>

        <div className="flex items-center gap-6">
          <Link to="/login" className="text-xs font-semibold text-gray-300 hover:text-white transition-colors">Sign In</Link>
          <Link to="/signup" className="px-5 py-2.5 text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white rounded-md transition-colors shadow-[0_0_15px_rgba(37,99,235,0.4)]">
            Start Practicing
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 pt-16 pb-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          
          {/* Hero Left Content */}
          <div className="space-y-8">
            <h1 className="text-5xl lg:text-6xl font-['Outfit'] font-normal leading-[1.1] tracking-tight text-white">
              Master JEE, NEET & UPSC <br/>
              with <span className="text-blue-500 drop-shadow-[0_0_10px_rgba(37,99,235,0.5)]">Adaptive AI.</span>
            </h1>
            
            <p className="text-gray-400 text-[15px] leading-relaxed max-w-[90%]">
              RankForge evolves with you. Experience real-time adaptation and personalized mock tests engineered for India's toughest competitive exams.
            </p>
            
            <div className="flex flex-wrap items-center gap-4">
              <Link to="/signup" className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold rounded-md transition-all shadow-[0_0_20px_rgba(37,99,235,0.4)]">
                Start Practicing Now
              </Link>
              <button className="px-6 py-3 bg-[#111827] border border-gray-700 hover:border-gray-500 text-white text-sm font-bold rounded-md transition-all">
                Try it now
              </button>
            </div>

            <div className="flex items-center gap-12 pt-6">
              <div>
                <p className="text-[#00f0ff] font-bold text-lg mb-1 drop-shadow-[0_0_5px_rgba(0,240,255,0.4)]">3-in-1</p>
                <p className="text-[10px] text-gray-500 font-bold tracking-[0.2em] uppercase">Practice • Grading • Reports</p>
              </div>
              <div>
                <p className="text-[#00e676] font-bold text-lg mb-1 drop-shadow-[0_0_5px_rgba(0,230,118,0.4)]">24/7</p>
                <p className="text-[10px] text-gray-500 font-bold tracking-[0.2em] uppercase">Always Available</p>
              </div>
            </div>
          </div>

          {/* Hero Right Graphic */}
          <DashboardGraphic />
        </div>
      </main>

      {/* Focus Bar */}
      <div className="border-y border-gray-800/50 bg-[#0f172a]/50 backdrop-blur-sm py-8 relative z-10">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-center gap-6">
          <span className="text-[10px] font-bold text-gray-500 tracking-[0.2em] uppercase">Focusing On</span>
          <div className="flex flex-wrap justify-center gap-4">
            <span className="px-4 py-1.5 bg-[#1e293b] border border-gray-700/50 rounded-full text-xs font-bold text-gray-300">JEE (MAINS/ADV)</span>
            <span className="px-4 py-1.5 bg-[#1e293b] border border-gray-700/50 rounded-full text-xs font-bold text-gray-300">NEET (UG)</span>
            <span className="px-4 py-1.5 bg-[#1e293b] border border-gray-700/50 rounded-full text-xs font-bold text-gray-300">UPSC (CSE)</span>
            <span className="px-4 py-1.5 bg-[#1e293b] border border-gray-700/50 rounded-full text-xs font-bold text-gray-300">GATE (TECH)</span>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <section className="py-24 max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl font-bold text-white mb-4">Precision-Engineered Learning</h2>
          <p className="text-sm text-gray-400 leading-relaxed">
            Our AI engine processes millions of data points to ensure every second you spend studying contributes directly to your score.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Feature Card 1 */}
          <div className="bg-[#111827] border border-blue-900/30 rounded-xl p-8 hover:border-blue-500/50 transition-colors group">
            <div className="w-10 h-10 rounded-lg bg-blue-900/30 flex items-center justify-center mb-6 border border-blue-800/50 group-hover:bg-blue-600/20 transition-colors">
              <Activity className="w-5 h-5 text-blue-400" />
            </div>
            <h3 className="text-lg font-bold text-white mb-3">Adaptive Practice</h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              The difficulty of questions adjusts in real-time based on your speed and accuracy, keeping you in the optimal learning zone.
            </p>
          </div>

          {/* Feature Card 2 */}
          <div className="bg-[#111827] border border-emerald-900/30 rounded-xl p-8 hover:border-emerald-500/50 transition-colors group relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-emerald-900/10 pointer-events-none"></div>
            <div className="w-10 h-10 rounded-lg bg-emerald-900/30 flex items-center justify-center mb-6 border border-emerald-800/50 group-hover:bg-emerald-600/20 transition-colors relative z-10">
              <CheckSquare className="w-5 h-5 text-emerald-400" />
            </div>
            <h3 className="text-lg font-bold text-white mb-3 relative z-10">Real-time Grading</h3>
            <p className="text-xs text-gray-400 leading-relaxed relative z-10">
              Immediate step-by-step feedback on every problem. Understand exactly where you went wrong before moving to the next step.
            </p>
          </div>

          {/* Feature Card 3 */}
          <div className="bg-[#111827] border border-indigo-900/30 rounded-xl p-8 hover:border-indigo-500/50 transition-colors group">
            <div className="w-10 h-10 rounded-lg bg-indigo-900/30 flex items-center justify-center mb-6 border border-indigo-800/50 group-hover:bg-indigo-600/20 transition-colors">
              <BarChart3 className="w-5 h-5 text-indigo-400" />
            </div>
            <h3 className="text-lg font-bold text-white mb-3">Weak-Topic Reports</h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              Deep-dive analytics identify your hidden knowledge gaps and create personalized roadmaps for rapid score improvement.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="pb-24 max-w-5xl mx-auto px-6 relative z-10">
        <div className="bg-[#111827] border border-gray-800 rounded-2xl p-12 text-center shadow-2xl relative overflow-hidden">
          {/* Subtle background element inside CTA */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-[#111827] to-[#111827] pointer-events-none"></div>
          
          <div className="relative z-10">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">Ready to bridge the gap between effort and results?</h2>
            <p className="text-sm text-gray-500 italic mb-8">Type something to start...</p>
            
            <Link to="/signup" className="inline-flex px-8 py-3.5 bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold rounded-full transition-all shadow-[0_0_20px_rgba(37,99,235,0.4)] mb-4">
              Get Your First Mock Test Free
            </Link>
            <p className="text-[10px] font-bold tracking-widest text-gray-500 uppercase">JOIN 500,000+ STUDENTS TODAY</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800/50 bg-[#0b0f19] pt-16 pb-8 relative z-10">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <GraduationCap className="w-5 h-5 text-blue-500" />
              <span className="text-lg font-bold text-white">RankForge</span>
            </div>
            <p className="text-[10px] text-gray-500 leading-relaxed max-w-[200px]">
              Precision engineering for the next generation of top performers in India.
            </p>
          </div>
          
          <div>
            <h4 className="text-[10px] font-bold tracking-widest text-gray-400 uppercase mb-4">Platform</h4>
            <ul className="space-y-2 text-[11px] font-medium text-gray-500">
              <li><a href="#" className="hover:text-white transition-colors">Adaptive Practice</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Real-time Grading</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Weak-Topic Reports</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-[10px] font-bold tracking-widest text-gray-400 uppercase mb-4">Exams</h4>
            <ul className="space-y-2 text-[11px] font-medium text-gray-500">
              <li><a href="#" className="hover:text-white transition-colors">JEE Main & Advanced</a></li>
              <li><a href="#" className="hover:text-white transition-colors">NEET Preparation</a></li>
              <li><a href="#" className="hover:text-white transition-colors">UPSC Civil Services</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-[10px] font-bold tracking-widest text-gray-400 uppercase mb-4">Legal</h4>
            <ul className="space-y-2 text-[11px] font-medium text-gray-500">
              <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
            </ul>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 border-t border-gray-800/50 pt-8 text-center">
          <p className="text-[10px] text-gray-600 font-medium">
            © 2026 RankForge AI. Adaptive Excellence. All Rights Reserved.
          </p>
        </div>
      </footer>

    </div>
  );
}

export default Home;

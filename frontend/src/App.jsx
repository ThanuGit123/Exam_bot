import React from 'react';
import { Bot, ChevronRight, Activity, BookOpen, BarChart3 } from 'lucide-react';

function App() {
  return (
    <div className="min-h-screen bg-[#07080f] text-white selection:bg-blue-500/30 relative z-0">
      {/* Dynamic Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-600/20 blur-[120px] animate-blob"></div>
        <div className="absolute top-[20%] right-[-10%] w-[30%] h-[50%] rounded-full bg-indigo-600/20 blur-[120px] animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-[-20%] left-[20%] w-[50%] h-[50%] rounded-full bg-blue-800/20 blur-[120px] animate-blob animation-delay-4000"></div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4IiBoZWlnaHQ9IjgiPgo8cmVjdCB3aWR0aD0iOCIgaGVpZ2h0PSI4IiBmaWxsPSIjZmZmIiBmaWxsLW9wYWNpdHk9IjAuMDIiLz4KPHBhdGggZD0iTTAgMEg4VjhIMHoiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI2ZmZiIHN0cm9rZS1vcGFjaXR5PSIwLjA1IiBzdHJva2Utd2lkdGg9IjEiLz4KPC9zdmc+')] opacity-50"></div>
      </div>
      {/* Navigation */}
      <nav className="flex items-center justify-between px-8 py-6 max-w-7xl mx-auto border-b border-white/5">
        <div className="flex items-center gap-2">
          <Bot className="w-6 h-6 text-blue-500" />
          <span className="text-xl font-mono font-bold tracking-tight">RankForge</span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm text-gray-400">
          <a href="#" className="text-blue-500 font-medium">Home</a>
          <a href="#" className="hover:text-white transition-colors">Features</a>
          <a href="#" className="hover:text-white transition-colors">How it works</a>
          <a href="#" className="hover:text-white transition-colors">Exams</a>
        </div>
        <div className="flex items-center gap-4">
          <button className="text-sm font-medium text-gray-300 hover:text-white transition-colors">Sign In</button>
          <button className="px-4 py-2 text-sm font-medium font-mono bg-blue-600 hover:bg-blue-500 text-white rounded-md transition-colors">
            START PRACTICING
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-8 py-20 grid lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-8">
          <h1 className="text-5xl lg:text-6xl font-mono font-bold leading-tight tracking-tight uppercase">
            Master JEE, NEET & UPSC <br />
            <span className="text-blue-500">with Adaptive AI.</span>
          </h1>
          <p className="text-gray-400 text-lg leading-relaxed max-w-xl">
            RankForge evolves with you. Experience real-time adaptation and personalized mock tests engineered for India's toughest competitive exams.
          </p>
          <div className="flex items-center gap-4 font-mono">
            <button className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-lg transition-colors flex items-center gap-2 shadow-[0_0_20px_rgba(37,99,235,0.3)]">
              START PRACTICING NOW
            </button>
            <button className="px-6 py-3 bg-white/5 hover:bg-white/10 text-white font-medium rounded-lg transition-colors border border-white/10">
              TRY IT NOW
            </button>
          </div>
          <div className="pt-8 grid grid-cols-2 gap-8 border-t border-white/5 max-w-md">
            <div>
              <p className="text-blue-500 font-bold text-xl mb-1">3-in-1</p>
              <p className="text-xs text-gray-500 tracking-wider font-semibold">PRACTICE • GRADING • REPORTS</p>
            </div>
            <div>
              <p className="text-blue-500 font-bold text-xl mb-1">24/7</p>
              <p className="text-xs text-gray-500 tracking-wider font-semibold">ALWAYS AVAILABLE</p>
            </div>
          </div>
        </div>

        {/* Dashboard Graphic Mockup */}
        <div className="relative border border-white/10 bg-[#0f111a] rounded-xl p-4 shadow-2xl shadow-blue-900/20">
          <div className="flex items-center gap-2 mb-4 border-b border-white/5 pb-4">
            <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
            <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
            <div className="ml-4 text-xs text-gray-500 font-mono">rankforge-prep/dashboard</div>
          </div>
          
          <div className="grid grid-cols-3 gap-4 mb-4">
             <div className="bg-white/5 rounded p-4 border border-white/5">
                <div className="w-12 h-12 rounded-full border-4 border-blue-500/30 border-t-blue-500 mx-auto mb-2 flex items-center justify-center">
                  <span className="text-xs font-bold text-blue-400">84%</span>
                </div>
                <p className="text-[10px] text-center text-gray-400 uppercase tracking-wider">Physics</p>
             </div>
             <div className="col-span-2 bg-gradient-to-r from-blue-900/20 to-transparent rounded p-4 border border-white/5 flex items-end">
                <div className="w-full flex items-end gap-1 h-12">
                   {[40, 60, 45, 80, 65, 90, 75, 85].map((h, i) => (
                      <div key={i} className="flex-1 bg-blue-500/40 rounded-t" style={{height: `${h}%`}}></div>
                   ))}
                </div>
             </div>
          </div>
          
          <div className="bg-gradient-to-r from-blue-600/20 to-transparent border border-blue-500/20 rounded-lg p-4 flex justify-between items-center">
             <div>
               <p className="text-[10px] text-blue-400 uppercase tracking-wider font-semibold mb-1">Real-time Analysis</p>
               <p className="font-medium text-white">Efficiency: 94.2%</p>
             </div>
             <BarChart3 className="w-6 h-6 text-blue-500" />
          </div>
        </div>
      </main>

      {/* Focus Section */}
      <section className="border-y border-white/5 bg-white/[0.02]">
        <div className="max-w-7xl mx-auto px-8 py-8 flex flex-wrap items-center justify-center gap-6 text-sm font-medium text-gray-400">
           <span className="tracking-widest uppercase text-xs text-gray-500 mr-4">Focusing On</span>
           <span className="px-4 py-1.5 rounded-full bg-white/5 border border-white/10 hover:border-blue-500/50 transition-colors cursor-pointer">JEE (MAINS/ADV)</span>
           <span className="px-4 py-1.5 rounded-full bg-white/5 border border-white/10 hover:border-blue-500/50 transition-colors cursor-pointer">NEET (UG)</span>
           <span className="px-4 py-1.5 rounded-full bg-white/5 border border-white/10 hover:border-blue-500/50 transition-colors cursor-pointer">UPSC (CSE)</span>
           <span className="px-4 py-1.5 rounded-full bg-white/5 border border-white/10 hover:border-blue-500/50 transition-colors cursor-pointer">GATE (TECH)</span>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-8 py-24">
         <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Precision-Engineered Learning</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
               Our AI engine processes millions of data points to ensure every second you spend studying contributes directly to your score.
            </p>
         </div>

         <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-[#0f111a] border border-blue-500/20 rounded-xl p-8 hover:border-blue-500/50 transition-colors">
               <div className="w-10 h-10 rounded bg-blue-500/10 flex items-center justify-center mb-6">
                  <Activity className="w-5 h-5 text-blue-500" />
               </div>
               <h3 className="text-xl font-bold mb-3">Adaptive Practice</h3>
               <p className="text-sm text-gray-400 leading-relaxed">
                  The difficulty of questions adjusts in real-time based on your speed and accuracy, keeping you in the optimal learning zone.
               </p>
            </div>

            <div className="bg-[#0f111a] border border-[#10b981]/20 rounded-xl p-8 hover:border-[#10b981]/50 transition-colors">
               <div className="w-10 h-10 rounded bg-[#10b981]/10 flex items-center justify-center mb-6">
                  <BookOpen className="w-5 h-5 text-[#10b981]" />
               </div>
               <h3 className="text-xl font-bold mb-3">Real-time Grading</h3>
               <p className="text-sm text-gray-400 leading-relaxed">
                  Immediate step-by-step feedback on every problem. Understand exactly where you went wrong before moving to the next step.
               </p>
            </div>

            <div className="bg-[#0f111a] border border-white/5 rounded-xl p-8 hover:border-white/20 transition-colors">
               <div className="w-10 h-10 rounded bg-white/5 flex items-center justify-center mb-6">
                  <BarChart3 className="w-5 h-5 text-gray-300" />
               </div>
               <h3 className="text-xl font-bold mb-3">Weak-Topic Reports</h3>
               <p className="text-sm text-gray-400 leading-relaxed">
                  Deep-dive analytics identify your hidden knowledge gaps and create personalized roadmaps for rapid score improvement.
               </p>
            </div>
         </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-4xl mx-auto px-8 py-24 text-center">
         <div className="bg-gradient-to-b from-[#0f111a] to-[#07080f] border border-white/5 rounded-2xl p-12 shadow-2xl">
            <h2 className="text-3xl font-bold mb-6">Ready to bridge the gap between effort and results?</h2>
            
            <div className="max-w-md mx-auto relative mt-8 mb-4">
               <input 
                  type="text" 
                  placeholder="Type something to start..." 
                  className="w-full bg-[#0a0b14] border border-white/10 rounded-full py-4 px-6 text-sm outline-none focus:border-blue-500/50 transition-colors italic text-gray-400"
                  disabled
               />
               <button className="absolute right-2 top-2 bottom-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium px-6 rounded-full transition-colors flex items-center gap-2 shadow-[0_0_15px_rgba(37,99,235,0.4)]">
                  Get Your First Mock Test Free
               </button>
            </div>
            <p className="text-xs text-gray-500 uppercase tracking-widest mt-6 font-semibold">Join 500,000+ Students Today</p>
         </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 pt-16 pb-8">
         <div className="max-w-7xl mx-auto px-8 grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
            <div className="col-span-2">
               <div className="flex items-center gap-2 mb-4">
                  <Bot className="w-5 h-5 text-blue-500" />
                  <span className="text-lg font-bold">RankForge</span>
               </div>
               <p className="text-sm text-gray-500 max-w-xs">
                  Precision engineering for the next generation of top performers in India.
               </p>
            </div>
            <div>
               <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">Platform</h4>
               <ul className="space-y-2 text-sm text-gray-400">
                  <li><a href="#" className="hover:text-blue-400 transition-colors">Adaptive Practice</a></li>
                  <li><a href="#" className="hover:text-blue-400 transition-colors">Real-time Grading</a></li>
                  <li><a href="#" className="hover:text-blue-400 transition-colors">Weak-Topic Reports</a></li>
               </ul>
            </div>
            <div>
               <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">Exams</h4>
               <ul className="space-y-2 text-sm text-gray-400">
                  <li><a href="#" className="hover:text-blue-400 transition-colors">JEE Main & Advanced</a></li>
                  <li><a href="#" className="hover:text-blue-400 transition-colors">NEET Preparation</a></li>
                  <li><a href="#" className="hover:text-blue-400 transition-colors">UPSC Civil Services</a></li>
               </ul>
            </div>
         </div>
         <div className="max-w-7xl mx-auto px-8 text-center text-xs text-gray-600">
            © {new Date().getFullYear()} RankForge AI. Adaptive Excellence. All Rights Reserved.
         </div>
      </footer>
    </div>
  );
}

export default App;

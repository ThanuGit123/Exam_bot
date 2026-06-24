import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Leaf, User, Mail, Lock, EyeOff, ArrowRight, Loader2 } from 'lucide-react';

function Signup() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ full_name: '', email: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('http://127.0.0.1:8000/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || 'Signup failed');
      }

      // Success - Redirect to login
      navigate('/login');
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative bg-[#1a1a1e]">
      {/* Dotted background pattern */}
      <div className="absolute inset-0 z-0" 
           style={{
             backgroundImage: 'radial-gradient(#333 1px, transparent 1px)',
             backgroundSize: '20px 20px'
           }}>
      </div>
      
      <div className="relative z-10 w-full max-w-[400px] bg-[#f9faf8] rounded-2xl p-10 shadow-2xl border-4 border-[#6366f1]/20">
        <div className="flex flex-col items-center mb-8">
          <Leaf className="w-8 h-8 text-[#4B7B5A] mb-2" />
          <Link to="/" className="hover:opacity-80 transition-opacity">
            <h1 className="text-3xl font-serif font-bold text-[#2d3748] tracking-tight">Adept</h1>
          </Link>
          <p className="text-[#718096] text-sm mt-1">Join our organic community.</p>
        </div>

        {/* Progress indicator */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="w-8 h-1.5 rounded-full bg-[#4B7B5A]"></div>
          <div className="w-8 h-1.5 rounded-full bg-[#e2e8f0]"></div>
          <div className="w-8 h-1.5 rounded-full bg-[#e2e8f0]"></div>
          <span className="text-xs text-[#718096] font-medium ml-2">Step 1 of 3</span>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-200 text-red-600 rounded-lg text-sm text-center">
            {error}
          </div>
        )}

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#4a5568]">Full Name</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="w-4 h-4 text-[#a0aec0]" />
              </div>
              <input 
                type="text" 
                name="full_name"
                value={formData.full_name}
                onChange={handleChange}
                required
                placeholder="Jane Doe" 
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#e2e8f0] rounded-xl text-sm text-[#2d3748] placeholder-[#cbd5e0] focus:outline-none focus:border-[#4B7B5A] focus:ring-1 focus:ring-[#4B7B5A] transition-all"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#4a5568]">Email Address</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="w-4 h-4 text-[#a0aec0]" />
              </div>
              <input 
                type="email" 
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="jane@example.com" 
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#e2e8f0] rounded-xl text-sm text-[#2d3748] placeholder-[#cbd5e0] focus:outline-none focus:border-[#4B7B5A] focus:ring-1 focus:ring-[#4B7B5A] transition-all"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#4a5568]">Create Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="w-4 h-4 text-[#a0aec0]" />
              </div>
              <input 
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                minLength={8}
                placeholder="••••••••" 
                className="w-full pl-10 pr-10 py-2.5 bg-white border border-[#e2e8f0] rounded-xl text-sm text-[#2d3748] placeholder-[#cbd5e0] tracking-widest focus:outline-none focus:border-[#4B7B5A] focus:ring-1 focus:ring-[#4B7B5A] transition-all"
              />
              <button type="button" className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#a0aec0] hover:text-[#4a5568]">
                <EyeOff className="w-4 h-4" />
              </button>
            </div>
          </div>

          <button 
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#4B7B5A] hover:bg-[#3a5e45] disabled:bg-[#4B7B5A]/70 text-white font-semibold py-3.5 rounded-xl flex items-center justify-center gap-2 transition-colors mt-6 shadow-lg shadow-[#4B7B5A]/20"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>Create Account <ArrowRight className="w-4 h-4" /></>
            )}
          </button>
        </form>

        <div className="mt-8 text-center text-sm text-[#718096]">
          Already have an account? <Link to="/login" className="text-[#4B7B5A] font-semibold hover:underline">Log in</Link>
        </div>
      </div>
    </div>
  );
}

export default Signup;

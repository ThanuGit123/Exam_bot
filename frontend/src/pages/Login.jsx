import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Loader2 } from 'lucide-react';

function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
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
      const response = await fetch('http://127.0.0.1:8000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || 'Login failed');
      }

      // Success - Redirect to practice chat
      navigate('/chat');
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
      
      <div className="relative z-10 w-full max-w-[400px] bg-[#f9faf8] rounded-xl overflow-hidden shadow-2xl">
        {/* Mountain Graphic Header */}
        <div className="relative h-64 bg-gradient-to-b from-[#b8c6c9] to-[#e6e9e5] flex items-end justify-center pb-6">
          <img 
            src="/adept_mountain.png" 
            alt="Mountain Abstract" 
            className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-80"
          />
          {/* Fading bottom edge to blend into card background */}
          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#f9faf8] to-transparent"></div>
          <Link to="/" className="relative z-10 hover:opacity-80 transition-opacity">
            <h1 className="text-4xl font-serif font-bold text-[#4B7B5A] tracking-tight">Adept</h1>
          </Link>
        </div>

        <div className="px-10 pb-10">
          <p className="text-center text-[#7c8b9a] font-medium text-sm mb-6">Your AI interview trainer</p>

          {error && (
            <div className="mb-6 p-3 bg-red-100 border border-red-200 text-red-600 rounded-lg text-sm text-center">
              {error}
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="relative">
              <input 
                type="email" 
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="Email address" 
                className="w-full bg-transparent border-b border-gray-300 py-3 text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#4B7B5A] transition-colors text-sm"
              />
            </div>

            <div className="relative">
              <input 
                type="password" 
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="Password" 
                className="w-full bg-transparent border-b border-gray-300 py-3 text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#4B7B5A] transition-colors text-sm pr-16"
              />
              <Link to="/forgot-password" className="absolute right-0 top-1/2 -translate-y-1/2 text-xs font-semibold text-[#4B7B5A] hover:text-[#3a5e45] transition-colors">
                Forgot?
              </Link>
            </div>

            <button 
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#4B7B5A] hover:bg-[#3a5e45] disabled:bg-[#4B7B5A]/70 text-white font-semibold py-3.5 rounded-lg flex items-center justify-center gap-2 transition-colors mt-8"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>Log in <ArrowRight className="w-4 h-4" /></>
              )}
            </button>
          </form>

          <div className="mt-8 text-center text-sm text-[#7c8b9a]">
            No account? <Link to="/signup" className="text-[#4B7B5A] font-semibold hover:underline">Sign up</Link>
          </div>

          <div className="mt-12 text-center">
            <span className="text-[10px] font-bold tracking-[0.2em] text-[#d1d5d8]">
              • ENTERPRISE READY •
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;

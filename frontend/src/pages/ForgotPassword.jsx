import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Loader2, MailCheck } from 'lucide-react';

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState(''); // 'idle', 'loading', 'success', 'error'
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setStatus('loading');

    try {
      const response = await fetch('http://127.0.0.1:8000/api/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || 'Failed to send reset link');
      }

      setStatus('success');
      setMessage(data.message);
    } catch (err) {
      setStatus('error');
      setMessage(err.message);
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
      
      <div className="relative z-10 w-full max-w-[400px] bg-[#f9faf8] rounded-xl overflow-hidden shadow-2xl p-10">
        <h1 className="text-3xl font-serif font-bold text-[#4B7B5A] tracking-tight mb-2 text-center">Reset Password</h1>
        <p className="text-center text-[#7c8b9a] font-medium text-sm mb-8">Enter your email to receive a reset link</p>

        {status === 'success' ? (
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 bg-[#4B7B5A]/10 rounded-full flex items-center justify-center mb-4">
              <MailCheck className="w-8 h-8 text-[#4B7B5A]" />
            </div>
            <p className="text-center text-sm text-gray-700 font-medium mb-8">
              {message}
            </p>
            <Link to="/login" className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-3.5 rounded-lg flex items-center justify-center transition-colors">
              Return to Login
            </Link>
          </div>
        ) : (
          <form className="space-y-6" onSubmit={handleSubmit}>
            {status === 'error' && (
              <div className="p-3 bg-red-100 border border-red-200 text-red-600 rounded-lg text-sm text-center">
                {message}
              </div>
            )}

            <div className="relative">
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="Email address" 
                className="w-full bg-transparent border-b border-gray-300 py-3 text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#4B7B5A] transition-colors text-sm"
              />
            </div>

            <button 
              type="submit"
              disabled={isLoading || !email}
              className="w-full bg-[#4B7B5A] hover:bg-[#3a5e45] disabled:bg-[#4B7B5A]/70 text-white font-semibold py-3.5 rounded-lg flex items-center justify-center gap-2 transition-colors mt-8"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>Send Reset Link <ArrowRight className="w-4 h-4" /></>
              )}
            </button>

            <div className="mt-8 text-center text-sm text-[#7c8b9a]">
              Remembered? <Link to="/login" className="text-[#4B7B5A] font-semibold hover:underline">Log in</Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default ForgotPassword;

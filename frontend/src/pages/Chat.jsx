import React, { useState } from 'react';
import { Leaf, Send, Sparkles, MessageSquare } from 'lucide-react';

function Chat() {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hello! I am your Adept AI interviewer. Are you ready to begin your technical interview practice session?' }
  ]);
  const [input, setInput] = useState('');

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Add user message
    const newMessages = [...messages, { role: 'user', content: input }];
    setMessages(newMessages);
    setInput('');

    // Simulate AI response for now (to be wired up to LangGraph later)
    setTimeout(() => {
      setMessages(prev => [
        ...prev, 
        { role: 'assistant', content: "That's a great start! Let's dive into your first question. How would you design a distributed key-value store?" }
      ]);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-[#f9faf8] flex flex-col font-sans text-gray-800">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white px-6 py-4 flex items-center justify-between shadow-sm z-10">
        <div className="flex items-center gap-2">
          <Leaf className="w-6 h-6 text-[#4B7B5A]" />
          <h1 className="text-xl font-serif font-bold text-[#4B7B5A]">Adept Practice</h1>
        </div>
        <div className="flex items-center gap-4 text-sm font-medium text-gray-500">
          <span className="flex items-center gap-1"><Sparkles className="w-4 h-4 text-[#4B7B5A]" /> AI Mode Active</span>
          <div className="w-8 h-8 rounded-full bg-[#4B7B5A]/10 flex items-center justify-center text-[#4B7B5A] border border-[#4B7B5A]/20">
            <UserIcon />
          </div>
        </div>
      </header>

      {/* Main Chat Area */}
      <main className="flex-1 max-w-4xl w-full mx-auto p-4 md:p-6 flex flex-col overflow-hidden">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto space-y-6 pb-4 scrollbar-hide">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex gap-4 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              {msg.role === 'assistant' && (
                <div className="w-8 h-8 rounded-full bg-[#4B7B5A] flex items-center justify-center flex-shrink-0 text-white mt-1 shadow-md">
                  <Leaf className="w-4 h-4" />
                </div>
              )}
              
              <div className={`max-w-[80%] rounded-2xl p-4 shadow-sm ${
                msg.role === 'user' 
                  ? 'bg-[#4B7B5A] text-white rounded-br-none' 
                  : 'bg-white border border-gray-100 rounded-bl-none text-gray-800'
              }`}>
                <p className="leading-relaxed">{msg.content}</p>
              </div>

              {msg.role === 'user' && (
                <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0 text-gray-500 mt-1">
                  <UserIcon />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Input Area */}
        <div className="mt-4 pt-4 border-t border-gray-200">
          <form onSubmit={handleSend} className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <MessageSquare className="w-5 h-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your answer..."
              className="w-full pl-12 pr-14 py-4 bg-white border border-gray-200 rounded-2xl shadow-sm focus:outline-none focus:border-[#4B7B5A] focus:ring-1 focus:ring-[#4B7B5A] transition-all text-base"
            />
            <button
              type="submit"
              disabled={!input.trim()}
              className="absolute inset-y-2 right-2 px-3 bg-[#4B7B5A] hover:bg-[#3a5e45] disabled:bg-gray-300 text-white rounded-xl flex items-center justify-center transition-colors shadow-sm"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
          <div className="text-center mt-3">
            <span className="text-xs text-gray-400 font-medium tracking-wide">
              ADEPT AI INTERVIEW SYSTEM • PRESS ENTER TO SEND
            </span>
          </div>
        </div>
      </main>
    </div>
  );
}

function UserIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
      <circle cx="12" cy="7" r="4"></circle>
    </svg>
  );
}

export default Chat;

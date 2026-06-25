import React, { useState, useEffect, useRef } from 'react';
import { 
  BookOpen, Plus, Search, RotateCcw, Settings, HelpCircle, LogOut, 
  User, Moon, Sun, MoreHorizontal, GraduationCap, Copy, Bookmark, ThumbsUp, 
  Paperclip, Mic, Code, List, Send, Check, CheckCheck, X, Target
} from 'lucide-react';

function Chat() {
  const [messages, setMessages] = useState([
    { 
      role: 'assistant', 
      type: 'standard',
      time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
      content: "Welcome to Adept Tutor! I am your AI study companion. Please select a course from your profile to begin."
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [ws, setWs] = useState(null);
  
  // New States
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isCourseModalOpen, setIsCourseModalOpen] = useState(false);
  const [userCourse, setUserCourse] = useState('JEE');
  const [userSubject, setUserSubject] = useState('');
  
  const courseSubjects = {
    JEE: ['Maths', 'Physics', 'Chemistry'],
    NEET: ['Physics', 'Chemistry', 'Biology'],
    UPSC: ['History', 'Geography', 'Polity', 'Economy', 'Science & Tech'],
    GATE: ['Aptitude', 'Engineering Mathematics', 'Core Subjects']
  };
  
  const messagesEndRef = useRef(null);
  const currentBotMessageRef = useRef('');

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const toggleDarkMode = () => setIsDarkMode(!isDarkMode);

  useEffect(() => {
    // Dark mode toggle on root element
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  useEffect(() => {
    // Setup WebSocket connection to LangGraph Streaming Agent
    let socket = new WebSocket('ws://localhost:8000/api/chat/stream');
    
    socket.onopen = () => console.log('Connected to LangGraph WebSocket');
    
    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'token') {
        setIsTyping(false); // Stop the "reflecting..." animation once tokens start arriving
        currentBotMessageRef.current += data.content;
        
        setMessages(prev => {
          const newMsgs = [...prev];
          const lastMsg = newMsgs[newMsgs.length - 1];
          if (lastMsg && lastMsg.role === 'assistant' && lastMsg.isStreaming) {
            lastMsg.content = currentBotMessageRef.current;
          } else {
            newMsgs.push({
              role: 'assistant',
              type: 'standard',
              time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
              content: currentBotMessageRef.current,
              isStreaming: true
            });
          }
          return newMsgs;
        });
      } else if (data.type === 'done' || data.type === 'error') {
        setIsTyping(false);
        setMessages(prev => {
          const newMsgs = [...prev];
          const lastMsg = newMsgs[newMsgs.length - 1];
          
          if (lastMsg && lastMsg.isStreaming) {
            lastMsg.isStreaming = false;
          }
          
          if (data.type === 'error') {
            if (!lastMsg || lastMsg.role !== 'assistant') {
               newMsgs.push({
                 role: 'assistant',
                 type: 'standard',
                 time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
                 content: "⚠️ Error from AI engine: " + data.content
               });
            } else {
               lastMsg.content += "\n\n⚠️ Error: " + data.content;
            }
          }
          return newMsgs;
        });
      }
    };

    setWs(socket);

    return () => {
      socket.close();
    };
  }, []);

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    if (!ws || ws.readyState !== WebSocket.OPEN) {
      alert("Lost connection to the AI engine. Please refresh the page to reconnect.");
      setIsTyping(false);
      return;
    }

    const userMessage = { role: 'user', content: input, time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) };
    setMessages(prev => [...prev, userMessage]);
    
    // Reset streaming ref for the next response
    currentBotMessageRef.current = '';
    
    setIsTyping(true);
    
    ws.send(JSON.stringify({
      message: input,
      model: 'groq',
      thread_id: 'session_1',
      course: userCourse,
      subject: userSubject
    }));
    
    setInput('');
  };

  const handleLogout = () => {
    // Handle logout logic here (e.g., clear tokens, redirect to login)
    window.location.href = '/login';
  };

  return (
    <div className={`flex h-screen bg-gray-50 dark:bg-[#07080f] font-sans text-gray-800 dark:text-gray-100 overflow-hidden transition-colors duration-300`}>
      
      {/* Course Selection Modal */}
      {isCourseModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#111222] border border-gray-200 dark:border-gray-800 rounded-2xl w-full max-w-md shadow-2xl p-6 transform transition-all">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Target className="w-5 h-5 text-blue-600" /> My Profile Setup
              </h3>
              <button onClick={() => setIsCourseModalOpen(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Select your target exam or course of study to tailor the AI's curriculum and knowledge base.</p>
            
            <div className="space-y-3">
              {['JEE', 'NEET', 'UPSC', 'GATE'].map((course) => (
                <div key={course} className="space-y-2">
                  <button
                    onClick={() => {
                      setUserCourse(course);
                      setUserSubject('');
                    }}
                    className={`w-full flex items-center justify-between p-4 rounded-xl border ${
                      userCourse === course 
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-500/10 dark:border-blue-500 text-blue-700 dark:text-blue-300' 
                        : 'border-gray-200 dark:border-gray-700 hover:border-blue-300 hover:bg-gray-50 dark:hover:bg-[#1a1b2e] dark:text-gray-200'
                    } transition-all`}
                  >
                    <span className="font-semibold">{course}</span>
                    {userCourse === course && <Check className="w-5 h-5 text-blue-600 dark:text-blue-400" />}
                  </button>
                  
                  {userCourse === course && (
                    <div className="flex flex-wrap gap-2 pl-2">
                      {courseSubjects[course].map((subject) => (
                        <button
                          key={subject}
                          onClick={() => {
                            setUserSubject(subject);
                            setIsCourseModalOpen(false);
                            setMessages([
                              {
                                role: 'assistant',
                                type: 'standard',
                                time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
                                content: `Welcome to your ${course} adaptive preparation for ${subject}! I am your Adept AI tutor. Let's get started. What topic or concept would you like to focus on today?`
                              }
                            ]);
                          }}
                          className={`px-3 py-1.5 text-sm font-medium rounded-lg border transition-all ${
                            userSubject === subject
                              ? 'bg-blue-600 border-blue-600 text-white shadow-sm'
                              : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1a1b2e] text-gray-700 dark:text-gray-300 hover:border-blue-300 dark:hover:border-blue-500 hover:text-blue-600 dark:hover:text-blue-400'
                          }`}
                        >
                          {subject}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Sidebar */}
      <aside className="w-[280px] bg-[#f9fafb] dark:bg-[#0a0a14] border-r border-gray-200 dark:border-gray-800 flex flex-col flex-shrink-0 transition-colors duration-300">
        <div className="p-6 pb-2">
          {/* Logo Area */}
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white shadow-sm">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-blue-700 dark:text-blue-500 leading-tight">Adept</h1>
              <p className="text-[10px] font-bold text-gray-500 dark:text-gray-400 tracking-wider">SCHOLARLY EDITION</p>
            </div>
          </div>

          <button className="w-full py-2.5 bg-[#1d4ed8] hover:bg-blue-700 text-white rounded-md flex items-center justify-center gap-2 text-sm font-semibold transition-colors shadow-sm">
            <Plus className="w-4 h-4" /> New Session
          </button>
        </div>

        {/* Chat History List */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <span className="text-[10px] font-bold text-gray-400 tracking-widest uppercase">Chat History</span>
            <Search className="w-3.5 h-3.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 cursor-pointer" />
          </div>
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white cursor-pointer group">
              <RotateCcw className="w-4 h-4 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300" />
              <span className="truncate">Graph Theory Optimization</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white cursor-pointer group">
              <RotateCcw className="w-4 h-4 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300" />
              <span className="truncate">Dynamic Programming Pa...</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white cursor-pointer group">
              <RotateCcw className="w-4 h-4 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300" />
              <span className="truncate">Systems Design: Microser...</span>
            </div>
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="p-6 space-y-4 border-t border-gray-200/50 dark:border-gray-800/50">
          <button className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white w-full">
            <Settings className="w-4 h-4" /> Settings
          </button>
          <button className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white w-full">
            <HelpCircle className="w-4 h-4" /> Help Center
          </button>
          <button onClick={handleLogout} className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 w-full pt-2">
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </div>
      </aside>

      {/* Main Chat Area */}
      <main className="flex-1 flex flex-col bg-white dark:bg-[#07080f] min-w-0 transition-colors duration-300 relative">
        
        {/* Header */}
        <header className="h-16 border-b border-gray-100 dark:border-gray-800/60 px-8 flex items-center justify-between flex-shrink-0 relative">
          <div className="flex items-center gap-3">
            <h2 className="font-bold text-gray-700 dark:text-gray-200">{userCourse} {userSubject ? `- ${userSubject}` : ''}</h2>
            <span className="px-2.5 py-0.5 bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-300 text-[10px] font-bold tracking-widest rounded-full">ACTIVE SESSION</span>
          </div>
          <div className="flex items-center gap-5 text-gray-400 dark:text-gray-500 relative">
            
            {/* Profile Dropdown Trigger */}
            <div className="relative">
              <User 
                className={`w-5 h-5 cursor-pointer ${isProfileOpen ? 'text-blue-600' : 'hover:text-gray-600 dark:hover:text-gray-300'}`} 
                onClick={() => setIsProfileOpen(!isProfileOpen)}
              />
              {/* Dropdown Menu */}
              {isProfileOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setIsProfileOpen(false)}></div>
                  <div className="absolute right-0 mt-3 w-48 bg-white dark:bg-[#111222] border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg py-1 z-20 overflow-hidden">
                    <button 
                      onClick={() => {
                        setIsCourseModalOpen(true);
                        setIsProfileOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#1a1b2e] flex items-center gap-2"
                    >
                      <Target className="w-4 h-4" /> My Profile
                    </button>
                    <div className="h-px bg-gray-200 dark:bg-gray-700 my-1"></div>
                    <button 
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 flex items-center gap-2"
                    >
                      <LogOut className="w-4 h-4" /> Logout
                    </button>
                  </div>
                </>
              )}
            </div>

            {/* Dark Mode Toggle */}
            <button onClick={toggleDarkMode} className="hover:text-gray-600 dark:hover:text-yellow-400 transition-colors">
              {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            
            <MoreHorizontal className="w-5 h-5 hover:text-gray-600 dark:hover:text-gray-300 cursor-pointer" />
          </div>
        </header>

        {/* Messages Scroll Area */}
        <div className="flex-1 overflow-y-auto px-8 lg:px-20 py-8 scrollbar-thin scrollbar-thumb-gray-200 dark:scrollbar-thumb-gray-800">
          <div className="max-w-3xl mx-auto space-y-10">
            
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} w-full`}>
                
                {/* AI Message */}
                {msg.role === 'assistant' && (
                  <div className="flex gap-4 max-w-[85%]">
                    <div className="w-10 h-10 bg-blue-50/80 dark:bg-blue-900/30 rounded-md border border-blue-100 dark:border-blue-800 flex items-center justify-center flex-shrink-0 text-blue-600 dark:text-blue-400 mt-1">
                      <GraduationCap className="w-5 h-5" />
                    </div>
                    <div className="flex flex-col">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs font-bold text-blue-600 dark:text-blue-400 tracking-wide uppercase">Adept Tutor</span>
                        <span className="text-[10px] text-gray-400">{msg.time}</span>
                      </div>
                      
                      {msg.type === 'feedback_question' ? (
                        <div className="text-gray-800 dark:text-gray-200 text-[15px] leading-relaxed">
                          <h3 className="font-bold text-gray-900 dark:text-white mb-2">Feedback</h3>
                          <p className="mb-6">{msg.feedbackText}</p>
                          <h3 className="font-bold text-gray-900 dark:text-white mb-3">Next Question</h3>
                          <div className="bg-gray-50/80 dark:bg-gray-800/50 border-l-2 border-blue-600 dark:border-blue-500 p-5 rounded-r-md">
                            {msg.questionText}
                          </div>
                        </div>
                      ) : (
                        <div className="text-gray-800 dark:text-gray-200 text-[15px] leading-relaxed whitespace-pre-wrap">
                          {msg.content}
                          {msg.isStreaming && <span className="inline-block w-2 h-4 bg-blue-600 dark:bg-blue-400 ml-1 animate-pulse align-middle"></span>}
                        </div>
                      )}

                      {/* AI Action Icons */}
                      <div className="flex items-center gap-4 mt-3 text-gray-400 dark:text-gray-500">
                        <Copy className="w-3.5 h-3.5 hover:text-gray-600 dark:hover:text-gray-300 cursor-pointer" />
                        <Bookmark className="w-3.5 h-3.5 hover:text-gray-600 dark:hover:text-gray-300 cursor-pointer" />
                        <ThumbsUp className="w-3.5 h-3.5 hover:text-gray-600 dark:hover:text-gray-300 cursor-pointer" />
                      </div>
                    </div>
                  </div>
                )}

                {/* User Message */}
                {msg.role === 'user' && (
                  <div className="flex flex-col items-end max-w-[75%]">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="text-[10px] text-gray-400">{msg.time}</span>
                      <span className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase">You</span>
                      <div className="w-5 h-5 bg-gray-200 dark:bg-gray-700 rounded overflow-hidden flex-shrink-0">
                        <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="User" className="w-full h-full object-cover" />
                      </div>
                    </div>
                    <div className="bg-[#f3f4f6] dark:bg-[#1a1b2e] text-gray-800 dark:text-gray-200 rounded-2xl rounded-tr-sm px-5 py-3.5 text-[15px] border border-transparent dark:border-gray-800/50">
                      {msg.content}
                    </div>
                    <div className="flex items-center gap-1 mt-1.5 text-[10px] text-gray-400">
                      <CheckCheck className="w-3 h-3 text-blue-400 dark:text-blue-500" /> Read
                    </div>
                  </div>
                )}

              </div>
            ))}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex gap-4 max-w-[85%]">
                <div className="w-10 h-10 bg-blue-50/80 dark:bg-blue-900/30 rounded-md border border-blue-100 dark:border-blue-800 flex items-center justify-center flex-shrink-0 text-blue-600 dark:text-blue-400 mt-1">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <div className="flex flex-col justify-center">
                  <div className="flex items-center gap-2 text-sm text-gray-400 italic">
                    Adept is reflecting... 
                    <div className="flex gap-1 ml-1">
                      <div className="w-1 h-1 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                      <div className="w-1 h-1 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                      <div className="w-1 h-1 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input Area */}
        <div className="px-8 lg:px-20 pb-6 pt-2 flex-shrink-0 bg-white/80 dark:bg-[#07080f]/80 backdrop-blur-sm">
          <div className="max-w-3xl mx-auto">
            <form 
              onSubmit={handleSend}
              className="border border-gray-200 dark:border-gray-800 rounded-2xl p-3 bg-white dark:bg-[#111222] shadow-[0_2px_10px_rgba(0,0,0,0.02)] transition-shadow focus-within:shadow-[0_4px_20px_rgba(0,0,0,0.05)] focus-within:border-gray-300 dark:focus-within:border-gray-700"
            >
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your answer... (Markdown supported)"
                className="w-full resize-none outline-none text-[15px] bg-transparent text-gray-700 dark:text-gray-200 min-h-[60px] p-2 placeholder-gray-300 dark:placeholder-gray-600"
                disabled={isTyping}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSend(e);
                  }
                }}
              />
              
              <div className="flex items-center justify-between mt-2 px-1">
                {/* Left tools */}
                <div className="flex items-center gap-4 text-gray-400 dark:text-gray-500">
                  <button type="button" className="hover:text-gray-600 dark:hover:text-gray-300 transition-colors"><Paperclip className="w-4 h-4" /></button>
                  <button type="button" className="hover:text-gray-600 dark:hover:text-gray-300 transition-colors"><Mic className="w-4 h-4" /></button>
                  <div className="w-px h-4 bg-gray-200 dark:bg-gray-700 mx-1"></div>
                  <button type="button" className="hover:text-gray-600 dark:hover:text-gray-300 transition-colors"><Code className="w-4 h-4" /></button>
                  <button type="button" className="hover:text-gray-600 dark:hover:text-gray-300 transition-colors"><List className="w-4 h-4" /></button>
                </div>

                {/* Right tools */}
                <div className="flex items-center gap-3">
                  <span className="text-[11px] text-gray-300 dark:text-gray-600 font-medium">Return to send</span>
                  <button 
                    type="submit"
                    disabled={!input.trim() || isTyping}
                    className="p-2 bg-[#1d4ed8] hover:bg-blue-700 disabled:bg-gray-200 dark:disabled:bg-gray-800 disabled:text-gray-400 dark:disabled:text-gray-600 text-white rounded-lg transition-colors"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </form>
            <div className="text-center mt-3">
              <span className="text-[10px] text-gray-400 dark:text-gray-600">
                Adept can make mistakes. Consider verifying important academic information.
              </span>
            </div>
          </div>
        </div>

      </main>
    </div>
  );
}

export default Chat;

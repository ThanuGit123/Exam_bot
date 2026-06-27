import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Loader2, Moon, Sun, Settings as SettingsIcon } from 'lucide-react';

function Settings() {
  const navigate = useNavigate();
  const [userEmail, setUserEmail] = useState(localStorage.getItem('userEmail') || '');
  const [profile, setProfile] = useState(null);
  
  const [learningPrefs, setLearningPrefs] = useState({
    target_exam: 'JEE',
    default_subject: 'Physics',
    default_difficulty: 'exam-level',
    pace: 'balanced',
    style: 'example-first',
    level: 'building',
    exam_date: '2027-05-01',
    default_model: 'groq'
  });
  
  const [appPrefs, setAppPrefs] = useState({
    dark_mode: false,
    large_text: false,
    daily_reminders: true,
    email_notifications: true
  });

  const [isLoading, setIsLoading] = useState(true);
  const [saveStatus, setSaveStatus] = useState(''); // 'saving', 'saved', 'error', ''
  
  const initialLoadDone = useRef(false);

  useEffect(() => {
    let emailToUse = userEmail;
    if (!emailToUse) {
      emailToUse = 'demo@example.com';
      setUserEmail(emailToUse);
      localStorage.setItem('userEmail', emailToUse);
    }

    const fetchPreferences = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/api/me', {
          headers: {
            'X-User-Email': emailToUse
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          setProfile(data);
          if (data.learning_prefs) setLearningPrefs(data.learning_prefs);
          if (data.app_prefs) {
            setAppPrefs(data.app_prefs);
            // Apply dark mode immediately
            if (data.app_prefs.dark_mode) {
              document.documentElement.classList.add('dark');
            } else {
              document.documentElement.classList.remove('dark');
            }
            // Apply large text immediately
            if (data.app_prefs.large_text) {
              document.documentElement.classList.add('large-text');
            } else {
              document.documentElement.classList.remove('large-text');
            }
          }
        }
      } catch (err) {
        console.error("Error fetching preferences:", err);
      } finally {
        setIsLoading(false);
        // Small delay to prevent initial mount from triggering an autosave
        setTimeout(() => { initialLoadDone.current = true; }, 500);
      }
    };

    fetchPreferences();
  }, [userEmail, navigate]);

  // Autosave hook
  useEffect(() => {
    if (!initialLoadDone.current) return;

    const savePreferences = async () => {
      setSaveStatus('saving');
      try {
        const response = await fetch('http://127.0.0.1:8000/api/me/preferences', {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'X-User-Email': userEmail
          },
          body: JSON.stringify({
            learning_prefs: learningPrefs,
            app_prefs: appPrefs
          })
        });

        if (response.ok) {
          setSaveStatus('saved');
          setTimeout(() => setSaveStatus(''), 2000);
        } else {
          setSaveStatus('error');
        }
      } catch (err) {
        console.error("Error saving preferences:", err);
        setSaveStatus('error');
      }
    };

    const debounceTimer = setTimeout(() => {
      savePreferences();
    }, 1000); // Wait 1 second after last change before saving

    return () => clearTimeout(debounceTimer);
  }, [learningPrefs, appPrefs, userEmail]);

  const handleLearningChange = (e) => {
    const { name, value } = e.target;
    setLearningPrefs(prev => ({ ...prev, [name]: value }));
  };

  const handleAppChange = (e) => {
    const { name, checked } = e.target;
    setAppPrefs(prev => {
      const next = { ...prev, [name]: checked };
      if (name === 'dark_mode') {
        if (checked) document.documentElement.classList.add('dark');
        else document.documentElement.classList.remove('dark');
      }
      if (name === 'large_text') {
        if (checked) document.documentElement.classList.add('large-text');
        else document.documentElement.classList.remove('large-text');
      }
      return next;
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#f9faf8] dark:bg-[#1a1a1e] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#4B7B5A]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f9faf8] dark:bg-[#1a1a1e] text-gray-800 dark:text-gray-200 transition-colors">
      <div className="max-w-3xl mx-auto py-10 px-6">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-4">
            <Link to="/chat" className="p-2 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-lg transition-colors">
              <ArrowLeft className="w-6 h-6" />
            </Link>
            <h1 className="text-3xl font-serif font-bold text-[#4B7B5A] dark:text-[#6a9e7a] flex items-center gap-3">
              <SettingsIcon className="w-8 h-8" />
              Settings
            </h1>
          </div>
          
          <div className="flex items-center gap-2">
            {saveStatus === 'saving' && <span className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-2"><Loader2 className="w-4 h-4 animate-spin"/> Saving...</span>}
            {saveStatus === 'saved' && <span className="text-sm text-[#4B7B5A] dark:text-[#6a9e7a] flex items-center gap-2"><Save className="w-4 h-4"/> Saved</span>}
            {saveStatus === 'error' && <span className="text-sm text-red-500">Failed to save</span>}
          </div>
        </div>

        {/* Profile Section */}
        <div className="bg-white dark:bg-[#252529] rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6 mb-8">
          <h2 className="text-xl font-bold mb-4 font-serif">Profile</h2>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Email</label>
              <div className="text-lg">{userEmail}</div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Display Name</label>
              <div className="text-lg">{profile?.full_name || 'Student'}</div>
            </div>
          </div>
        </div>

        {/* Learning Preferences */}
        <div className="bg-white dark:bg-[#252529] rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6 mb-8">
          <h2 className="text-xl font-bold mb-6 font-serif flex items-center gap-2">
            🎓 How Adept teaches you
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Target Exam</label>
              <select name="target_exam" value={learningPrefs.target_exam} onChange={handleLearningChange} className="w-full bg-gray-50 dark:bg-[#1a1a1e] border border-gray-200 dark:border-gray-700 rounded-lg p-3 focus:outline-none focus:border-[#4B7B5A]">
                <option value="JEE">JEE</option>
                <option value="NEET">NEET</option>
                <option value="UPSC">UPSC</option>
                <option value="GATE">GATE</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Default Subject</label>
              <input type="text" name="default_subject" value={learningPrefs.default_subject} onChange={handleLearningChange} placeholder="e.g. Physics" className="w-full bg-gray-50 dark:bg-[#1a1a1e] border border-gray-200 dark:border-gray-700 rounded-lg p-3 focus:outline-none focus:border-[#4B7B5A]" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Default Difficulty</label>
              <select name="default_difficulty" value={learningPrefs.default_difficulty} onChange={handleLearningChange} className="w-full bg-gray-50 dark:bg-[#1a1a1e] border border-gray-200 dark:border-gray-700 rounded-lg p-3 focus:outline-none focus:border-[#4B7B5A]">
                <option value="basic">Basic</option>
                <option value="moderate">Moderate</option>
                <option value="exam-level">Exam-level</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Pace</label>
              <select name="pace" value={learningPrefs.pace} onChange={handleLearningChange} className="w-full bg-gray-50 dark:bg-[#1a1a1e] border border-gray-200 dark:border-gray-700 rounded-lg p-3 focus:outline-none focus:border-[#4B7B5A]">
                <option value="gentle">Gentle (Fewer ideas, highly supportive)</option>
                <option value="balanced">Balanced</option>
                <option value="fast">Fast (Cover more, fewer hand-holds)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Explanation Style</label>
              <select name="style" value={learningPrefs.style} onChange={handleLearningChange} className="w-full bg-gray-50 dark:bg-[#1a1a1e] border border-gray-200 dark:border-gray-700 rounded-lg p-3 focus:outline-none focus:border-[#4B7B5A]">
                <option value="example-first">Example First (Show, then explain)</option>
                <option value="concept-first">Concept First (Explain, then illustrate)</option>
                <option value="practice-first">Practice First (Let me try it first)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Explanation Level</label>
              <select name="level" value={learningPrefs.level} onChange={handleLearningChange} className="w-full bg-gray-50 dark:bg-[#1a1a1e] border border-gray-200 dark:border-gray-700 rounded-lg p-3 focus:outline-none focus:border-[#4B7B5A]">
                <option value="foundation">Foundation (Plain language, defined terms)</option>
                <option value="building">Building (Standard academic)</option>
                <option value="advanced">Advanced (Deep dive, skip basics)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Target Exam Date</label>
              <input type="date" name="exam_date" value={learningPrefs.exam_date} onChange={handleLearningChange} className="w-full bg-gray-50 dark:bg-[#1a1a1e] border border-gray-200 dark:border-gray-700 rounded-lg p-3 focus:outline-none focus:border-[#4B7B5A]" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Default Model</label>
              <select name="default_model" value={learningPrefs.default_model} onChange={handleLearningChange} className="w-full bg-gray-50 dark:bg-[#1a1a1e] border border-gray-200 dark:border-gray-700 rounded-lg p-3 focus:outline-none focus:border-[#4B7B5A]">
                <option value="groq">Groq (Llama 3.1 8B) - Fast</option>
                <option value="cerebras">Cerebras (Llama 3.1 8B) - Ultra Fast</option>
                <option value="mistral">Mistral (Mistral Small) - Balanced</option>
              </select>
            </div>
          </div>
        </div>

        {/* App Preferences */}
        <div className="bg-white dark:bg-[#252529] rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6 mb-8">
          <h2 className="text-xl font-bold mb-6 font-serif flex items-center gap-2">
            ⚙️ App Preferences
          </h2>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-[#1a1a1e] rounded-lg border border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3">
                {appPrefs.dark_mode ? <Moon className="w-5 h-5 text-indigo-400"/> : <Sun className="w-5 h-5 text-amber-500"/>}
                <div>
                  <div className="font-medium">Dark Mode</div>
                  <div className="text-sm text-gray-500">Toggle dark appearance</div>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" name="dark_mode" checked={appPrefs.dark_mode} onChange={handleAppChange} className="sr-only peer"/>
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-[#4B7B5A]"></div>
              </label>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-[#1a1a1e] rounded-lg border border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3">
                <div className="font-bold text-lg text-gray-400">Aa</div>
                <div>
                  <div className="font-medium">Large Text</div>
                  <div className="text-sm text-gray-500">Increase base font size</div>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" name="large_text" checked={appPrefs.large_text} onChange={handleAppChange} className="sr-only peer"/>
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-[#4B7B5A]"></div>
              </label>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-[#1a1a1e] rounded-lg border border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3">
                <div>
                  <div className="font-medium">Daily Reminders</div>
                  <div className="text-sm text-gray-500">Push notifications to study</div>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" name="daily_reminders" checked={appPrefs.daily_reminders} onChange={handleAppChange} className="sr-only peer"/>
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-[#4B7B5A]"></div>
              </label>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-[#1a1a1e] rounded-lg border border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3">
                <div>
                  <div className="font-medium">Email Progress Recap</div>
                  <div className="text-sm text-gray-500">Weekly email summaries</div>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" name="email_notifications" checked={appPrefs.email_notifications} onChange={handleAppChange} className="sr-only peer"/>
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-[#4B7B5A]"></div>
              </label>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default Settings;

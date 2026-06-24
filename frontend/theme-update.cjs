const fs = require('fs');

let code = fs.readFileSync('src/App.jsx', 'utf8');

// Add imports
code = code.replace(
  "import { Bot, ChevronRight, Activity, BookOpen, BarChart3 } from 'lucide-react';", 
  "import { Bot, ChevronRight, Activity, BookOpen, BarChart3, Sun, Moon } from 'lucide-react';\nimport { useTheme } from './components/ThemeProvider';"
);

// Add hook
code = code.replace(
  "function App() {\n  return (", 
  "function App() {\n  const { theme, toggleTheme } = useTheme();\n\n  return ("
);

// Root div
code = code.replace(
  'className="min-h-screen bg-[#07080f] text-white', 
  'className="min-h-screen bg-gray-50 dark:bg-[#07080f] text-gray-900 dark:text-white transition-colors duration-300'
);

// Nav buttons
code = code.replace(
  '<button className="text-sm font-medium text-gray-300 hover:text-white transition-colors">Sign In</button>',
  `<button onClick={toggleTheme} className="p-2 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-white/10 rounded-full transition-colors">
            {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
          </button>
          <button className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">Sign In</button>`
);

// Global UI replacements to support light mode
code = code.replace(/text-gray-400/g, 'text-gray-600 dark:text-gray-400');
code = code.replace(/bg-\[#0f111a\]/g, 'bg-white dark:bg-[#0f111a]');
code = code.replace(/bg-white\/5/g, 'bg-gray-100 dark:bg-white/5');
code = code.replace(/bg-white\/\[0\.02\]/g, 'bg-gray-100 dark:bg-white/[0.02]');
code = code.replace(/border-white\/5/g, 'border-gray-200 dark:border-white/5');
code = code.replace(/border-white\/10/g, 'border-gray-300 dark:border-white/10');

// Specific text-white fixes that aren't buttons
code = code.replace(
  '<p className="font-medium text-white">Efficiency: 94.2%</p>',
  '<p className="font-medium text-gray-900 dark:text-white">Efficiency: 94.2%</p>'
);
code = code.replace(
  '<h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">',
  '<h4 className="text-xs font-bold uppercase tracking-wider text-gray-900 dark:text-white mb-4">'
);
code = code.replace(
  '<h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">',
  '<h4 className="text-xs font-bold uppercase tracking-wider text-gray-900 dark:text-white mb-4">'
);

fs.writeFileSync('src/App.jsx', code);
console.log('App.jsx updated with light/dark mode support.');

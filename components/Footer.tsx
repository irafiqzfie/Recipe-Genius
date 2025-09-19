import React from 'react';

// FIX: Removed React.FC to fix JSX typing errors by using a plain function component.
const Footer = () => {
  return (
    <footer className="w-full text-center py-6 mt-12">
      <p className="text-slate-500 dark:text-slate-400">
        Powered by <a href="https://deepmind.google/technologies/gemini/" target="_blank" rel="noopener noreferrer" className="font-semibold text-sky-500 hover:text-sky-600">Google Gemini</a>
      </p>
    </footer>
  );
};

export default Footer;
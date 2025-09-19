import React from 'react';

// FIX: Removed React.FC to fix JSX typing errors by using a plain function component.
const Header = () => {
  return (
    <header className="w-full text-center py-8">
      <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-emerald-600">
        Recipe Genius
      </h1>
      <p className="mt-2 text-lg text-slate-600 dark:text-slate-300">
        Turn your pantry into a feast.
      </p>
    </header>
  );
};

export default Header;
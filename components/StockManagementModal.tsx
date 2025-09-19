import React, { useState } from 'react';

interface StockManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
  stock: string[];
  onAddIngredient: (ingredient: string) => void;
  onRemoveIngredient: (ingredient: string) => void;
}

const StockManagementModal = ({ isOpen, onClose, stock, onAddIngredient, onRemoveIngredient }: StockManagementModalProps) => {
  const [newIngredient, setNewIngredient] = useState('');

  if (!isOpen) {
    return null;
  }

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedIngredient = newIngredient.trim().toLowerCase();
    if (trimmedIngredient) {
      onAddIngredient(trimmedIngredient);
      setNewIngredient('');
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 p-4" 
      aria-modal="true" 
      role="dialog"
    >
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-md p-6 relative animate-fade-in-up">
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white transition-colors"
          aria-label="Close settings"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        
        <h2 className="text-2xl font-bold text-slate-700 dark:text-slate-200 mb-4">Manage My Kitchen Stock</h2>
        
        <form onSubmit={handleFormSubmit} className="flex items-center gap-3 mb-4">
          <input
            type="text"
            value={newIngredient}
            onChange={(e) => setNewIngredient(e.target.value)}
            placeholder="Add an ingredient..."
            className="flex-grow p-3 rounded-lg border-2 border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-shadow duration-200"
            aria-label="New ingredient name"
          />
          <button 
            type="submit" 
            className="px-5 py-3 bg-sky-500 text-white font-bold rounded-lg shadow-md hover:bg-sky-600 transition-colors duration-300 disabled:opacity-50" 
            disabled={!newIngredient.trim()}
          >
            Add
          </button>
        </form>

        <div className="flex flex-wrap gap-2 max-h-60 overflow-y-auto pr-2">
          {stock.length > 0 ? stock.map(item => (
            <span key={item} className="flex items-center gap-2 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-full px-3 py-1 text-sm font-medium animate-fade-in">
              {item}
              <button 
                onClick={() => onRemoveIngredient(item)} 
                className="text-slate-500 dark:text-slate-400 hover:text-red-500 dark:hover:text-red-400 font-bold text-lg"
                aria-label={`Remove ${item}`}
              >
                &times;
              </button>
            </span>
          )) : (
            <p className="text-slate-500 dark:text-slate-400 w-full text-center">Your stock is empty. Add some ingredients!</p>
          )}
        </div>
        <div className="mt-6 text-right">
             <button 
                onClick={onClose} 
                className="px-6 py-2 bg-emerald-500 text-white font-bold rounded-lg shadow-md hover:bg-emerald-600 transition-colors duration-300"
              >
                Done
              </button>
        </div>
      </div>
    </div>
  );
};

export default StockManagementModal;

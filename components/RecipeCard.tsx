import React from 'react';
import type { Recipe } from '../types';

interface RecipeCardProps {
  recipe: Recipe;
  onSave: (recipe: Recipe) => void;
  onUnsave: (recipeName: string) => void;
  isSaved: boolean;
}

const RecipeCard = ({ recipe, onSave, onUnsave, isSaved }: RecipeCardProps) => {
  const { recipeName, description, ingredients, instructions, imageUrl } = recipe;

  const handleSaveToggle = () => {
    if (isSaved) {
      onUnsave(recipeName);
    } else {
      onSave(recipe);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg overflow-hidden transition-transform duration-300 hover:scale-105 hover:shadow-2xl relative">
      <div className="w-full h-56 bg-slate-200 dark:bg-slate-700 flex items-center justify-center">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={recipeName}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="flex flex-col items-center text-slate-500 dark:text-slate-400">
             <svg className="animate-spin h-8 w-8 text-sky-500 mb-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            <span>Generating image...</span>
          </div>
        )}
      </div>
      <div className="p-6">
        <div className="flex justify-between items-start mb-2">
            <h3 className="text-2xl font-bold text-slate-800 dark:text-white">{recipeName}</h3>
            <button 
              onClick={handleSaveToggle}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-semibold transition-colors duration-300 ${
                isSaved 
                ? 'bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-200 dark:hover:bg-emerald-900' 
                : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
              }`}
              aria-label={isSaved ? `Unsave ${recipeName}` : `Save ${recipeName}`}
            >
                 {isSaved ? (
                     <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                 ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                    </svg>
                 )}
              <span>{isSaved ? 'Saved' : 'Save'}</span>
            </button>
        </div>

        <p className="text-slate-600 dark:text-slate-300 mb-6">{description}</p>

        <div className="space-y-6">
          <div>
            <h4 className="text-lg font-semibold text-sky-600 dark:text-sky-400 mb-3 border-b-2 border-sky-200 dark:border-sky-800 pb-2">Ingredients</h4>
            <ul className="list-disc list-inside space-y-1 text-slate-700 dark:text-slate-300">
              {ingredients.map((ingredient, i) => (
                <li key={i}>{ingredient}</li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold text-emerald-600 dark:text-emerald-400 mb-3 border-b-2 border-emerald-200 dark:border-emerald-800 pb-2">Instructions</h4>
            <ol className="list-decimal list-inside space-y-2 text-slate-700 dark:text-slate-300">
              {instructions.map((instruction, i) => (
                <li key={i}>{instruction}</li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecipeCard;
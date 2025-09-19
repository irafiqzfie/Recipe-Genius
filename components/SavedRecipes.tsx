import React from 'react';
import type { Recipe } from '../types';

interface SavedRecipesProps {
  recipes: Recipe[];
  onUnsave: (recipeName: string) => void;
  onClear: () => void;
}

const SavedRecipes = ({ recipes, onUnsave, onClear }: SavedRecipesProps) => {
  if (recipes.length === 0) {
    return null;
  }

  return (
    <section className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6 mb-12 animate-fade-in">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-slate-700 dark:text-slate-200">My Saved Recipes</h2>
        <button 
          onClick={onClear}
          className="px-4 py-2 bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300 font-semibold rounded-lg shadow hover:bg-red-200 dark:hover:bg-red-900/60 transition-colors duration-300"
        >
          Clear All
        </button>
      </div>
      <div className="space-y-3 max-h-64 overflow-y-auto pr-2">
        {recipes.map((recipe) => (
          <div key={recipe.recipeName} className="flex justify-between items-center bg-slate-50 dark:bg-slate-700/50 p-3 rounded-lg">
            <span className="font-medium text-slate-800 dark:text-slate-200">{recipe.recipeName}</span>
            <button 
              onClick={() => onUnsave(recipe.recipeName)}
              className="text-slate-500 dark:text-slate-400 hover:text-red-500 dark:hover:text-red-400 font-bold text-lg"
              aria-label={`Unsave ${recipe.recipeName}`}
            >
              &times;
            </button>
          </div>
        ))}
      </div>
    </section>
  );
};

export default SavedRecipes;
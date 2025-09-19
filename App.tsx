import React, { useState, useCallback, useEffect } from 'react';
import { generateRecipes, generateImageForRecipe } from './services/geminiService';
import * as storageService from './services/storageService';
import type { Recipe } from './types';
import Header from './components/Header';
import Footer from './components/Footer';
import LoadingSpinner from './components/LoadingSpinner';
import RecipeCard from './components/RecipeCard';
import StockManagementModal from './components/StockManagementModal';
import SavedRecipes from './components/SavedRecipes';

const initialStock = [
  'chicken breast', 'tomatoes', 'garlic', 'olive oil', 'pasta', 'parmesan cheese', 'onion', 'bell pepper', 'rice', 'eggs'
];

const App = () => {
  const [kitchenStock, setKitchenStock] = useState<string[]>(initialStock);
  const [selectedIngredients, setSelectedIngredients] = useState<string[]>([]);
  const [isStockModalOpen, setIsStockModalOpen] = useState(false);
  
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [savedRecipes, setSavedRecipes] = useState<Recipe[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [filterQuery, setFilterQuery] = useState('');

  useEffect(() => {
    setSavedRecipes(storageService.getSavedRecipes());
  }, []);

  const handleAddIngredient = (ingredient: string) => {
    const trimmedIngredient = ingredient.trim().toLowerCase();
    if (trimmedIngredient && !kitchenStock.includes(trimmedIngredient)) {
      setKitchenStock([...kitchenStock, trimmedIngredient].sort());
    }
  };
  
  const handleRemoveIngredient = (ingredientToRemove: string) => {
    setKitchenStock(kitchenStock.filter(item => item !== ingredientToRemove));
    setSelectedIngredients(selectedIngredients.filter(item => item !== ingredientToRemove));
  };

  const handleSelectionChange = (ingredient: string) => {
    setSelectedIngredients(prev => 
      prev.includes(ingredient)
        ? prev.filter(item => item !== ingredient)
        : [...prev, ingredient]
    );
  };

  const handleSaveRecipe = (recipe: Recipe) => {
    storageService.saveRecipe(recipe);
    setSavedRecipes(storageService.getSavedRecipes());
  };

  const handleUnsaveRecipe = (recipeName: string) => {
    storageService.unsaveRecipe(recipeName);
    setSavedRecipes(storageService.getSavedRecipes());
  };

  const handleClearSavedRecipes = () => {
    storageService.clearSavedRecipes();
    setSavedRecipes([]);
  };

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedIngredients.length === 0 || isLoading) return;

    setIsLoading(true);
    setError(null);
    setRecipes([]);
    setFilterQuery(''); 

    try {
      const recipesWithoutImages = await generateRecipes(selectedIngredients.join(', '));
      setRecipes(recipesWithoutImages);

      recipesWithoutImages.forEach(async (recipe, index) => {
        try {
          const imageUrl = await generateImageForRecipe(recipe.recipeName, recipe.description);
          setRecipes(prevRecipes => {
            const newRecipes = [...prevRecipes];
            if (newRecipes[index] && newRecipes[index].recipeName === recipe.recipeName) {
              newRecipes[index] = { ...newRecipes[index], imageUrl };
            }
            return newRecipes;
          });
        } catch (imgError) {
          console.error(`Failed to generate image for ${recipe.recipeName}:`, imgError);
        }
      });

    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.');
      setRecipes([]);
    } finally {
      setIsLoading(false);
    }
  }, [selectedIngredients, isLoading]);
  
  const filteredRecipes = recipes.filter(recipe =>
    recipe.recipeName.toLowerCase().includes(filterQuery.toLowerCase()) ||
    recipe.description.toLowerCase().includes(filterQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen flex flex-col items-center p-4 sm:p-6 lg:p-8 font-sans text-slate-800 dark:text-slate-200">
      <Header />
      <main className="w-full max-w-4xl mx-auto flex-grow">
        
        <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6 mb-12">
           <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-slate-700 dark:text-slate-200">Select Ingredients</h2>
              <button 
                type="button" 
                onClick={() => setIsStockModalOpen(true)}
                className="px-4 py-2 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold rounded-lg shadow hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors duration-300"
              >
                Manage Stock
              </button>
           </div>
           {kitchenStock.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-6">
                {kitchenStock.map(item => (
                  <label key={item} className="flex items-center p-3 rounded-lg hover:bg-sky-50 dark:hover:bg-slate-700/50 cursor-pointer transition-colors">
                    <input
                      type="checkbox"
                      checked={selectedIngredients.includes(item)}
                      onChange={() => handleSelectionChange(item)}
                      className="h-5 w-5 rounded border-gray-300 text-sky-600 focus:ring-sky-500"
                      aria-labelledby={`ingredient-label-${item}`}
                    />
                    <span id={`ingredient-label-${item}`} className="ml-3 text-slate-700 dark:text-slate-300 capitalize">{item}</span>
                  </label>
                ))}
            </div>
           ) : (
            <div className="text-center py-8 text-slate-500 dark:text-slate-400">
              <p>Your kitchen stock is empty.</p>
              <p>Click "Manage Stock" to add some ingredients!</p>
            </div>
           )}
           <div className="text-center">
            <button
              type="submit"
              disabled={isLoading || selectedIngredients.length === 0}
              className="px-8 py-4 bg-gradient-to-r from-sky-500 to-emerald-500 text-white font-bold rounded-lg shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100"
            >
              {isLoading ? 'Generating...' : 'Find Recipes'}
            </button>
           </div>
        </form>

        <SavedRecipes 
            recipes={savedRecipes} 
            onUnsave={handleUnsaveRecipe}
            onClear={handleClearSavedRecipes}
        />

        <div className="mt-8">
          {isLoading && <LoadingSpinner />}
          {error && <div className="text-center p-4 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-lg">{error}</div>}
          
          {!isLoading && !error && recipes.length === 0 && (
             <div className="text-center text-slate-500 dark:text-slate-400">
                <p className="text-xl">Welcome to Recipe Genius!</p>
                <p>Select ingredients from your stock and let AI create magic for you.</p>
            </div>
          )}
          
          {!isLoading && !error && recipes.length > 0 && (
             <div className="space-y-8">
                <div>
                  <label htmlFor="recipe-filter" className="sr-only">Filter recipes</label>
                  <input
                    id="recipe-filter"
                    type="search"
                    value={filterQuery}
                    onChange={(e) => setFilterQuery(e.target.value)}
                    placeholder="Filter recipes by name or keyword..."
                    className="w-full p-3 rounded-lg border-2 border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-shadow duration-200"
                    aria-label="Filter recipes"
                  />
                </div>

                {filteredRecipes.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-1 gap-8">
                    {filteredRecipes.map((recipe, index) => (
                      <RecipeCard 
                        key={`${recipe.recipeName}-${index}`} 
                        recipe={recipe} 
                        onSave={handleSaveRecipe}
                        onUnsave={handleUnsaveRecipe}
                        isSaved={savedRecipes.some(r => r.recipeName === recipe.recipeName)}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-slate-500 dark:text-slate-400">
                    <p>No recipes match your filter.</p>
                  </div>
                )}
            </div>
          )}

        </div>
      </main>
      <Footer />
      <StockManagementModal 
        isOpen={isStockModalOpen}
        onClose={() => setIsStockModalOpen(false)}
        stock={kitchenStock}
        onAddIngredient={handleAddIngredient}
        onRemoveIngredient={handleRemoveIngredient}
      />
    </div>
  );
};

export default App;
import type { Recipe } from '../types';

const STORAGE_KEY = 'gemini-saved-recipes';

export const getSavedRecipes = (): Recipe[] => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch (error) {
    console.error("Failed to parse saved recipes from localStorage", error);
    return [];
  }
};

export const saveRecipe = (recipeToSave: Recipe): void => {
  const recipes = getSavedRecipes();
  const isAlreadySaved = recipes.some(
    (recipe) => recipe.recipeName === recipeToSave.recipeName
  );

  if (!isAlreadySaved) {
    const updatedRecipes = [...recipes, recipeToSave];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedRecipes));
  }
};

export const unsaveRecipe = (recipeNameToRemove: string): void => {
  const recipes = getSavedRecipes();
  const updatedRecipes = recipes.filter(
    (recipe) => recipe.recipeName !== recipeNameToRemove
  );
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedRecipes));
};

export const clearSavedRecipes = (): void => {
  localStorage.removeItem(STORAGE_KEY);
};
import type { Recipe } from "../types";

const API_PROXY_URL = '/api/gemini-proxy';

async function callApiProxy<T>(type: string, payload: object): Promise<T> {
  const response = await fetch(API_PROXY_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ type, payload }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: 'An unknown API error occurred.' }));
    throw new Error(`API Error: ${errorData.error || response.statusText}`);
  }

  return response.json();
}

export const generateRecipes = async (ingredients: string): Promise<Recipe[]> => {
  try {
    const recipes = await callApiProxy<Recipe[]>('recipes', { ingredients });
    return recipes;
  } catch (error) {
    console.error("Error generating recipes:", error);
    throw new Error("Failed to generate recipes. The model may be unable to process the request.");
  }
};

export const generateImageForRecipe = async (recipeName: string, description: string): Promise<string> => {
  try {
    const { imageUrl } = await callApiProxy<{ imageUrl: string }>('image', { recipeName, description });
    if (!imageUrl) {
        throw new Error("No image URL was returned by the API proxy.");
    }
    return imageUrl;
  } catch (error) {
    console.error(`Error generating image for recipe "${recipeName}":`, error);
    throw new Error(`Failed to generate an image for ${recipeName}.`);
  }
};

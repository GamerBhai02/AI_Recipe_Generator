import { GoogleGenAI, Type } from "@google/genai";
import type { Recipe, RecipeGenerationOptions } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

const recipeSchema = {
  type: Type.ARRAY,
  items: {
    type: Type.OBJECT,
    properties: {
      recipeName: {
        type: Type.STRING,
        description: "The name of the recipe.",
      },
      description: {
        type: Type.STRING,
        description: "A short, enticing description of the dish.",
      },
       rating: {
        type: Type.NUMBER,
        description: "A rating for the recipe from 1 to 5, where 5 is best, based on general appeal and ease of preparation.",
      },
      ingredients: {
        type: Type.ARRAY,
        description: "The list of ingredients for the recipe. Include both provided and any additional ingredients needed.",
        items: {
          type: Type.OBJECT,
          properties: {
            item: {
              type: Type.STRING,
              description: "The name of the ingredient.",
            },
            quantity: {
              type: Type.STRING,
              description: "The amount of the ingredient, e.g., '1 cup', '2 tbsp'.",
            },
          },
          required: ["item", "quantity"],
        },
      },
      instructions: {
        type: Type.ARRAY,
        description: "Step-by-step instructions to prepare the dish.",
        items: {
          type: Type.STRING,
        },
      },
      notes: {
        type: Type.STRING,
        description: "Optional notes or tips for the recipe, like variations or serving suggestions.",
      },
    },
    required: ["recipeName", "description", "rating", "ingredients", "instructions"],
  },
};

const callGemini = async (prompt: string): Promise<Recipe[]> => {
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: recipeSchema,
            },
        });

        const jsonText = response.text.trim();
        return JSON.parse(jsonText) as Recipe[];
    } catch (error) {
        console.error("Error calling Gemini API:", error);
        throw new Error("Failed to generate recipes. The AI model might be busy or there was an issue with the request. Please try again.");
    }
}

const buildPromptConstraints = (options: RecipeGenerationOptions): string => {
    const constraints = [];
    if (options.dietaryPreferences) constraints.push(`It must be ${options.dietaryPreferences}.`);
    if (options.cuisine) constraints.push(`The cuisine should be ${options.cuisine}.`);
    if (options.difficulty) constraints.push(`The difficulty level should be ${options.difficulty}.`);
    if (options.cookingTime) constraints.push(`The total cooking time should be ${options.cookingTime}.`);
    if (options.language && options.language.toLowerCase() !== 'english') {
      constraints.push(`The entire recipe, including names, descriptions, and all text, must be written in ${options.language}.`);
    }
    
    if (constraints.length > 0) {
        return `\nPlease adhere to the following constraints: ${constraints.join(' ')}`;
    }
    return '';
}

export const generateRecipes = async (ingredients: string[], options: RecipeGenerationOptions): Promise<Recipe[]> => {
  // FIX: Removed API_KEY check per guidelines, assuming it is always present.
  if (ingredients.length === 0) {
    throw new Error("Please provide at least one ingredient.");
  }

  let prompt = `You are an expert chef. Create 3 diverse and delicious recipes based on the following ingredients: ${ingredients.join(", ")}.`;
  prompt += buildPromptConstraints(options);
  prompt += `\nYou can suggest a few common pantry items (like oil, salt, pepper, flour) if needed, but the main focus should be the provided ingredients. For each recipe, provide a short, enticing description and a rating from 1 to 5.`;

  return callGemini(prompt);
};

export const generateRandomRecipe = async (options: RecipeGenerationOptions): Promise<Recipe[]> => {
  // FIX: Removed API_KEY check per guidelines, assuming it is always present.
  let prompt = `You are an expert chef. Create 1 unique and delicious recipe.`;
  prompt += buildPromptConstraints(options);
  prompt += `\nProvide a short, enticing description and a rating from 1 to 5 for the recipe.`;

  return callGemini(prompt);
};

export interface Ingredient {
  item: string;
  quantity: string;
}

export interface Recipe {
  recipeName: string;
  description: string;
  ingredients: Ingredient[];
  instructions: string[];
  rating: number;
  notes?: string;
}

export interface RecipeGenerationOptions {
  dietaryPreferences?: string;
  cuisine?: string;
  difficulty?: string;
  cookingTime?: string;
  language?: string;
}
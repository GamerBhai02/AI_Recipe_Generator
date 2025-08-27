import React, { useState, useCallback, useEffect } from 'react';
import IngredientInput from './components/IngredientInput';
import RecipeCard from './components/RecipeCard';
import LoadingSpinner from './components/LoadingSpinner';
import ErrorMessage from './components/ErrorMessage';
import { ChefHatIcon, SunIcon, MoonIcon } from './components/icons';
import { generateRecipes, generateRandomRecipe } from './services/geminiService';
import type { Recipe, RecipeGenerationOptions, Ingredient } from './types';

const App: React.FC = () => {
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window !== 'undefined' && window.localStorage) {
      const storedTheme = window.localStorage.getItem('theme');
      if (storedTheme === 'dark' || storedTheme === 'light') return storedTheme;
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) return 'dark';
    }
    return 'light';
  });

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  const [ingredients, setIngredients] = useState<Ingredient[]>([
    { item: 'chicken breast', quantity: '2' },
    { item: 'rice', quantity: '1 cup' },
    { item: 'broccoli', quantity: '1 head' }
  ]);
  const [recipes, setRecipes] = useState<Recipe[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [options, setOptions] = useState<RecipeGenerationOptions>({
    dietaryPreferences: '',
    cuisine: '',
    difficulty: '',
    cookingTime: '',
    language: 'English',
  });
  const [showOptions, setShowOptions] = useState(false);

  const handleOptionsChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setOptions({ ...options, [e.target.name]: e.target.value });
  };
  
  const handleGenerate = useCallback(async (generator: () => Promise<Recipe[]>) => {
    setIsLoading(true);
    setError(null);
    setRecipes(null);
    try {
      const result = await generator();
      setRecipes(result);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "An unknown error occurred.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleGenerateRecipes = () => {
    if (ingredients.length === 0) {
      setError("Please add at least one ingredient before generating recipes.");
      return;
    }
    const formattedIngredients = ingredients.map(ing => `${ing.quantity} ${ing.item}`.trim());
    handleGenerate(() => generateRecipes(formattedIngredients, options));
  };
  
  const handleSurpriseMe = () => {
    setIngredients([]);
    handleGenerate(() => generateRandomRecipe(options));
  };

  const optionFields = [
    {name: 'dietaryPreferences', label: 'Dietary', options: ['Any', 'Vegetarian', 'Vegan', 'Gluten-Free', 'Keto']},
    {name: 'cuisine', label: 'Cuisine', options: ['Any', 'Italian', 'Mexican', 'Indian', 'Chinese', 'American']},
    {name: 'difficulty', label: 'Difficulty', options: ['Any', 'Easy', 'Medium', 'Hard']},
    {name: 'cookingTime', label: 'Cooking Time', options: ['Any', 'Under 30 mins', '30-60 mins', 'Over 60 mins']},
    {name: 'language', label: 'Language', options: ['English', 'Hinglish', 'Hindi', 'Spanish', 'French', 'German', 'Mandarin', 'Japanese', 'Bengali', 'Tamil', 'Telugu', 'Marathi', 'Gujarati', 'Kannada', 'Malayalam']},
  ];

  const renderContent = () => {
    if (isLoading) {
      return <LoadingSpinner message="Crafting delicious recipes for you..." />;
    }
    if (error) {
      return <ErrorMessage message={error} />;
    }
    if (recipes) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recipes.map((recipe, index) => (
            <RecipeCard key={index} recipe={recipe} />
          ))}
        </div>
      );
    }
    return (
        <div className="text-center py-10 px-4">
            <ChefHatIcon className="w-16 h-16 mx-auto text-slate-400 dark:text-slate-500" />
            <h2 className="mt-4 text-2xl font-semibold text-slate-600 dark:text-slate-300">Welcome to the AI Recipe Generator!</h2>
            <p className="mt-2 text-slate-500 dark:text-slate-400">Add ingredients or hit "Surprise Me" to discover your next meal.</p>
        </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-900 flex flex-col items-center p-4 sm:p-6 lg:p-8 text-slate-800 dark:text-slate-200">
      <div className="w-full max-w-6xl mx-auto">
        <header className="text-center mb-8 relative">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-800 dark:text-slate-100 tracking-tight flex items-center justify-center gap-3">
            <ChefHatIcon className="w-10 h-10 text-emerald-600 dark:text-emerald-400" />
            <span>AI Recipe Generator</span>
          </h1>
          <p className="mt-3 text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Turn your pantry into a culinary adventure. Just tell us what you have, and we'll whip up some ideas.
          </p>
          <div className="absolute top-0 right-0">
            <button onClick={toggleTheme} className="p-2 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors" aria-label="Toggle theme">
              {theme === 'light' ? <MoonIcon className="w-6 h-6" /> : <SunIcon className="w-6 h-6 text-yellow-400" />}
            </button>
          </div>
        </header>
        
        <main>
            <div className="bg-white dark:bg-slate-800 p-6 sm:p-8 rounded-xl shadow-md">
                <label className="block text-xl font-bold text-slate-700 dark:text-slate-200 mb-2">Your Ingredients</label>
                <p className="text-slate-500 dark:text-slate-400 mb-4">Add the ingredients you have on hand to get started.</p>
                <IngredientInput ingredients={ingredients} setIngredients={setIngredients} />
                
                <div className="mt-4">
                    <button onClick={() => setShowOptions(!showOptions)} className="text-sm font-medium text-emerald-600 dark:text-emerald-400 hover:underline">
                    {showOptions ? 'Hide' : 'Show'} Advanced Options
                    </button>
                </div>
                
                {showOptions && (
                    <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 animate-fade-in">
                        {optionFields.map(field => (
                            <div key={field.name}>
                                <label htmlFor={field.name} className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{field.label}</label>
                                <select id={field.name} name={field.name} value={options[field.name as keyof RecipeGenerationOptions]} onChange={handleOptionsChange} className="w-full text-sm rounded-md border-slate-300 bg-white text-slate-900 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 dark:bg-slate-700 dark:border-slate-600 dark:text-slate-200">
                                    {field.options.map(opt => {
                                      const value = field.name === 'language' ? opt : (opt === 'Any' ? '' : opt.toLowerCase());
                                      return <option key={opt} value={value}>{opt}</option>
                                    })}
                                </select>
                            </div>
                        ))}
                    </div>
                )}
                
                <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-4">
                    <button onClick={handleGenerateRecipes} disabled={isLoading || ingredients.length === 0} className="w-full sm:w-auto bg-emerald-600 text-white font-bold py-3 px-8 rounded-lg text-lg hover:bg-emerald-700 focus:outline-none focus:ring-4 focus:ring-emerald-300 transition-all duration-300 ease-in-out transform hover:scale-105 disabled:bg-slate-400 disabled:cursor-not-allowed disabled:scale-100">
                    {isLoading ? 'Generating...' : 'Generate Recipes'}
                    </button>
                    <button onClick={handleSurpriseMe} disabled={isLoading} className="w-full sm:w-auto bg-purple-600 text-white font-bold py-3 px-8 rounded-lg text-lg hover:bg-purple-700 focus:outline-none focus:ring-4 focus:ring-purple-300 transition-all duration-300 ease-in-out transform hover:scale-105 disabled:bg-slate-400 disabled:cursor-not-allowed disabled:scale-100">
                    Surprise Me!
                    </button>
                </div>
            </div>

            <div className="mt-8">
                {renderContent()}
            </div>
        </main>
      </div>
      <footer className="text-center mt-auto py-4 text-slate-500 dark:text-slate-400 text-sm">
        <p>Happy Cooking! &copy; {new Date().getFullYear()}</p>
      </footer>
    </div>
  );
};

export default App;

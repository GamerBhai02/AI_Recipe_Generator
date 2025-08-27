import React, { useState } from 'react';
import type { Recipe } from '../types';
import { ChefHatIcon, DownloadIcon, ClipboardIcon, StarIcon } from './icons';

interface RecipeCardProps {
  recipe: Recipe;
}

const formatRecipeForExport = (recipe: Recipe): string => {
    let content = `Recipe: ${recipe.recipeName}\n\n`;
    content += `Rating: ${recipe.rating} / 5\n\n`;
    content += `Description: ${recipe.description}\n\n`;
    content += 'Ingredients:\n';
    recipe.ingredients.forEach(ing => {
        content += `- ${ing.quantity} ${ing.item}\n`;
    });
    content += '\nInstructions:\n';
    recipe.instructions.forEach((step, index) => {
        content += `${index + 1}. ${step}\n`;
    });
    if (recipe.notes) {
        content += `\nChef's Notes:\n${recipe.notes}\n`;
    }
    return content;
};

const StarRating: React.FC<{ rating: number }> = ({ rating }) => {
    const totalStars = 5;
    const filledStars = Math.round(rating);
    return (
        <div className="flex items-center" aria-label={`Rating: ${rating} out of 5 stars`}>
            {[...Array(totalStars)].map((_, index) => (
                <StarIcon
                    key={index}
                    className={`w-5 h-5 ${index < filledStars ? 'text-amber-400' : 'text-slate-300 dark:text-slate-600'}`}
                />
            ))}
        </div>
    );
};

const RecipeCard: React.FC<RecipeCardProps> = ({ recipe }) => {
  const [copied, setCopied] = useState(false);

  const handleCopyToClipboard = () => {
    const recipeText = formatRecipeForExport(recipe);
    navigator.clipboard.writeText(recipeText).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleSaveAsTxt = () => {
    const recipeText = formatRecipeForExport(recipe);
    const blob = new Blob([recipeText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${recipe.recipeName.replace(/ /g, '_')}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg overflow-hidden transition-transform transform hover:-translate-y-1 w-full flex flex-col">
      <div className="p-6 flex-grow">
        <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0">
                <div className="bg-emerald-100 dark:bg-emerald-900/50 p-2 rounded-full flex-shrink-0">
                    <ChefHatIcon className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                </div>
                <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100 tracking-tight truncate">{recipe.recipeName}</h3>
            </div>
            <div className="flex-shrink-0">
                <StarRating rating={recipe.rating} />
            </div>
        </div>
        
        <p className="mt-3 text-slate-600 dark:text-slate-400">{recipe.description}</p>
        
        <div className="mt-6">
          <h4 className="text-lg font-semibold text-slate-700 dark:text-slate-200">Ingredients</h4>
          <ul className="mt-2 list-disc list-inside space-y-1 text-slate-600 dark:text-slate-400">
            {recipe.ingredients.map((ing, index) => (
              <li key={index}>
                <span className="font-medium text-slate-800 dark:text-slate-200">{ing.quantity}</span> {ing.item}
              </li>
            ))}
          </ul>
        </div>
        
        <div className="mt-6">
          <h4 className="text-lg font-semibold text-slate-700 dark:text-slate-200">Instructions</h4>
          <ol className="mt-2 list-decimal list-inside space-y-2 text-slate-600 dark:text-slate-400">
            {recipe.instructions.map((step, index) => (
              <li key={index}>{step}</li>
            ))}
          </ol>
        </div>

        {recipe.notes && (
          <div className="mt-6 bg-slate-50 border-l-4 border-slate-300 p-4 rounded-r-lg dark:bg-slate-700/50 dark:border-slate-500">
            <h4 className="font-semibold text-slate-700 dark:text-slate-200">Chef's Notes</h4>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{recipe.notes}</p>
          </div>
        )}
      </div>
      <div className="p-4 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-700 flex items-center justify-end gap-4">
          <button
              onClick={handleCopyToClipboard}
              className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-emerald-600 dark:text-slate-400 dark:hover:text-emerald-400 transition-colors"
              title="Copy to clipboard"
          >
              <ClipboardIcon className="w-5 h-5" />
              <span>{copied ? 'Copied!' : 'Copy'}</span>
          </button>
          <button
              onClick={handleSaveAsTxt}
              className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-emerald-600 dark:text-slate-400 dark:hover:text-emerald-400 transition-colors"
              title="Save as .txt"
          >
              <DownloadIcon className="w-5 h-5" />
              <span>Save</span>
          </button>
      </div>
    </div>
  );
};

export default RecipeCard;
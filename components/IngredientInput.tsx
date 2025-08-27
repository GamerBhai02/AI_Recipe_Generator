import React, { useState } from 'react';
import { PlusIcon, TrashIcon } from './icons';
import type { Ingredient } from '../types';

interface IngredientInputProps {
  ingredients: Ingredient[];
  setIngredients: React.Dispatch<React.SetStateAction<Ingredient[]>>;
}

const IngredientInput: React.FC<IngredientInputProps> = ({ ingredients, setIngredients }) => {
  const [itemName, setItemName] = useState('');
  const [itemQuantity, setItemQuantity] = useState('');

  const handleAddIngredient = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedItem = itemName.trim();
    if (trimmedItem && !ingredients.some(i => i.item.toLowerCase() === trimmedItem.toLowerCase())) {
      setIngredients([...ingredients, { item: trimmedItem, quantity: itemQuantity.trim() }]);
      setItemName('');
      setItemQuantity('');
    }
  };

  const handleRemoveIngredient = (itemToRemove: string) => {
    setIngredients(ingredients.filter(ing => ing.item.toLowerCase() !== itemToRemove.toLowerCase()));
  };

  return (
    <div className="w-full">
      <form onSubmit={handleAddIngredient} className="flex flex-col sm:flex-row gap-2">
        <input
          type="text"
          value={itemQuantity}
          onChange={(e) => setItemQuantity(e.target.value)}
          placeholder="e.g., 1 cup"
          className="w-full sm:w-32 px-4 py-3 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none transition duration-150 text-slate-900 dark:bg-slate-700 dark:border-slate-600 dark:text-slate-100 dark:placeholder-slate-400"
        />
        <input
          type="text"
          value={itemName}
          onChange={(e) => setItemName(e.target.value)}
          placeholder="e.g., flour, chicken breast"
          required
          className="flex-grow min-w-0 px-4 py-3 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none transition duration-150 text-slate-900 dark:bg-slate-700 dark:border-slate-600 dark:text-slate-100 dark:placeholder-slate-400"
        />
        <button
          type="submit"
          aria-label="Add ingredient"
          className="flex-shrink-0 bg-emerald-600 text-white font-bold py-3 px-5 rounded-lg hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 transition-transform transform hover:scale-105"
        >
          <PlusIcon className="w-5 h-5 inline-block sm:mr-2" />
          <span className="hidden sm:inline">Add</span>
        </button>
      </form>
      <div className="mt-4 flex flex-wrap gap-2">
        {ingredients.map((ingredient) => (
          <div
            key={ingredient.item.toLowerCase()}
            className="flex items-center bg-slate-200 text-slate-700 text-sm font-medium px-3 py-1 rounded-full animate-fade-in dark:bg-slate-600 dark:text-slate-200"
          >
            <span className="capitalize">{ingredient.quantity ? `${ingredient.quantity} ` : ''}{ingredient.item}</span>
            <button 
              onClick={() => handleRemoveIngredient(ingredient.item)} 
              className="ml-2 text-slate-500 hover:text-red-600 dark:text-slate-400 dark:hover:text-red-500"
              aria-label={`Remove ${ingredient.item}`}
            >
              <TrashIcon className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default IngredientInput;

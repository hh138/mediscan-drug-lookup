import React from 'react';
import { Category } from '../types';

interface CategoryFilterProps {
  selectedCategory: Category | '全部';
  onSelectCategory: (category: Category | '全部') => void;
}

export const CategoryFilter: React.FC<CategoryFilterProps> = ({ selectedCategory, onSelectCategory }) => {
  const categories = ['全部', ...Object.values(Category)];

  return (
    <div className="w-full overflow-x-auto no-scrollbar py-2">
      <div className="flex gap-2 px-4">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => onSelectCategory(cat as Category | '全部')}
            className={`whitespace-nowrap px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
              selectedCategory === cat
                ? 'bg-teal-600 text-white shadow-md shadow-teal-200'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>
    </div>
  );
};
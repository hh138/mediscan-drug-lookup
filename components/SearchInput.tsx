import React, { useState, useEffect } from 'react';
import { Search, X, Sparkles, Loader2 } from 'lucide-react';

interface SearchInputProps {
  onSearch: (query: string) => void;
  isSearching: boolean;
}

export const SearchInput: React.FC<SearchInputProps> = ({ onSearch, isSearching }) => {
  const [value, setValue] = useState('');
  
  // Debounce logic handled here or in parent. 
  
  useEffect(() => {
    const timer = setTimeout(() => {
        if (value.trim() === '') {
            onSearch('');
        }
    }, 300);
    return () => clearTimeout(timer);
  }, [value, onSearch]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(value);
  };

  const clearSearch = () => {
    setValue('');
    onSearch('');
  };

  return (
    <form onSubmit={handleSubmit} className="relative w-full">
      <div className="relative flex items-center">
        <Search className="absolute left-3 w-5 h-5 text-slate-400" />
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="搜索药品名称、品牌或症状..."
          className="w-full pl-10 pr-12 py-3 bg-white border border-slate-200 rounded-full text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent shadow-sm"
        />
        <div className="absolute right-3 flex items-center gap-1">
            {value && (
                <button
                type="button"
                onClick={clearSearch}
                className="p-1 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200"
                >
                <X className="w-3 h-3" />
                </button>
            )}
            <button
                type="submit" 
                disabled={isSearching}
                className={`p-2 rounded-full text-white transition-colors ${
                    isSearching ? 'bg-teal-400 cursor-not-allowed' : 'bg-teal-600 hover:bg-teal-700'
                }`}
            >
                {isSearching ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            </button>
        </div>
      </div>
      <p className="mt-2 text-xs text-slate-500 text-center px-4">
        试试搜索 <span className="text-teal-600 font-medium">"头痛"</span> 或 <span className="text-teal-600 font-medium">"抗生素"</span>。
      </p>
    </form>
  );
};
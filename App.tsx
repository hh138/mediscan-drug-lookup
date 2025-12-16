import React, { useState, useEffect, useMemo } from 'react';
import { MOCK_INVENTORY, HOSPITAL_NAME } from './constants';
import { Medicine, Category } from './types';
import { MedicineCard } from './components/MedicineCard';
import { SearchInput } from './components/SearchInput';
import { CategoryFilter } from './components/CategoryFilter';
import { searchInventoryWithAI } from './services/geminiService';
import { QRCodeView } from './components/QRCodeView';
import { Pill, QrCode, Stethoscope, Search as SearchIcon } from 'lucide-react';

// Simple Hash Router Concept for tabs
enum View {
  SEARCH = 'search',
  QR_GEN = 'qr_gen'
}

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>(View.SEARCH);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Category | '全部'>('全部');
  const [isSearchingAI, setIsSearchingAI] = useState(false);
  const [aiResultIds, setAiResultIds] = useState<string[] | null>(null);

  // Filter Logic
  const filteredMedicines = useMemo(() => {
    let results = MOCK_INVENTORY;

    // 1. Filter by Category
    if (selectedCategory !== '全部') {
      results = results.filter(m => m.category === selectedCategory);
    }

    // 2. Filter by Search Query
    if (searchQuery.trim()) {
      // If AI results exist, prioritise them, otherwise do basic string matching
      if (aiResultIds && aiResultIds.length > 0) {
        results = results.filter(m => aiResultIds.includes(m.id));
      } else {
        const lowerQ = searchQuery.toLowerCase();
        results = results.filter(m => 
          m.name.toLowerCase().includes(lowerQ) || 
          m.brandName.toLowerCase().includes(lowerQ) ||
          m.description.toLowerCase().includes(lowerQ)
        );
      }
    }

    return results;
  }, [searchQuery, selectedCategory, aiResultIds]);

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    setAiResultIds(null); // Reset AI results on new search input

    if (!query.trim()) return;

    // If query is long enough or looks like natural language, try AI
    // Simple heuristic: > 1 word or contains spaces or Chinese characters (often shorter)
    // For Chinese, length > 1 is usually enough context
    if (query.trim().length > 1) {
      setIsSearchingAI(true);
      try {
        const ids = await searchInventoryWithAI(query);
        if (ids.length > 0) {
          setAiResultIds(ids);
        }
      } catch (err) {
        console.error("AI search failed, falling back to local filter");
      } finally {
        setIsSearchingAI(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-20">
      
      {/* Header */}
      <header className="bg-white sticky top-0 z-30 shadow-sm">
        <div className="px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-teal-600 rounded-lg flex items-center justify-center text-white">
                    <Stethoscope className="w-5 h-5" />
                </div>
                <div>
                    <h1 className="text-lg font-bold leading-tight tracking-tight text-slate-800">MediScan</h1>
                    <p className="text-[10px] text-slate-500 font-medium uppercase tracking-wider">{HOSPITAL_NAME}</p>
                </div>
            </div>
            {/* Tab Switcher for Demo Purposes */}
            <div className="flex bg-slate-100 p-1 rounded-lg">
                <button 
                    onClick={() => setCurrentView(View.SEARCH)}
                    className={`p-1.5 rounded-md transition-all ${currentView === View.SEARCH ? 'bg-white shadow text-teal-600' : 'text-slate-400'}`}
                >
                    <SearchIcon className="w-4 h-4" />
                </button>
                <button 
                    onClick={() => setCurrentView(View.QR_GEN)}
                    className={`p-1.5 rounded-md transition-all ${currentView === View.QR_GEN ? 'bg-white shadow text-teal-600' : 'text-slate-400'}`}
                >
                    <QrCode className="w-4 h-4" />
                </button>
            </div>
        </div>
      </header>

      <main className="max-w-md mx-auto">
        
        {currentView === View.SEARCH ? (
            <>
                {/* Search Area */}
                <div className="bg-white pb-4 px-4 pt-2 mb-2 sticky top-[60px] z-20 shadow-sm ring-1 ring-slate-100">
                    <SearchInput onSearch={handleSearch} isSearching={isSearchingAI} />
                </div>

                {/* Categories */}
                <div className="mb-4">
                    <CategoryFilter selectedCategory={selectedCategory} onSelectCategory={setSelectedCategory} />
                </div>

                {/* Results Count & AI Badge */}
                <div className="px-4 mb-3 flex items-center justify-between">
                    <h2 className="text-sm font-semibold text-slate-700">
                        {searchQuery ? `搜索结果` : '现有药品'}
                        <span className="ml-2 text-xs font-normal text-slate-400">({filteredMedicines.length})</span>
                    </h2>
                    {aiResultIds && (
                        <span className="flex items-center gap-1 text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-full border border-indigo-100">
                            <Pill className="w-3 h-3" />
                            AI 智能匹配
                        </span>
                    )}
                </div>

                {/* List */}
                <div className="px-4 space-y-4 min-h-[50vh]">
                    {filteredMedicines.length > 0 ? (
                        filteredMedicines.map(med => (
                            <MedicineCard key={med.id} medicine={med} />
                        ))
                    ) : (
                        <div className="flex flex-col items-center justify-center py-12 text-center">
                            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                                <SearchIcon className="w-8 h-8 text-slate-300" />
                            </div>
                            <h3 className="text-slate-600 font-medium">未找到相关药品</h3>
                            <p className="text-slate-400 text-sm max-w-[200px] mt-1">
                                请尝试调整搜索词或清除筛选。
                            </p>
                            <button 
                                onClick={() => {
                                    setSearchQuery('');
                                    setSelectedCategory('全部');
                                    setAiResultIds(null);
                                }}
                                className="mt-4 text-teal-600 text-sm font-medium hover:underline"
                            >
                                清除所有筛选
                            </button>
                        </div>
                    )}
                </div>
            </>
        ) : (
            /* QR Generation View */
            <QRCodeView />
        )}
      </main>

      {/* Mobile Footer Navigation (Simulated) */}
      <footer className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 py-3 px-6 flex justify-between items-center text-xs font-medium text-slate-400 z-40">
        <div className="flex flex-col items-center gap-1 text-teal-600">
            <SearchIcon className="w-5 h-5" />
            <span>搜索</span>
        </div>
        <div className="flex flex-col items-center gap-1 hover:text-slate-600 cursor-pointer">
            <div className="relative">
                <Pill className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </div>
            <span>我的药品</span>
        </div>
        <div className="flex flex-col items-center gap-1 hover:text-slate-600 cursor-pointer">
            <Stethoscope className="w-5 h-5" />
            <span>服务</span>
        </div>
      </footer>
    </div>
  );
};

export default App;
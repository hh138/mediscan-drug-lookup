import React from 'react';
import { Medicine } from '../types';
import { Pill, Tag } from 'lucide-react';

interface MedicineCardProps {
  medicine: Medicine;
}

export const MedicineCard: React.FC<MedicineCardProps> = ({ medicine }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-md transition-shadow duration-200">
      <div className="p-4">
        <div className="flex justify-start items-start mb-2">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              {/* 优先显示通用名 (Generic Name) - 大标题 */}
              <h3 className="text-lg font-bold text-slate-800">{medicine.name}</h3>
              {!medicine.inStock && (
                 <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
                   缺货
                 </span>
              )}
              {medicine.inStock && (
                 <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                   有货
                 </span>
              )}
            </div>
            {/* 商品名/厂商名作为副标题显示 - 小标题 */}
              <p className="text-sm text-slate-500 font-medium mt-0.5">
                厂商: <span className="text-slate-700">{medicine.brandName}</span>
              </p>
            </div>
        </div>

        <p className="text-sm text-slate-600 mb-4 line-clamp-2">{medicine.description}</p>

        <div className="grid grid-cols-2 gap-y-2 text-xs text-slate-500">
          <div className="flex items-center gap-1.5">
            <Tag className="w-3.5 h-3.5 text-slate-400" />
            <span>{medicine.category}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Pill className="w-3.5 h-3.5 text-slate-400" />
            <span>{medicine.form} {medicine.dosage}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

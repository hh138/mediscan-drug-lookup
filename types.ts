
export enum Category {
  CARDIOVASCULAR = '心血管药',
  LIPID_LOWERING = '降血脂药',
  DIABETES = '降糖/胰岛素',
  NEURO_PSYCH = '神经/精神系统',
  PAIN_JOINT = '消炎止痛/骨关节',
  LIVER = '肝胆系统',
  THYROID = '甲状腺药',
  OTHER = '其他'
}

export interface Medicine {
  id: string;
  name: string; // Generic name
  brandName: string;
  category: Category;
  description: string;
  form: string; // Tablet, Syrup, Injection
  dosage: string;
  price: number; // In RMB for context
  inStock: boolean;
}

export interface SearchState {
  query: string;
  results: Medicine[];
  isSearching: boolean;
  usedAI: boolean;
}

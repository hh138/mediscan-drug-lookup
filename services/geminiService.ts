import { GoogleGenAI, Type } from "@google/genai";
import { MOCK_INVENTORY } from '../constants';
import { Medicine } from '../types';

// Initialize Gemini Client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Uses Gemini to interpret a user's natural language query (which might be symptoms)
 * and maps it to specific medicine IDs in our inventory.
 */
export const searchInventoryWithAI = async (userQuery: string): Promise<string[]> => {
  try {
    // We provide a simplified version of the inventory to the model to save tokens/latency
    const inventoryContext = MOCK_INVENTORY.map(m => 
      `ID: ${m.id}, 名称: ${m.name} (厂商: ${m.brandName}), 分类: ${m.category}, 描述: ${m.description}`
    ).join('\n');

    const prompt = `
      你是一家医院的智能药剂师助手。
      
      用户查询: "${userQuery}"
      
      以下是我们当前的药品库存清单:
      ${inventoryContext}
      
      任务:
      1. 分析用户查询。它可能是药品名称、厂商名称或症状（例如，“头痛”，“胃痛”）。
      2. 识别库存中哪些药品最相关。
      3. 仅返回一个包含匹配药品ID列表的JSON对象。
      4. 如果查询暗示了非处方药/基本药物无法治疗的严重疾病，请匹配最相关的药物，但优先考虑安全性（例如缓解症状）。
      5. 如果未找到匹配项，请返回一个空列表。
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            matchedIds: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "与查询匹配的药品ID列表"
            }
          }
        }
      }
    });

    const jsonText = response.text;
    if (!jsonText) return [];
    
    const parsed = JSON.parse(jsonText);
    return parsed.matchedIds || [];

  } catch (error) {
    console.error("Gemini Search Error:", error);
    return [];
  }
};
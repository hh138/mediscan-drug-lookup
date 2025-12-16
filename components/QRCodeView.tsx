import React, { useEffect, useState } from 'react';
import { Printer, Share2, Info, Link as LinkIcon, AlertTriangle } from 'lucide-react';
import { HOSPITAL_NAME } from '../constants';

export const QRCodeView: React.FC = () => {
  const [url, setUrl] = useState('');
  
  useEffect(() => {
    // 初始化时获取当前地址
    setUrl(window.location.href);
  }, []);

  const isBlob = url.startsWith('blob:');
  
  // 使用成熟的公共 API 生成二维码图片，确保微信 100% 可识别
  // size=300x300 保证清晰度
  // margin=10 增加白色边距，防止识别困难
  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&margin=10&data=${encodeURIComponent(url || 'https://www.baidu.com')}`;

  return (
    <div className="flex flex-col items-center justify-center p-6 text-center space-y-6 bg-white rounded-2xl shadow-sm border border-slate-100 m-4">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-slate-800">扫码查询</h2>
        <p className="text-slate-500 text-sm max-w-xs mx-auto">
          无需下载 App，微信直接扫描下方二维码。
        </p>
      </div>

      <div className="relative group">
         <div className="absolute -inset-1 bg-gradient-to-r from-teal-500 to-blue-500 rounded-lg blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
         <div className="relative p-1 bg-white rounded-lg border-2 border-slate-900 aspect-square flex items-center justify-center overflow-hidden">
            {/* 使用图片标签，微信扫描识别率更高 */}
            {url ? (
               <img 
                 src={qrImageUrl} 
                 alt="QR Code" 
                 className="w-48 h-48 object-contain"
               />
            ) : (
               <div className="w-48 h-48 bg-slate-50 flex items-center justify-center text-slate-400 text-xs">
                 输入网址后生成
               </div>
            )}
         </div>
      </div>

      {/* URL 编辑区 */}
      <div className="w-full max-w-xs">
        <label className="block text-xs text-slate-500 mb-1 text-left font-medium">
            二维码指向网址:
        </label>
        <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-teal-500 focus-within:border-transparent transition-all">
            <LinkIcon className="w-4 h-4 text-slate-400 flex-shrink-0" />
            <input 
                type="text" 
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="bg-transparent border-none text-sm text-slate-700 w-full focus:outline-none placeholder:text-slate-400"
                placeholder="请输入有效网址..."
            />
        </div>
        
        {isBlob && (
            <div className="mt-2 flex items-start gap-1.5 text-left bg-orange-50 p-2 rounded border border-orange-100">
                <AlertTriangle className="w-3.5 h-3.5 text-orange-500 mt-0.5 flex-shrink-0" />
                <p className="text-[10px] text-orange-700 leading-tight">
                    <strong>重要提示：</strong> 检测到预览地址 (blob:...)，手机无法直接访问。请在上方输入框填入 <span className="font-mono bg-orange-100 px-1 rounded">https://www.baidu.com</span> 测试扫描，或填入您部署后的正式网址。
                </p>
            </div>
        )}
      </div>

      <div className="bg-slate-50 p-4 rounded-lg w-full">
         <div className="flex items-center justify-center gap-2 mb-1">
            <Info className="w-4 h-4 text-teal-600" />
            <span className="font-semibold text-slate-700">{HOSPITAL_NAME}</span>
         </div>
         <p className="text-xs text-slate-500">
            支持 微信 / 支付宝 / 浏览器 扫码
         </p>
      </div>

      <div className="flex gap-3 w-full">
        <button 
          onClick={() => window.print()}
          className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 bg-slate-800 text-white rounded-lg text-sm font-medium hover:bg-slate-700 transition-colors"
        >
            <Printer className="w-4 h-4" />
            打印
        </button>
        <button 
          onClick={() => {
             if (navigator.share) {
              navigator.share({
                title: 'MediScan 药品查询',
                url: url,
              }).catch(() => {});
            } else {
              navigator.clipboard.writeText(url);
              alert('网址已复制');
            }
          }}
          className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 bg-teal-50 text-teal-700 rounded-lg text-sm font-medium hover:bg-teal-100 transition-colors"
        >
            <Share2 className="w-4 h-4" />
            分享
        </button>
      </div>
    </div>
  );
};
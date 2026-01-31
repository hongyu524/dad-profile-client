import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function StockInstitutionCard({ stock, onStockClick }) {
  const formatNumber = (num) => {
    if (!num) return '-';
    return num.toLocaleString() + '万';
  };

  return (
    <Card 
      className="bg-slate-800/50 border-slate-700/50 hover:border-emerald-500/30 transition-all duration-300 cursor-pointer group"
      onClick={() => onStockClick && onStockClick(stock)}
    >
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-3">
          <div className="flex-1">
            <div className="mb-1">
              <h3 className="text-lg font-bold text-white group-hover:text-emerald-400 transition-colors">
                {stock.name}
              </h3>
            </div>
            <p className="text-sm text-slate-400">{stock.code}</p>
          </div>
        </div>

        <div className="space-y-3">
          <div>
            <p className="text-xs font-semibold text-emerald-400 mb-2">北上</p>
            <div className="grid grid-cols-3 gap-2 text-xs">
              <div>
                <p className="text-slate-500">新进</p>
                <p className="text-white">{formatNumber(stock.beishang_new)}</p>
              </div>
              <div>
                <p className="text-slate-500">增持</p>
                <p className="text-white">{formatNumber(stock.beishang_increase)}</p>
              </div>
              <div>
                <p className="text-slate-500">减持</p>
                <p className="text-white">{formatNumber(stock.beishang_decrease)}</p>
              </div>
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold text-blue-400 mb-2">公募</p>
            <div className="grid grid-cols-3 gap-2 text-xs">
              <div>
                <p className="text-slate-500">新进</p>
                <p className="text-white">{formatNumber(stock.gongmu_new)}</p>
              </div>
              <div>
                <p className="text-slate-500">增持</p>
                <p className="text-white">{formatNumber(stock.gongmu_increase)}</p>
              </div>
              <div>
                <p className="text-slate-500">减持</p>
                <p className="text-white">{formatNumber(stock.gongmu_decrease)}</p>
              </div>
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold text-purple-400 mb-2">外资</p>
            <div className="grid grid-cols-3 gap-2 text-xs">
              <div>
                <p className="text-slate-500">新进</p>
                <p className="text-white">{formatNumber(stock.waizi_new)}</p>
              </div>
              <div>
                <p className="text-slate-500">增持</p>
                <p className="text-white">{formatNumber(stock.waizi_increase)}</p>
              </div>
              <div>
                <p className="text-slate-500">减持</p>
                <p className="text-white">{formatNumber(stock.waizi_decrease)}</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div>
              <p className="text-xs font-semibold text-orange-400 mb-1">私募</p>
              <div className="text-xs space-y-1">
                <div><span className="text-slate-500">新进:</span> <span className="text-white">{formatNumber(stock.simu_new)}</span></div>
                <div><span className="text-slate-500">增持:</span> <span className="text-white">{formatNumber(stock.simu_increase)}</span></div>
                <div><span className="text-slate-500">减持:</span> <span className="text-white">{formatNumber(stock.simu_decrease)}</span></div>
              </div>
            </div>
            
            <div>
              <p className="text-xs font-semibold text-yellow-400 mb-1">社保</p>
              <div className="text-xs space-y-1">
                <div><span className="text-slate-500">新进:</span> <span className="text-white">{formatNumber(stock.shebao_new)}</span></div>
                <div><span className="text-slate-500">增持:</span> <span className="text-white">{formatNumber(stock.shebao_increase)}</span></div>
                <div><span className="text-slate-500">减持:</span> <span className="text-white">{formatNumber(stock.shebao_decrease)}</span></div>
              </div>
            </div>

            <div>
              <p className="text-xs font-semibold text-pink-400 mb-1">养老</p>
              <div className="text-xs space-y-1">
                <div><span className="text-slate-500">新进:</span> <span className="text-white">{formatNumber(stock.yanglao_new)}</span></div>
                <div><span className="text-slate-500">增持:</span> <span className="text-white">{formatNumber(stock.yanglao_increase)}</span></div>
                <div><span className="text-slate-500">减持:</span> <span className="text-white">{formatNumber(stock.yanglao_decrease)}</span></div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
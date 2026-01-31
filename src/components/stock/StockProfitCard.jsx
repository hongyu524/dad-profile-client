import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

export default function StockProfitCard({ stock, onStockClick }) {
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

        <div className="space-y-2">
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
              <p className="text-slate-500 text-xs mb-1">一季报</p>
              <p className="text-white font-medium">{stock.q1_report || '-'}</p>
            </div>
            <div>
              <p className="text-slate-500 text-xs mb-1">二季报</p>
              <p className="text-white font-medium">{stock.q2_report || '-'}</p>
            </div>
            <div>
              <p className="text-slate-500 text-xs mb-1">三季报</p>
              <p className="text-white font-medium">{stock.q3_report || '-'}</p>
            </div>
            <div>
              <p className="text-slate-500 text-xs mb-1">年报</p>
              <p className="text-white font-medium">{stock.annual_report || '-'}</p>
            </div>
            <div>
              <p className="text-slate-500 text-xs mb-1">毛率</p>
              <p className="text-white font-medium">{stock.gross_margin || '-'}</p>
            </div>
            <div>
              <p className="text-slate-500 text-xs mb-1">净利润增长</p>
              <p className="text-white font-medium">{stock.profit_growth || '-'}</p>
            </div>
            <div>
              <p className="text-slate-500 text-xs mb-1">送股</p>
              <p className="text-white font-medium">{stock.bonus_shares || '-'}</p>
            </div>
            <div>
              <p className="text-slate-500 text-xs mb-1">派现</p>
              <p className="text-white font-medium">{stock.dividend || '-'}</p>
            </div>
          </div>
          
          {stock.quarterly_comparison && (
            <div className="pt-2 border-t border-slate-700">
              <p className="text-slate-500 text-xs mb-1">季报比较</p>
              <p className="text-slate-300 text-sm">{stock.quarterly_comparison}</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function StockCard({ stock, onStockClick }) {
  const formatNumber = (num) => {
    if (!num) return '-';
    return (num / 10000).toFixed(2) + '万';
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

        <div className="space-y-2">
          <div className="flex flex-wrap gap-2">
            {stock.industry_74 && (
              <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
                一级: {stock.industry_74}
              </Badge>
            )}
            {stock.industry_level2 && (
              <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                二级: {stock.industry_level2}
              </Badge>
            )}
            {stock.industry_level3 && (
              <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">
                年报: {stock.industry_level3}
              </Badge>
            )}
          </div>
          
          <div className="grid grid-cols-2 gap-2 mt-3 text-sm">
            <div>
              <p className="text-slate-500 text-xs mb-1">总股本</p>
              <p className="text-white font-medium">{formatNumber(stock.total_shares)}</p>
            </div>
            <div>
              <p className="text-slate-500 text-xs mb-1">流通股</p>
              <p className="text-white font-medium">{formatNumber(stock.circulating_shares)}</p>
            </div>
            <div>
              <p className="text-slate-500 text-xs mb-1">限售股</p>
              <p className="text-white font-medium">{formatNumber(stock.restricted_shares)}</p>
            </div>
            <div>
              <p className="text-slate-500 text-xs mb-1">股票利润</p>
              <p className="text-white font-medium">{formatNumber(stock.profit)}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
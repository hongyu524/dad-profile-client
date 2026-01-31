import React, { useState, useMemo } from 'react';
import { Edit, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';

export default function StockInstitutionTable({ stocks, onStockEdit }) {
  const [sortField, setSortField] = useState(null);
  const [sortOrder, setSortOrder] = useState('asc');

  const formatNumber = (num) => {
    if (!num) return '-';
    return Math.round(num).toLocaleString();
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const sortedStocks = useMemo(() => {
    if (!sortField) return stocks;

    return [...stocks].sort((a, b) => {
      let aValue = a[sortField];
      let bValue = b[sortField];

      if (aValue === null || aValue === undefined) aValue = '';
      if (bValue === null || bValue === undefined) bValue = '';

      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
      }

      const aStr = String(aValue).toLowerCase();
      const bStr = String(bValue).toLowerCase();
      if (sortOrder === 'asc') {
        return aStr.localeCompare(bStr, 'zh-CN');
      } else {
        return bStr.localeCompare(aStr, 'zh-CN');
      }
    });
  }, [stocks, sortField, sortOrder]);

  const SortIcon = ({ field }) => {
    if (sortField !== field) return <ArrowUpDown className="w-3 h-3 ml-1 inline opacity-40" />;
    return sortOrder === 'asc' ? 
      <ArrowUp className="w-3 h-3 ml-1 inline text-emerald-400" /> : 
      <ArrowDown className="w-3 h-3 ml-1 inline text-emerald-400" />;
  };

  return (
    <div className="overflow-x-auto rounded-xl border border-slate-700/50">
      <table className="w-full">
        <thead className="bg-slate-800/80 sticky top-0">
          <tr>
            <th className="px-2 py-2 text-center text-xs font-semibold text-slate-400 uppercase" rowSpan="2">序</th>
            <th 
              onClick={() => handleSort('code')}
              className="px-2 py-2 text-left text-xs font-semibold text-slate-400 uppercase cursor-pointer hover:text-emerald-400 transition-colors" 
              rowSpan="2"
            >
              代码<SortIcon field="code" />
            </th>
            <th 
              onClick={() => handleSort('name')}
              className="px-2 py-2 text-left text-xs font-semibold text-slate-400 uppercase whitespace-nowrap cursor-pointer hover:text-emerald-400 transition-colors" 
              rowSpan="2"
            >
              股票名称<SortIcon field="name" />
            </th>
            <th 
              onClick={() => handleSort('beishang_current')}
              className="px-2 py-2 text-center text-xs font-semibold text-slate-400 uppercase border-l border-slate-700 cursor-pointer hover:text-emerald-400 transition-colors" 
              colSpan="4"
            >
              北上<SortIcon field="beishang_current" />
            </th>
            <th 
              onClick={() => handleSort('gongmu_current')}
              className="px-2 py-2 text-center text-xs font-semibold text-slate-400 uppercase border-l border-slate-700 cursor-pointer hover:text-emerald-400 transition-colors" 
              colSpan="4"
            >
              公募<SortIcon field="gongmu_current" />
            </th>
            <th 
              onClick={() => handleSort('waizi_current')}
              className="px-2 py-2 text-center text-xs font-semibold text-slate-400 uppercase border-l border-slate-700 cursor-pointer hover:text-emerald-400 transition-colors" 
              colSpan="4"
            >
              外资<SortIcon field="waizi_current" />
            </th>
            <th 
              onClick={() => handleSort('simu_current')}
              className="px-2 py-2 text-center text-xs font-semibold text-slate-400 uppercase border-l border-slate-700 cursor-pointer hover:text-emerald-400 transition-colors" 
              colSpan="4"
            >
              私募<SortIcon field="simu_current" />
            </th>
            <th 
              onClick={() => handleSort('shebao_current')}
              className="px-2 py-2 text-center text-xs font-semibold text-slate-400 uppercase border-l border-slate-700 cursor-pointer hover:text-emerald-400 transition-colors" 
              colSpan="4"
            >
              社保<SortIcon field="shebao_current" />
            </th>
            <th 
              onClick={() => handleSort('yanglao_current')}
              className="px-2 py-2 text-center text-xs font-semibold text-slate-400 uppercase border-l border-slate-700 cursor-pointer hover:text-emerald-400 transition-colors" 
              colSpan="4"
            >
              养老基金<SortIcon field="yanglao_current" />
            </th>
            <th className="px-4 py-2 text-center text-xs font-semibold text-slate-400 uppercase w-20 sticky right-0 bg-slate-800/95 backdrop-blur-sm shadow-[-4px_0_8px_rgba(0,0,0,0.3)]" rowSpan="2">操作</th>
          </tr>
          <tr>
            <th className="px-2 py-1.5 text-xs font-medium text-slate-400 border-l border-slate-700">总持</th>
            <th className="px-2 py-1.5 text-xs font-medium text-slate-400">新进</th>
            <th className="px-2 py-1.5 text-xs font-medium text-slate-400">增持</th>
            <th className="px-2 py-1.5 text-xs font-medium text-slate-400">减持</th>
            <th className="px-2 py-1.5 text-xs font-medium text-slate-400 border-l border-slate-700">总持</th>
            <th className="px-2 py-1.5 text-xs font-medium text-slate-400">新进</th>
            <th className="px-2 py-1.5 text-xs font-medium text-slate-400">增持</th>
            <th className="px-2 py-1.5 text-xs font-medium text-slate-400">减持</th>
            <th className="px-2 py-1.5 text-xs font-medium text-slate-400 border-l border-slate-700">总持</th>
            <th className="px-2 py-1.5 text-xs font-medium text-slate-400">新进</th>
            <th className="px-2 py-1.5 text-xs font-medium text-slate-400">增持</th>
            <th className="px-2 py-1.5 text-xs font-medium text-slate-400">减持</th>
            <th className="px-2 py-1.5 text-xs font-medium text-slate-400 border-l border-slate-700">总持</th>
            <th className="px-2 py-1.5 text-xs font-medium text-slate-400">新进</th>
            <th className="px-2 py-1.5 text-xs font-medium text-slate-400">增持</th>
            <th className="px-2 py-1.5 text-xs font-medium text-slate-400">减持</th>
            <th className="px-2 py-1.5 text-xs font-medium text-slate-400 border-l border-slate-700">总持</th>
            <th className="px-2 py-1.5 text-xs font-medium text-slate-400">新进</th>
            <th className="px-2 py-1.5 text-xs font-medium text-slate-400">增持</th>
            <th className="px-2 py-1.5 text-xs font-medium text-slate-400">减持</th>
            <th className="px-2 py-1.5 text-xs font-medium text-slate-400 border-l border-slate-700">总持</th>
            <th className="px-2 py-1.5 text-xs font-medium text-slate-400">新进</th>
            <th className="px-2 py-1.5 text-xs font-medium text-slate-400">增持</th>
            <th className="px-2 py-1.5 text-xs font-medium text-slate-400">减持</th>
          </tr>
        </thead>
        <tbody className="bg-slate-900/50 divide-y divide-slate-700/50">
          {sortedStocks.map((stock, index) => (
            <tr 
              key={stock.id}
              className="hover:bg-slate-800/50 transition-colors"
            >
              <td className="px-2 py-2 text-sm text-slate-400 text-center">{index + 1}</td>
              <td className="px-2 py-2 text-sm text-slate-300 font-mono">{stock.code}</td>
              <td className="px-2 py-2 text-sm text-white font-medium whitespace-nowrap">{stock.name}</td>
              <td className="px-2 py-2 text-sm text-emerald-400 text-right font-medium border-l border-slate-700">{formatNumber(stock.beishang_current)}</td>
              <td className="px-2 py-2 text-sm text-slate-300 text-right">{formatNumber(stock.beishang_new)}</td>
              <td className="px-2 py-2 text-sm text-slate-300 text-right">{formatNumber(stock.beishang_increase)}</td>
              <td className="px-2 py-2 text-sm text-slate-300 text-right">{formatNumber(stock.beishang_decrease)}</td>
              <td className="px-2 py-2 text-sm text-emerald-400 text-right font-medium border-l border-slate-700">{formatNumber(stock.gongmu_current)}</td>
              <td className="px-2 py-2 text-sm text-slate-300 text-right">{formatNumber(stock.gongmu_new)}</td>
              <td className="px-2 py-2 text-sm text-slate-300 text-right">{formatNumber(stock.gongmu_increase)}</td>
              <td className="px-2 py-2 text-sm text-slate-300 text-right">{formatNumber(stock.gongmu_decrease)}</td>
              <td className="px-2 py-2 text-sm text-emerald-400 text-right font-medium border-l border-slate-700">{formatNumber(stock.waizi_current)}</td>
              <td className="px-2 py-2 text-sm text-slate-300 text-right">{formatNumber(stock.waizi_new)}</td>
              <td className="px-2 py-2 text-sm text-slate-300 text-right">{formatNumber(stock.waizi_increase)}</td>
              <td className="px-2 py-2 text-sm text-slate-300 text-right">{formatNumber(stock.waizi_decrease)}</td>
              <td className="px-2 py-2 text-sm text-emerald-400 text-right font-medium border-l border-slate-700">{formatNumber(stock.simu_current)}</td>
              <td className="px-2 py-2 text-sm text-slate-300 text-right">{formatNumber(stock.simu_new)}</td>
              <td className="px-2 py-2 text-sm text-slate-300 text-right">{formatNumber(stock.simu_increase)}</td>
              <td className="px-2 py-2 text-sm text-slate-300 text-right">{formatNumber(stock.simu_decrease)}</td>
              <td className="px-2 py-2 text-sm text-emerald-400 text-right font-medium border-l border-slate-700">{formatNumber(stock.shebao_current)}</td>
              <td className="px-2 py-2 text-sm text-slate-300 text-right">{formatNumber(stock.shebao_new)}</td>
              <td className="px-2 py-2 text-sm text-slate-300 text-right">{formatNumber(stock.shebao_increase)}</td>
              <td className="px-2 py-2 text-sm text-slate-300 text-right">{formatNumber(stock.shebao_decrease)}</td>
              <td className="px-2 py-2 text-sm text-emerald-400 text-right font-medium border-l border-slate-700">{formatNumber(stock.yanglao_current)}</td>
              <td className="px-2 py-2 text-sm text-slate-300 text-right">{formatNumber(stock.yanglao_new)}</td>
              <td className="px-2 py-2 text-sm text-slate-300 text-right">{formatNumber(stock.yanglao_increase)}</td>
              <td className="px-2 py-2 text-sm text-slate-300 text-right">{formatNumber(stock.yanglao_decrease)}</td>
              <td className="px-4 py-2 text-center w-20 sticky right-0 bg-slate-900/95 backdrop-blur-sm shadow-[-4px_0_8px_rgba(0,0,0,0.3)]">
                <button
                  onClick={() => onStockEdit(stock)}
                  className="p-2 hover:bg-slate-700/50 rounded transition-colors text-blue-400 hover:text-blue-300"
                  title="编辑"
                >
                  <Edit className="w-4 h-4" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
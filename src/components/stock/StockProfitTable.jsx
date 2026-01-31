import React, { useState, useMemo } from 'react';
import { Edit, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';

export default function StockProfitTable({ stocks, onStockEdit }) {
  const [sortField, setSortField] = useState(null);
  const [sortOrder, setSortOrder] = useState('asc');

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
            <th className="px-3 py-3 text-center text-xs font-semibold text-slate-400 uppercase">序</th>
            <th 
              onClick={() => handleSort('code')}
              className="px-3 py-3 text-left text-xs font-semibold text-slate-400 uppercase cursor-pointer hover:text-emerald-400 transition-colors"
            >
              代码<SortIcon field="code" />
            </th>
            <th 
              onClick={() => handleSort('name')}
              className="px-3 py-3 text-left text-xs font-semibold text-slate-400 uppercase cursor-pointer hover:text-emerald-400 transition-colors"
            >
              股票名称<SortIcon field="name" />
            </th>
            <th 
              onClick={() => handleSort('q1_report')}
              className="px-3 py-3 text-left text-xs font-semibold text-slate-400 uppercase cursor-pointer hover:text-emerald-400 transition-colors"
            >
              一季报<SortIcon field="q1_report" />
            </th>
            <th 
              onClick={() => handleSort('q2_report')}
              className="px-3 py-3 text-left text-xs font-semibold text-slate-400 uppercase cursor-pointer hover:text-emerald-400 transition-colors"
            >
              二季报<SortIcon field="q2_report" />
            </th>
            <th 
              onClick={() => handleSort('q3_report')}
              className="px-3 py-3 text-left text-xs font-semibold text-slate-400 uppercase cursor-pointer hover:text-emerald-400 transition-colors"
            >
              三季报<SortIcon field="q3_report" />
            </th>
            <th 
              onClick={() => handleSort('annual_report')}
              className="px-3 py-3 text-left text-xs font-semibold text-slate-400 uppercase cursor-pointer hover:text-emerald-400 transition-colors"
            >
              年报<SortIcon field="annual_report" />
            </th>
            <th 
              onClick={() => handleSort('gross_margin')}
              className="px-3 py-3 text-left text-xs font-semibold text-slate-400 uppercase cursor-pointer hover:text-emerald-400 transition-colors"
            >
              毛率<SortIcon field="gross_margin" />
            </th>
            <th 
              onClick={() => handleSort('net_asset_ratio')}
              className="px-3 py-3 text-left text-xs font-semibold text-slate-400 uppercase cursor-pointer hover:text-emerald-400 transition-colors"
            >
              净资率<SortIcon field="net_asset_ratio" />
            </th>
            <th 
              onClick={() => handleSort('undistributed_cash')}
              className="px-3 py-3 text-left text-xs font-semibold text-slate-400 uppercase cursor-pointer hover:text-emerald-400 transition-colors"
            >
              未分现金<SortIcon field="undistributed_cash" />
            </th>
            <th 
              onClick={() => handleSort('bonus_shares')}
              className="px-3 py-3 text-left text-xs font-semibold text-slate-400 uppercase cursor-pointer hover:text-emerald-400 transition-colors"
            >
              送股<SortIcon field="bonus_shares" />
            </th>
            <th 
              onClick={() => handleSort('dividend')}
              className="px-3 py-3 text-left text-xs font-semibold text-slate-400 uppercase cursor-pointer hover:text-emerald-400 transition-colors"
            >
              派现<SortIcon field="dividend" />
            </th>
            <th 
              onClick={() => handleSort('quarterly_comparison')}
              className="px-3 py-3 text-left text-xs font-semibold text-slate-400 uppercase cursor-pointer hover:text-emerald-400 transition-colors"
            >
              季报比较<SortIcon field="quarterly_comparison" />
            </th>
            <th className="px-4 py-3 text-center text-xs font-semibold text-slate-400 uppercase w-20 sticky right-0 bg-slate-800/80 backdrop-blur-sm border-l border-slate-700">操作</th>
          </tr>
        </thead>
        <tbody className="bg-slate-900/50 divide-y divide-slate-700/50">
          {sortedStocks.map((stock, index) => (
            <tr 
              key={stock.id}
              className="hover:bg-slate-800/50 transition-colors"
            >
              <td className="px-3 py-3 text-sm text-slate-400 text-center">{index + 1}</td>
              <td className="px-3 py-3 text-sm text-slate-300 font-mono">{stock.code}</td>
              <td className="px-3 py-3 text-sm text-white font-medium">{stock.name}</td>
              <td className="px-3 py-3 text-sm text-slate-400">{stock.q1_report || '-'}</td>
              <td className="px-3 py-3 text-sm text-slate-400">{stock.q2_report || '-'}</td>
              <td className="px-3 py-3 text-sm text-slate-400">{stock.q3_report || '-'}</td>
              <td className="px-3 py-3 text-sm text-slate-400">{stock.annual_report || '-'}</td>
              <td className="px-3 py-3 text-sm text-slate-400">{stock.gross_margin || '-'}</td>
              <td className="px-3 py-3 text-sm text-slate-400">{stock.net_asset_ratio || '-'}</td>
              <td className="px-3 py-3 text-sm text-slate-400">{stock.undistributed_cash || '-'}</td>
              <td className="px-3 py-3 text-sm text-slate-400">{stock.bonus_shares || '-'}</td>
              <td className="px-3 py-3 text-sm text-slate-400">{stock.dividend || '-'}</td>
              <td className="px-3 py-3 text-sm text-slate-400 max-w-xs truncate">{stock.quarterly_comparison || '-'}</td>
              <td className="px-4 py-3 text-center w-20 sticky right-0 bg-slate-900/90 backdrop-blur-sm border-l border-slate-700/50">
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
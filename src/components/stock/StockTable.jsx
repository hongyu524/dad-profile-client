import React, { useState, useMemo } from 'react';
import { Edit, Sparkles, Newspaper, FileText, ArrowUpDown, ArrowUp, ArrowDown, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '../../utils';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

export default function StockTable({ stocks, onStockEdit, highlightedCode }) {
  const navigate = useNavigate();
  const [sortField, setSortField] = useState(null);
  const [sortOrder, setSortOrder] = useState('asc');
  const [notesDialog, setNotesDialog] = useState({ open: false, content: '', stockName: '' });
  
  const formatNumber = (num) => {
    if (!num) return '-';
    return num.toLocaleString();
  };

  const handleAIAnalysis = (stock, e) => {
    e.stopPropagation();
    navigate(createPageUrl('AIAnalysis') + `?stock=${stock.id}`);
  };

  const handleViewNotes = (stock, e) => {
    e.stopPropagation();
    setNotesDialog({
      open: true,
      content: stock.notes || '无备注',
      stockName: stock.name
    });
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

      // 处理空值
      if (aValue === null || aValue === undefined) aValue = 0;
      if (bValue === null || bValue === undefined) bValue = 0;

      // 数字字段排序
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
      }

      // 字符串字段排序
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
      <table className="w-full min-w-max">
        <thead className="bg-slate-800/80 sticky top-0">
          <tr>
            <th className="px-3 py-3 text-center text-xs font-semibold text-slate-400 uppercase whitespace-nowrap">序</th>
            <th 
              onClick={() => handleSort('code')}
              className="px-3 py-3 text-left text-xs font-semibold text-slate-400 uppercase whitespace-nowrap cursor-pointer hover:text-emerald-400 transition-colors"
            >
              代码<SortIcon field="code" />
            </th>
            <th 
              onClick={() => handleSort('name')}
              className="px-3 py-3 text-left text-xs font-semibold text-slate-400 uppercase whitespace-nowrap cursor-pointer hover:text-emerald-400 transition-colors"
            >
              股票名称<SortIcon field="name" />
            </th>
            <th 
              onClick={() => handleSort('total_shares')}
              className="px-3 py-3 text-right text-xs font-semibold text-slate-400 uppercase whitespace-nowrap cursor-pointer hover:text-emerald-400 transition-colors"
            >
              总股本<SortIcon field="total_shares" />
            </th>
            <th 
              onClick={() => handleSort('circulating_shares')}
              className="px-3 py-3 text-right text-xs font-semibold text-slate-400 uppercase whitespace-nowrap cursor-pointer hover:text-emerald-400 transition-colors"
            >
              流通股<SortIcon field="circulating_shares" />
            </th>
            <th 
              onClick={() => handleSort('restricted_shares')}
              className="px-3 py-3 text-right text-xs font-semibold text-slate-400 uppercase whitespace-nowrap cursor-pointer hover:text-emerald-400 transition-colors"
            >
              限售股<SortIcon field="restricted_shares" />
            </th>
            <th 
              onClick={() => handleSort('profit')}
              className="px-3 py-3 text-right text-xs font-semibold text-slate-400 uppercase whitespace-nowrap cursor-pointer hover:text-emerald-400 transition-colors"
            >
              股票利润<SortIcon field="profit" />
            </th>
            <th 
              onClick={() => handleSort('industry_74')}
              className="px-3 py-3 text-left text-xs font-semibold text-slate-400 uppercase whitespace-nowrap cursor-pointer hover:text-emerald-400 transition-colors"
            >
              一级行业<SortIcon field="industry_74" />
            </th>
            <th 
              onClick={() => handleSort('industry_level2')}
              className="px-3 py-3 text-left text-xs font-semibold text-slate-400 uppercase whitespace-nowrap cursor-pointer hover:text-emerald-400 transition-colors"
            >
              二级行业<SortIcon field="industry_level2" />
            </th>
            <th 
              onClick={() => handleSort('industry_level3')}
              className="px-3 py-3 text-left text-xs font-semibold text-slate-400 uppercase whitespace-nowrap cursor-pointer hover:text-emerald-400 transition-colors"
            >
              年报行业<SortIcon field="industry_level3" />
            </th>
            <th 
              onClick={() => handleSort('concept')}
              className="px-3 py-3 text-left text-xs font-semibold text-slate-400 uppercase whitespace-nowrap cursor-pointer hover:text-emerald-400 transition-colors"
            >
              概念<SortIcon field="concept" />
            </th>
            <th 
              onClick={() => handleSort('product')}
              className="px-3 py-3 text-left text-xs font-semibold text-slate-400 uppercase whitespace-nowrap cursor-pointer hover:text-emerald-400 transition-colors"
            >
              产品<SortIcon field="product" />
            </th>
            <th 
              onClick={() => handleSort('percentage')}
              className="px-3 py-3 text-left text-xs font-semibold text-slate-400 uppercase whitespace-nowrap cursor-pointer hover:text-emerald-400 transition-colors"
            >
              占比%<SortIcon field="percentage" />
            </th>
            <th 
              onClick={() => handleSort('comparable')}
              className="px-3 py-3 text-left text-xs font-semibold text-slate-400 uppercase whitespace-nowrap cursor-pointer hover:text-emerald-400 transition-colors"
            >
              可比<SortIcon field="comparable" />
            </th>
            <th 
              onClick={() => handleSort('export_ratio')}
              className="px-3 py-3 text-left text-xs font-semibold text-slate-400 uppercase whitespace-nowrap cursor-pointer hover:text-emerald-400 transition-colors"
            >
              外销占比<SortIcon field="export_ratio" />
            </th>
            <th 
              onClick={() => handleSort('domestic_ratio')}
              className="px-3 py-3 text-left text-xs font-semibold text-slate-400 uppercase whitespace-nowrap cursor-pointer hover:text-emerald-400 transition-colors"
            >
              内销占比<SortIcon field="domestic_ratio" />
            </th>
            <th 
              onClick={() => handleSort('notes')}
              className="px-3 py-3 text-left text-xs font-semibold text-slate-400 uppercase whitespace-nowrap cursor-pointer hover:text-emerald-400 transition-colors"
            >
              备注<SortIcon field="notes" />
            </th>
            <th className="px-4 py-3 text-center text-xs font-semibold text-slate-400 uppercase whitespace-nowrap w-20 sticky right-0 bg-slate-800/80 backdrop-blur-sm border-l border-slate-700">操作</th>
          </tr>
        </thead>
        <tbody className="bg-slate-900/50 divide-y divide-slate-700/50">
          {sortedStocks.map((stock, index) => (
            <tr 
              key={stock.id}
              className={`hover:bg-slate-800/50 transition-colors ${
                highlightedCode && stock.code === highlightedCode 
                  ? 'bg-emerald-500/20 border-l-4 border-emerald-500' 
                  : ''
              }`}
            >
              <td className="px-3 py-3 text-sm text-slate-400 text-center">{index + 1}</td>
              <td className="px-3 py-3 text-sm text-slate-300 font-mono whitespace-nowrap">{stock.code}</td>
              <td className="px-3 py-3 text-sm text-white font-medium whitespace-nowrap">{stock.name}</td>
              <td className="px-3 py-3 text-sm text-slate-400 text-right whitespace-nowrap">{formatNumber(stock.total_shares)}</td>
              <td className="px-3 py-3 text-sm text-slate-400 text-right whitespace-nowrap">{formatNumber(stock.circulating_shares)}</td>
              <td className="px-3 py-3 text-sm text-slate-400 text-right whitespace-nowrap">{formatNumber(stock.restricted_shares)}</td>
              <td className="px-3 py-3 text-sm text-emerald-400 text-right whitespace-nowrap font-medium">{formatNumber(stock.profit)}</td>
              <td className="px-3 py-3">
                <span className="inline-flex px-2 py-1 text-xs font-medium bg-emerald-500/20 text-emerald-400 rounded-md border border-emerald-500/30 whitespace-nowrap">
                  {stock.industry_74 || '-'}
                </span>
              </td>
              <td className="px-3 py-3">
                <span className="inline-flex px-2 py-1 text-xs font-medium bg-blue-500/20 text-blue-400 rounded-md border border-blue-500/30 whitespace-nowrap">
                  {stock.industry_level2 || '-'}
                </span>
              </td>
              <td className="px-3 py-3">
                <span className="inline-flex px-2 py-1 text-xs font-medium bg-purple-500/20 text-purple-400 rounded-md border border-purple-500/30 whitespace-nowrap">
                  {stock.industry_level3 || '-'}
                </span>
              </td>
              <td className="px-3 py-3 text-sm text-slate-400">{stock.concept || '-'}</td>
              <td className="px-3 py-3 text-sm text-slate-400">{stock.product || '-'}</td>
              <td className="px-3 py-3 text-sm text-slate-400">{stock.percentage || '-'}</td>
              <td className="px-3 py-3 text-sm text-slate-400">{stock.comparable || '-'}</td>
              <td className="px-3 py-3 text-sm text-slate-400">{stock.export_ratio || '-'}</td>
              <td className="px-3 py-3 text-sm text-slate-400">{stock.domestic_ratio || '-'}</td>
              <td className="px-3 py-3 text-sm text-slate-400 text-center">
                {stock.notes ? (
                  <button
                    onClick={(e) => handleViewNotes(stock, e)}
                    className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-emerald-500/20 hover:bg-emerald-500/30 transition-colors"
                    title="查看备注"
                  >
                    <Eye className="w-4 h-4 text-emerald-400" />
                  </button>
                ) : null}
              </td>
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

      <Dialog open={notesDialog.open} onOpenChange={(open) => setNotesDialog({ ...notesDialog, open })}>
        <DialogContent className="bg-slate-800 border-slate-700 text-white max-w-2xl">
          <DialogHeader>
            <DialogTitle>{notesDialog.stockName} - 备注</DialogTitle>
          </DialogHeader>
          <div className="mt-4 p-4 bg-slate-900/50 rounded-lg text-slate-300 whitespace-pre-wrap max-h-96 overflow-y-auto">
            {notesDialog.content}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
import React, { useState } from 'react';
import { Search, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { stocksApi } from '@/api/resources/stocks';

export default function StockFormulas() {
  const navigate = useNavigate();
  const [filterMode, setFilterMode] = useState(() => {
    const saved = localStorage.getItem('stockFormulasMode');
    return saved || 'single';
  });
  const [singleFilter, setSingleFilter] = useState(() => {
    const saved = localStorage.getItem('stockFormulasSingle');
    return saved ? JSON.parse(saved) : {
      type: 'current',
      operator: 'gte',
      value: 0
    };
  });
  const [multiFilter, setMultiFilter] = useState(() => {
    const saved = localStorage.getItem('stockFormulasMulti');
    return saved ? JSON.parse(saved) : {
      institutions: [],
      type: 'current',
      operator: 'gte',
      value: 0
    };
  });
  const [results, setResults] = useState(() => {
    const saved = localStorage.getItem('stockFormulasResults');
    return saved ? JSON.parse(saved) : [];
  });
  const [hasSearched, setHasSearched] = useState(() => {
    const saved = localStorage.getItem('stockFormulasHasSearched');
    return saved === 'true';
  });

  const { data: allStocks = [], isLoading } = useQuery({
    queryKey: ['all-stocks-formulas'],
    queryFn: () => stocksApi.list(),
  });

  const handleStockClick = (stock) => {
    navigate(createPageUrl('StockCategories') + `?highlightCode=${stock.code}`);
  };

  const handleClearFilters = () => {
    setSingleFilter({ type: 'current', operator: 'gte', value: 0 });
    setMultiFilter({ institutions: [], type: 'current', operator: 'gte', value: 0 });
    setResults([]);
    setHasSearched(false);
    localStorage.setItem('stockFormulasSingle', JSON.stringify({ type: 'current', operator: 'gte', value: 0 }));
    localStorage.setItem('stockFormulasMulti', JSON.stringify({ institutions: [], type: 'current', operator: 'gte', value: 0 }));
    localStorage.setItem('stockFormulasResults', JSON.stringify([]));
    localStorage.setItem('stockFormulasHasSearched', 'false');
  };

  const institutions = [
    { key: 'beishang', label: '北上', color: 'emerald' },
    { key: 'gongmu', label: '公募', color: 'blue' },
    { key: 'waizi', label: '外资', color: 'purple' },
    { key: 'simu', label: '私募', color: 'orange' },
    { key: 'shebao', label: '社保', color: 'yellow' },
    { key: 'yanglao', label: '养老基金', color: 'pink' },
  ];

  const handleSearch = () => {
    let filtered = [];

    if (filterMode === 'single') {
      if (!singleFilter.value || singleFilter.value <= 0) {
        setResults([]);
        setHasSearched(true);
        localStorage.setItem('stockFormulasResults', JSON.stringify([]));
        localStorage.setItem('stockFormulasHasSearched', 'true');
        return;
      }

      filtered = allStocks.filter(stock => {
        return institutions.some(inst => {
          const fieldName = `${inst.key}_${singleFilter.type}`;
          const value = stock[fieldName] || 0;
          
          if (singleFilter.operator === 'gte') {
            return value >= singleFilter.value;
          } else {
            return value <= singleFilter.value;
          }
        });
      });
    } else {
      if (multiFilter.institutions.length === 0 || !multiFilter.value || multiFilter.value <= 0) {
        setResults([]);
        setHasSearched(true);
        localStorage.setItem('stockFormulasResults', JSON.stringify([]));
        localStorage.setItem('stockFormulasHasSearched', 'true');
        return;
      }

      filtered = allStocks.filter(stock => {
        return multiFilter.institutions.every(instKey => {
          const fieldName = `${instKey}_${multiFilter.type}`;
          const value = stock[fieldName] || 0;
          
          if (multiFilter.operator === 'gte') {
            return value >= multiFilter.value;
          } else {
            return value <= multiFilter.value;
          }
        });
      });
    }

    setResults(filtered);
    setHasSearched(true);
    localStorage.setItem('stockFormulasResults', JSON.stringify(filtered));
    localStorage.setItem('stockFormulasHasSearched', 'true');
  };

  const formatNumber = (num) => {
    if (!num) return '-';
    return Math.round(num).toLocaleString();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white">机构持股筛选</h1>
      </div>

      <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6">
        <h2 className="text-lg font-semibold text-white mb-4">筛选条件</h2>
        
        <Tabs 
          value={filterMode} 
          onValueChange={(value) => {
            setFilterMode(value);
            localStorage.setItem('stockFormulasMode', value);
          }}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-2 mb-6 bg-slate-900/50">
            <TabsTrigger value="single" className="data-[state=active]:bg-emerald-600">
              任意机构满足条件
            </TabsTrigger>
            <TabsTrigger value="multi" className="data-[state=active]:bg-emerald-600">
              多机构同时买入
            </TabsTrigger>
          </TabsList>

          <TabsContent value="single" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">数据类型</label>
                <Select
                  value={singleFilter.type}
                  onValueChange={(value) => {
                    const newFilter = { ...singleFilter, type: value };
                    setSingleFilter(newFilter);
                    localStorage.setItem('stockFormulasSingle', JSON.stringify(newFilter));
                  }}
                >
                  <SelectTrigger className="bg-slate-900/50 border-slate-700 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-700">
                    <SelectItem value="current" className="text-white">总持</SelectItem>
                    <SelectItem value="new" className="text-white">新进</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">比较方式</label>
                <Select
                  value={singleFilter.operator}
                  onValueChange={(value) => {
                    const newFilter = { ...singleFilter, operator: value };
                    setSingleFilter(newFilter);
                    localStorage.setItem('stockFormulasSingle', JSON.stringify(newFilter));
                  }}
                >
                  <SelectTrigger className="bg-slate-900/50 border-slate-700 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-700">
                    <SelectItem value="gte" className="text-white">大于等于</SelectItem>
                    <SelectItem value="lte" className="text-white">小于等于</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">数值（万）</label>
                <Input
                  type="number"
                  placeholder="输入数值"
                  value={singleFilter.value || ''}
                  onChange={(e) => {
                    const newFilter = { ...singleFilter, value: parseFloat(e.target.value) || 0 };
                    setSingleFilter(newFilter);
                    localStorage.setItem('stockFormulasSingle', JSON.stringify(newFilter));
                  }}
                  className="bg-slate-900/50 border-slate-700 text-white"
                />
              </div>
            </div>
            <p className="text-sm text-slate-400">
              筛选出任意机构（北上/公募/外资/私募/社保/养老基金）满足条件的股票
            </p>
          </TabsContent>

          <TabsContent value="multi" className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-3">选择机构（至少2个）</label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {institutions.map((inst) => (
                  <div key={inst.key} className="flex items-center space-x-2">
                    <Checkbox
                      id={`multi-${inst.key}`}
                      checked={multiFilter.institutions.includes(inst.key)}
                      onCheckedChange={(checked) => {
                        const newInstitutions = checked
                          ? [...multiFilter.institutions, inst.key]
                          : multiFilter.institutions.filter(k => k !== inst.key);
                        const newFilter = { ...multiFilter, institutions: newInstitutions };
                        setMultiFilter(newFilter);
                        localStorage.setItem('stockFormulasMulti', JSON.stringify(newFilter));
                      }}
                    />
                    <label htmlFor={`multi-${inst.key}`} className={`text-sm font-medium text-${inst.color}-400 cursor-pointer`}>
                      {inst.label}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">数据类型</label>
                <Select
                  value={multiFilter.type}
                  onValueChange={(value) => {
                    const newFilter = { ...multiFilter, type: value };
                    setMultiFilter(newFilter);
                    localStorage.setItem('stockFormulasMulti', JSON.stringify(newFilter));
                  }}
                >
                  <SelectTrigger className="bg-slate-900/50 border-slate-700 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-700">
                    <SelectItem value="current" className="text-white">总持</SelectItem>
                    <SelectItem value="new" className="text-white">新进</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">比较方式</label>
                <Select
                  value={multiFilter.operator}
                  onValueChange={(value) => {
                    const newFilter = { ...multiFilter, operator: value };
                    setMultiFilter(newFilter);
                    localStorage.setItem('stockFormulasMulti', JSON.stringify(newFilter));
                  }}
                >
                  <SelectTrigger className="bg-slate-900/50 border-slate-700 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-700">
                    <SelectItem value="gte" className="text-white">大于等于</SelectItem>
                    <SelectItem value="lte" className="text-white">小于等于</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">数值（万）</label>
                <Input
                  type="number"
                  placeholder="输入数值"
                  value={multiFilter.value || ''}
                  onChange={(e) => {
                    const newFilter = { ...multiFilter, value: parseFloat(e.target.value) || 0 };
                    setMultiFilter(newFilter);
                    localStorage.setItem('stockFormulasMulti', JSON.stringify(newFilter));
                  }}
                  className="bg-slate-900/50 border-slate-700 text-white"
                />
              </div>
            </div>
            <p className="text-sm text-slate-400">
              筛选出所有选定机构同时买入且都满足条件的股票
            </p>
          </TabsContent>
        </Tabs>

        <div className="mt-6 flex gap-3">
          <Button
            onClick={handleSearch}
            disabled={isLoading}
            className="bg-emerald-600 hover:bg-emerald-700"
          >
            <Search className="w-4 h-4 mr-2" />
            {isLoading ? '加载中...' : '筛选股票'}
          </Button>
          <Button
            onClick={handleClearFilters}
            variant="outline"
            className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            清空条件
          </Button>
        </div>
      </div>

      {hasSearched && (
        <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6">
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-white">
              筛选结果 ({results.length} 只股票)
            </h2>
          </div>
          {results.length > 0 ? (
            <div className="overflow-x-auto rounded-xl border border-slate-700/50">
              <table className="w-full">
                <thead className="bg-slate-900/80">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase">序</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase">代码</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase">股票名称</th>
                    {filterMode === 'single' ? (
                      institutions.map(inst => (
                        <th key={inst.key} className={`px-4 py-3 text-right text-xs font-semibold text-${inst.color}-400 uppercase`}>
                          {inst.label}{singleFilter.type === 'current' ? '总持' : '新进'}
                        </th>
                      ))
                    ) : (
                      multiFilter.institutions.map(instKey => {
                        const inst = institutions.find(i => i.key === instKey);
                        return (
                          <th key={instKey} className={`px-4 py-3 text-right text-xs font-semibold text-${inst.color}-400 uppercase`}>
                            {inst.label}{multiFilter.type === 'current' ? '总持' : '新进'}
                          </th>
                        );
                      })
                    )}
                  </tr>
                </thead>
                <tbody className="bg-slate-900/50 divide-y divide-slate-700/50">
                  {results.map((stock, index) => (
                    <tr 
                      key={stock.id} 
                      onClick={() => handleStockClick(stock)}
                      className="hover:bg-slate-800/50 transition-colors cursor-pointer"
                    >
                      <td className="px-4 py-3 text-sm text-slate-400">{index + 1}</td>
                      <td className="px-4 py-3 text-sm text-slate-300 font-mono">{stock.code}</td>
                      <td className="px-4 py-3 text-sm text-white font-medium">{stock.name}</td>
                      {filterMode === 'single' ? (
                        institutions.map(inst => (
                          <td key={inst.key} className={`px-4 py-3 text-sm text-${inst.color}-400 text-right font-medium`}>
                            {formatNumber(stock[`${inst.key}_${singleFilter.type}`])}
                          </td>
                        ))
                      ) : (
                        multiFilter.institutions.map(instKey => {
                          const inst = institutions.find(i => i.key === instKey);
                          return (
                            <td key={instKey} className={`px-4 py-3 text-sm text-${inst.color}-400 text-right font-medium`}>
                              {formatNumber(stock[`${instKey}_${multiFilter.type}`])}
                            </td>
                          );
                        })
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12 text-slate-400">
              {filterMode === 'single' 
                ? '没有符合条件的股票' 
                : (multiFilter.institutions.length === 0 
                    ? '请至少选择2个机构类型' 
                    : '没有符合条件的股票')}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
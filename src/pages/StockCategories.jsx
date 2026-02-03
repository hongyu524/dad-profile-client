import React, { useState, useMemo, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Search, Plus } from 'lucide-react';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import StockCard from '../components/stock/StockCard';
import StockTable from '../components/stock/StockTable';
import StockForm from '../components/stock/StockForm';
import StockProfitForm from '../components/stock/StockProfitForm';
import StockInstitutionForm from '../components/stock/StockInstitutionForm';
import StockProfitCard from '../components/stock/StockProfitCard';
import StockProfitTable from '../components/stock/StockProfitTable';
import StockInstitutionCard from '../components/stock/StockInstitutionCard';
import StockInstitutionTable from '../components/stock/StockInstitutionTable';
import IndustryCombobox from '../components/stock/IndustryCombobox';
import IndustryManager from '../components/industry/IndustryManager';
import { Settings } from 'lucide-react';
import { stocksApi } from '@/api/resources/stocks';
import { normalizeIndustry } from '@/lib/normalize';

export default function StockCategories() {
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState(2026);
  const [selectedIndustry, setSelectedIndustry] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingStock, setEditingStock] = useState(null);
  const [currentTab, setCurrentTab] = useState('categories');
  const [highlightedCode, setHighlightedCode] = useState(null);
  const [showIndustryManager, setShowIndustryManager] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  
  const queryClient = useQueryClient();

  const getIndustryLabel = (stock) => {
    return normalizeIndustry(stock?.industry_level1 ?? stock?.industry_74);
  };

  // 监听localStorage变化
  useEffect(() => {
    const handleStorageChange = () => {
      setRefreshKey(prev => prev + 1);
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const { data: allYearStocks = [], isLoading } = useQuery({
    queryKey: ['all-year-stocks'],
    queryFn: async () => {
      const data = await stocksApi.list();
      console.log("[StockCategories] RAW API RESPONSE", data);
      if (Array.isArray(data)) return data;
      return Array.isArray(data?.items) ? data.items : [];
    },
  });

  // 从URL参数读取行业筛选和年份
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const industryParam = urlParams.get('industry');
    const yearParam = urlParams.get('year');
    const highlightCodeParam = urlParams.get('highlightCode');
    
    if (industryParam) {
      setSelectedIndustry(industryParam);
    }
    if (yearParam) {
      const year = parseInt(yearParam);
      if (year >= 2026 && year <= 2036) {
        setSelectedYear(year);
      }
    }
    if (highlightCodeParam) {
      setHighlightedCode(highlightCodeParam);
      setSearchQuery(highlightCodeParam);
      // 清除URL参数并保持高亮3秒
      window.history.replaceState({}, '', window.location.pathname);
      setTimeout(() => {
        setHighlightedCode(null);
      }, 3000);
    }
  }, [allYearStocks]);

  // 获取当前年份的股票数据，如果没有则使用最近年份的数据
  const stocks = React.useMemo(() => {
    if (!allYearStocks.length) return [];
    
    // 按股票代码分组
    const stocksByCode = {};
    allYearStocks.forEach(stock => {
      const code = stock.code;
      if (!stocksByCode[code]) {
        stocksByCode[code] = [];
      }
      stocksByCode[code].push(stock);
    });
    
    // 对于每个股票代码，找到最接近且不超过选定年份的数据
    const result = [];
    Object.keys(stocksByCode).forEach(code => {
      const stockVersions = stocksByCode[code];
      // 找到年份 <= selectedYear 的最大年份
      const validVersions = stockVersions.filter(s => s.year <= selectedYear);
      if (validVersions.length > 0) {
        // 选择年份最大的那个
        const latestVersion = validVersions.reduce((prev, current) => 
          (current.year > prev.year) ? current : prev
        );
        result.push({
          ...latestVersion,
          _isInherited: latestVersion.year < selectedYear,
          _originalYear: latestVersion.year
        });
      }
    });
    
    return result;
  }, [allYearStocks, selectedYear]);

  const availableYears = useMemo(() => {
    const years = [...new Set(allYearStocks.map(s => Number(s.year)).filter(Number.isFinite))].filter(y => y >= 2026);
    // 确保当前选择的年份也在列表中
    if (!years.includes(selectedYear)) {
      years.push(selectedYear);
    }
    // 生成完整年份范围：从2026年到2036年
    for (let year = 2026; year <= 2036; year++) {
      if (!years.includes(year)) {
        years.push(year);
      }
    }
    return years.sort((a, b) => b - a);
  }, [allYearStocks, selectedYear]);

  const updateStockMutation = useMutation({
    mutationFn: ({ id, data }) => stocksApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['all-year-stocks'] });
      toast.success('保存成功');
    },
  });

  const createStockMutation = useMutation({
    mutationFn: (data) => stocksApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['all-year-stocks'] });
      setShowForm(false);
      setEditingStock(null);
      toast.success('添加成功');
    },
  });

  // 获取所有行业分类（包括自定义行业）
  const industries = useMemo(() => {
    const customIndustries = JSON.parse(localStorage.getItem('customIndustries') || '[]');
    const stockIndustries = stocks.map(getIndustryLabel).filter(Boolean);
    const allIndustries = [...new Set([...stockIndustries, ...customIndustries])].sort();
    
    return allIndustries.map(industry => ({
      name: industry,
      count: stocks.filter(s => getIndustryLabel(s) === industry).length
    }));
  }, [stocks, refreshKey]);

  // 过滤股票
  const filteredStocks = useMemo(() => {
    let filtered = stocks;

    // 行业筛选
    if (selectedIndustry !== 'all') {
      filtered = filtered.filter(s => getIndustryLabel(s) === selectedIndustry);
    }

    // 搜索筛选
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(s => 
        s.name?.toLowerCase().includes(query) || 
        s.code?.toLowerCase().includes(query) ||
        s.industry_74?.toLowerCase().includes(query) ||
        s.industry_level2?.toLowerCase().includes(query) ||
        s.industry_level3?.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [stocks, selectedIndustry, searchQuery]);

  // 过滤利润数据（使用同样的股票数据）
  const filteredProfits = useMemo(() => {
    let filtered = stocks;

    // 行业筛选
    if (selectedIndustry !== 'all') {
      filtered = filtered.filter(s => getIndustryLabel(s) === selectedIndustry);
    }

    // 搜索筛选
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(s => 
        s.name?.toLowerCase().includes(query) || 
        s.code?.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [stocks, selectedIndustry, searchQuery]);

  // 过滤机构数据（使用同样的股票数据）
  const filteredInstitutions = useMemo(() => {
    let filtered = stocks;

    // 行业筛选
    if (selectedIndustry !== 'all') {
      filtered = filtered.filter(s => getIndustryLabel(s) === selectedIndustry);
    }

    // 搜索筛选
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(s => 
        s.name?.toLowerCase().includes(query) || 
        s.code?.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [stocks, selectedIndustry, searchQuery]);



  const handleStockSubmit = async (data) => {
    // 检查名称是否改变
    const nameChanged = editingStock && editingStock.name !== data.name;
    
    if (editingStock) {
      // 如果是继承的数据（年份不同），创建新记录而不是更新
      if (editingStock._isInherited) {
        createStockMutation.mutate({ ...data, year: selectedYear });
      } else {
        updateStockMutation.mutate({ id: editingStock.id, data });
        setShowForm(false);
        setEditingStock(null);
      }
      
      // 如果名称改变了，更新所有相同代码的股票记录的名称
      if (nameChanged && data.code) {
        const sameCodeStocks = allYearStocks.filter(s => s.code === data.code && s.id !== editingStock.id);
        for (const stock of sameCodeStocks) {
          await stocksApi.update(stock.id, { name: data.name });
        }
        queryClient.invalidateQueries({ queryKey: ['all-year-stocks'] });
        toast.success('已同步更新所有年份的股票名称');
      }
    } else {
      createStockMutation.mutate(data);
    }
  };

  // 获取所有已存在的一级行业
  const existingIndustries = useMemo(() => {
    return [...new Set(allYearStocks.map(s => s.industry_74).filter(Boolean))].sort();
  }, [allYearStocks]);

  const handleStockEdit = (stock) => {
    setEditingStock(stock);
    setShowForm(true);
  };

  const handleAddNew = () => {
    setEditingStock(null);
    setShowForm(true);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-slate-400">加载中...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h1 className="text-3xl font-bold text-white">股票数据管理</h1>
          <div className="flex items-center gap-2">
            <Select value={selectedYear.toString()} onValueChange={(value) => setSelectedYear(parseInt(value))}>
              <SelectTrigger className="w-32 bg-slate-900/50 border-slate-700 text-white">
                <SelectValue>{selectedYear}年</SelectValue>
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-700 max-h-60">
                {availableYears.map((year) => (
                  <SelectItem key={year} value={year.toString()} className="text-white text-center py-3">
                    {year}年
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              type="text"
              placeholder="输入年份按回车"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  const year = parseInt(e.target.value);
                  if (year >= 2026 && year <= 2036) {
                    setSelectedYear(year);
                    e.target.value = '';
                    e.target.blur();
                  }
                }
              }}
              className="w-36 bg-slate-900/50 border-slate-700 text-white placeholder:text-slate-500"
            />
          </div>
        </div>
      </div>

      {showForm && currentTab === 'categories' && (
        <StockForm
          stock={editingStock}
          defaultYear={selectedYear}
          existingIndustries={existingIndustries}
          onSubmit={handleStockSubmit}
          onCancel={() => {
            setShowForm(false);
            setEditingStock(null);
          }}
        />
      )}
      {showForm && currentTab === 'profits' && (
        <StockProfitForm
          stock={editingStock}
          defaultYear={selectedYear}
          onSubmit={handleStockSubmit}
          onCancel={() => {
            setShowForm(false);
            setEditingStock(null);
          }}
        />
      )}
      {showForm && currentTab === 'institutions' && (
        <StockInstitutionForm
          stock={editingStock}
          defaultYear={selectedYear}
          onSubmit={handleStockSubmit}
          onCancel={() => {
            setShowForm(false);
            setEditingStock(null);
          }}
        />
      )}

      {/* 搜索区域 */}
      <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
          <Input
            placeholder="搜索股票代码或名称..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-slate-900/50 border-slate-700 text-white"
          />
        </div>
      </div>

      <Tabs defaultValue="categories" className="space-y-6" onValueChange={setCurrentTab}>
        <TabsList className="bg-slate-800/50 border border-slate-700/50">
          <TabsTrigger value="categories" className="data-[state=active]:bg-emerald-600">
            股票分类
          </TabsTrigger>
          <TabsTrigger value="profits" className="data-[state=active]:bg-emerald-600">
            股票利润
          </TabsTrigger>
          <TabsTrigger value="institutions" className="data-[state=active]:bg-emerald-600">
            机构增减
          </TabsTrigger>
        </TabsList>

        <TabsContent value="categories" className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h2 className="text-xl font-semibold text-white">股票分类</h2>
              <IndustryCombobox
                value={selectedIndustry}
                onChange={setSelectedIndustry}
                industries={industries}
                totalCount={stocks.length}
              />
              <Button
                onClick={() => setShowIndustryManager(true)}
                variant="outline"
                size="sm"
                className="border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white"
              >
                <Settings className="w-4 h-4 mr-2" />
                管理行业
              </Button>
            </div>
            <Button
              onClick={handleAddNew}
              className="bg-emerald-600 hover:bg-emerald-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              添加股票
            </Button>
          </div>

          <div className="text-sm text-slate-400">
            {selectedIndustry !== 'all' && (
              <span>当前分类: <span className="text-emerald-400 font-medium">{selectedIndustry}</span> - </span>
            )}
            共 <span className="text-white font-medium">{filteredStocks.length}</span> 只股票
          </div>

          <StockTable 
            stocks={filteredStocks}
            onStockEdit={handleStockEdit}
            highlightedCode={highlightedCode}
          />

          {filteredStocks.length === 0 && (
            <div className="text-center py-12 text-slate-400">
              没有找到匹配的股票
            </div>
          )}
        </TabsContent>

        <TabsContent value="profits" className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h2 className="text-xl font-semibold text-white">股票利润</h2>
              <IndustryCombobox
                value={selectedIndustry}
                onChange={setSelectedIndustry}
                industries={industries}
                totalCount={stocks.length}
              />
            </div>
          </div>

          <div className="text-sm text-slate-400">
            {selectedIndustry !== 'all' && (
              <span>当前分类: <span className="text-emerald-400 font-medium">{selectedIndustry}</span> - </span>
            )}
            共 <span className="text-white font-medium">{filteredProfits.length}</span> 只股票
          </div>

          <StockProfitTable 
            stocks={filteredProfits}
            onStockEdit={handleStockEdit}
          />

          {filteredProfits.length === 0 && (
            <div className="text-center py-12 text-slate-400">
              没有找到匹配的股票
            </div>
          )}
        </TabsContent>

        <TabsContent value="institutions" className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h2 className="text-xl font-semibold text-white">机构增减</h2>
              <IndustryCombobox
                value={selectedIndustry}
                onChange={setSelectedIndustry}
                industries={industries}
                totalCount={stocks.length}
              />
            </div>
          </div>

          <div className="text-sm text-slate-400">
            {selectedIndustry !== 'all' && (
              <span>当前分类: <span className="text-emerald-400 font-medium">{selectedIndustry}</span> - </span>
            )}
            共 <span className="text-white font-medium">{filteredInstitutions.length}</span> 只股票
          </div>

          <StockInstitutionTable 
            stocks={filteredInstitutions}
            onStockEdit={handleStockEdit}
          />

          {filteredInstitutions.length === 0 && (
            <div className="text-center py-12 text-slate-400">
              没有找到匹配的股票
            </div>
          )}
        </TabsContent>
      </Tabs>

      <IndustryManager
        open={showIndustryManager}
        onClose={() => setShowIndustryManager(false)}
        industries={stocks.map(getIndustryLabel).filter(Boolean)}
        onRefresh={() => queryClient.invalidateQueries({ queryKey: ['all-year-stocks'] })}
      />
      </div>
      );
      }
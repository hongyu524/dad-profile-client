import React, { useState, useEffect, useCallback } from 'react';
import { TrendingUp, TrendingDown, Activity, BarChart3, ChevronRight, Settings } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '../utils';
import IndustryManager from '../components/industry/IndustryManager';
import { apiClient, getApiClientDiagnostics } from '@/lib/apiClient';
import { cleanNum, normalizeIndustry, isValidLabel } from '@/lib/normalize';

export default function MarketOverview() {
  const navigate = useNavigate();
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState(2026);
  const [showIndustryManager, setShowIndustryManager] = useState(false);
  const debugEnabled = (typeof import.meta !== 'undefined' && import.meta.env?.DEV) ||
    new URLSearchParams(window.location.search).get("debug") === "1";
  console.log("[MarketOverview] render", { selectedYear });
  const [stocksData, setStocksData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [fetchError, setFetchError] = useState(null);
  const [configDiag, setConfigDiag] = useState({
    status: 'pending',
    apiBaseUrl: '',
    fetchStatus: null,
    error: null,
    source: null,
    envBaseUrl: (typeof import.meta !== 'undefined' ? import.meta.env?.VITE_API_BASE_URL : undefined) || '',
  });
  const [stocksRawDiag, setStocksRawDiag] = useState(null);

  useEffect(() => {
    const checkConfig = async () => {
      try {
        const baseUrl = (typeof import.meta !== 'undefined' ? import.meta.env?.BASE_URL : process.env?.BASE_URL) || '/';
        const normalizedBase = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`;
        const configUrl = `${normalizedBase}config.json`;
        const res = await fetch(configUrl, { cache: 'no-cache' });
        const body = res.ok ? await res.json() : null;
        setConfigDiag({
          status: res.ok ? 'ok' : 'error',
          apiBaseUrl: body?.apiBaseUrl || '',
          fetchStatus: res.status,
          error: res.ok ? null : new Error(`status ${res.status}`),
          source: res.ok ? 'config.json' : null,
          envBaseUrl: (typeof import.meta !== 'undefined' ? import.meta.env?.VITE_API_BASE_URL : undefined) || '',
          configUrl,
        });
        console.info('[MarketOverview] config check', { status: res.status, apiBaseUrl: body?.apiBaseUrl, configUrl });
      } catch (err) {
        setConfigDiag({
          status: 'error',
          apiBaseUrl: '',
          fetchStatus: null,
          error: err,
          source: null,
          envBaseUrl: (typeof import.meta !== 'undefined' ? import.meta.env?.VITE_API_BASE_URL : undefined) || '',
          configUrl: null,
        });
        console.error('[MarketOverview] config fetch error', err);
      }
    };
    checkConfig();
  }, []);

  const fetchStocks = useCallback(() => {
    console.log("[MarketOverview] useEffect firing", selectedYear);
    console.log("[MarketOverview] fetching stocks", selectedYear);
    setIsLoading(true);
    setFetchError(null);
    const path = selectedYear ? `/stocks?year=${encodeURIComponent(selectedYear)}` : '/stocks';
    apiClient.get(path)
      .then((data) => {
        console.log("[MarketOverview] RAW API RESPONSE", data);
        setStocksRawDiag(data);
        const items = Array.isArray(data) ? data : (Array.isArray(data?.items) ? data.items : []);
        console.info("[MarketOverview] stocks loaded", items.length, data);
        setStocksData(items);
      })
      .catch(err => {
        console.error("[MarketOverview] fetch error", err);
        setFetchError(err);
      })
      .finally(() => setIsLoading(false));
  }, [selectedYear]);

  useEffect(() => {
    fetchStocks();
  }, [fetchStocks]);

  // 获取当前年份的股票数据，如果没有则使用最近年份的数据
  const stocks = React.useMemo(() => {
    if (!stocksData.length) return [];
    
    // 按股票代码分组
    const stocksByCode = {};
    stocksData.forEach(stock => {
      const code = stock.code;
      const stockYear = Number(stock.year);
      if (!Number.isFinite(stockYear)) return;
      if (!stocksByCode[code]) {
        stocksByCode[code] = [];
      }
      stocksByCode[code].push({ ...stock, year: stockYear });
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
        result.push(latestVersion);
      }
    });
    
    return result;
  }, [stocksData, selectedYear]);

  const availableYears = React.useMemo(() => {
    const years = [...new Set(stocksData.map(s => Number(s.year)).filter(Number.isFinite))].filter(y => y >= 2026);
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
  }, [stocksData, selectedYear]);

  // 计算市场统计数据
  const marketStats = React.useMemo(() => {
    if (!stocks.length) return null;
    
    const totalStocks = stocks.length;
    const industryLabels = stocks
      .map(s => normalizeIndustry(s.industry_level1 ?? s.industry_74))
      .filter(isValidLabel);
    const industryCount = new Set(industryLabels).size;
    const hasUncategorized = stocks.some(s => !isValidLabel(s.industry_level1 ?? s.industry_74));
    const industries = industryCount + (hasUncategorized ? 1 : 0);

    const totalMarketCap = stocks.reduce((sum, s) => sum + cleanNum(s.totalShares ?? s.total_shares ?? s.totalSharesCn), 0);
    const circulatingShares = stocks.reduce((sum, s) => sum + cleanNum(s.floatShares ?? s.circulating_shares ?? s.floatSharesCn), 0);

    return {
      totalStocks,
      industries,
      totalMarketCap,
      circulatingShares
    };
  }, [stocks]);

  // 行业统计 - 所有行业
  const industryStats = React.useMemo(() => {
    if (!stocks.length) return [];
    
    const stats = {};
    stocks.forEach(stock => {
      const label = normalizeIndustry(stock.industry_level1 ?? stock.industry_74);
      const industry = isValidLabel(label) ? label : '未分类';
      if (!stats[industry]) {
        stats[industry] = { count: 0, totalShares: 0 };
      }
      stats[industry].count++;
      stats[industry].totalShares += cleanNum(stock.totalShares ?? stock.total_shares ?? stock.totalSharesCn);
    });
    
    return Object.entries(stats)
      .map(([industry, data]) => ({ industry, ...data }))
      .sort((a, b) => b.count - a.count);
  }, [stocks]);

  const handleIndustryClick = (industry) => {
    navigate(createPageUrl('StockCategories') + `?industry=${encodeURIComponent(industry)}&year=${selectedYear}`);
  };

  const formatNumber = (num) => {
    const n = cleanNum(num);
    if (n >= 100000000) return (n / 100000000).toFixed(2) + '亿';
    if (n >= 10000) return (n / 10000).toFixed(2) + '万';
    return Math.round(n).toLocaleString();
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
      {debugEnabled && (
        <div className="rounded border border-slate-700/60 bg-slate-900/50 p-3 text-xs text-slate-300 space-y-1">
          <div>config.json status: {configDiag.status}{configDiag.fetchStatus ? ` (${configDiag.fetchStatus})` : ''}</div>
          <div>apiBaseUrl: {configDiag.apiBaseUrl || 'MISSING'} (env fallback: {configDiag.envBaseUrl ? 'present' : 'none'})</div>
          <div>apiClient source: {getApiClientDiagnostics().configSource || 'n/a'}</div>
          <div>apiClient base: {getApiClientDiagnostics().apiBaseUrl || 'n/a'}</div>
          {configDiag.configUrl && <div>configUrl: {configDiag.configUrl}</div>}
          {configDiag.error && <div className="text-amber-400">config error: {configDiag.error.message}</div>}
          {fetchError && <div className="text-amber-400">stocks error: {fetchError.message}</div>}
          <div className="text-slate-500">debug: GET /stocks?year={selectedYear}</div>
          {stocksRawDiag && (
            <pre className="max-h-32 overflow-auto bg-slate-800/60 p-2 rounded text-[11px] text-slate-200">
              {JSON.stringify(stocksRawDiag, null, 2)}
            </pre>
          )}
          {stocksData && (
            <pre className="max-h-32 overflow-auto bg-slate-800/60 p-2 rounded text-[11px] text-slate-200">
              {JSON.stringify(stocksData.slice(0, 5), null, 2)}
            </pre>
          )}
        </div>
      )}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h1 className="text-3xl font-bold text-white">市场总览</h1>
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
        <Button
          onClick={() => setShowIndustryManager(true)}
          variant="outline"
          className="border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white"
        >
          <Settings className="w-4 h-4 mr-2" />
          管理行业
        </Button>
      </div>

      {/* 市场统计卡片 */}
      {marketStats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-gradient-to-br from-emerald-500/10 to-emerald-600/10 border-emerald-500/30">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400 mb-1">股票总数</p>
                  <p className="text-3xl font-bold text-white">{marketStats.totalStocks}</p>
                </div>
                <div className="w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center">
                  <BarChart3 className="w-6 h-6 text-emerald-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-500/10 to-blue-600/10 border-blue-500/30">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400 mb-1">行业数量</p>
                  <p className="text-3xl font-bold text-white">{marketStats.industries}</p>
                </div>
                <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
                  <Activity className="w-6 h-6 text-blue-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500/10 to-purple-600/10 border-purple-500/30">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400 mb-1">总股本</p>
                  <p className="text-3xl font-bold text-white">{formatNumber(marketStats.totalMarketCap)}</p>
                </div>
                <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-purple-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-500/10 to-orange-600/10 border-orange-500/30">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400 mb-1">流通股总计</p>
                  <p className="text-3xl font-bold text-white">{formatNumber(marketStats.circulatingShares)}</p>
                </div>
                <div className="w-12 h-12 bg-orange-500/20 rounded-xl flex items-center justify-center">
                  <TrendingDown className="w-6 h-6 text-orange-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* 行业分布 */}
      <Card className="bg-slate-800/50 border-slate-700/50">
        <CardHeader>
          <CardTitle className="text-white">行业分布（共 {industryStats.length} 个行业）</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {industryStats.map((stat) => (
              <button
                key={stat.industry}
                onClick={() => handleIndustryClick(stat.industry)}
                className="flex items-center justify-between p-3 bg-slate-900/50 rounded-lg hover:bg-slate-900/70 hover:border-emerald-500/30 border border-transparent transition-all text-left group"
              >
                <div className="flex-1">
                  <p className="text-white font-medium group-hover:text-emerald-400 transition-colors">
                    {stat.industry}
                  </p>
                  <p className="text-sm text-slate-400">{stat.count} 只股票</p>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-600 group-hover:text-emerald-400 transition-colors" />
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      <IndustryManager
        open={showIndustryManager}
        onClose={() => setShowIndustryManager(false)}
        industries={stocks.map(s => s.industry_74).filter(Boolean)}
        onRefresh={() => fetchStocks()}
      />
    </div>
  );
}
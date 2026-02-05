import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Search, Sparkles, RefreshCw, AlertTriangle, ExternalLink, TrendingUp, Shield } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { format } from 'date-fns';
import IndustryCombobox from '../components/stock/IndustryCombobox';
import { stocksApi } from '@/api/resources/stocks';
import { aiApi } from '@/api/resources/ai';

function InstitutionalAnalysisTab({ selectedStock, onGenerate, generating }) {
  const [analysis, setAnalysis] = useState(null);

  const handleGenerate = async () => {
    const result = await onGenerate();
    setAnalysis(result);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-center">
        <Button onClick={handleGenerate} disabled={generating}>
          {generating ? (
            <>
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              分析中...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 mr-2" />
              生成机构解读
            </>
          )}
        </Button>
      </div>

      {analysis && (
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="w-5 h-5 mr-2 text-emerald-400" />
              机构观点与持仓分析
            </CardTitle>
          </CardHeader>
          <CardContent className="text-slate-300 whitespace-pre-wrap">
            {analysis}
          </CardContent>
        </Card>
      )}

      {selectedStock && !analysis && (
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="py-8">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
              <div>
                <p className="text-slate-500 mb-1">北上资金</p>
                <div className="space-y-1">
                  <p className="text-emerald-400">新进: {selectedStock.beishang_new || 0}万</p>
                  <p className="text-blue-400">增持: {selectedStock.beishang_increase || 0}万</p>
                  <p className="text-red-400">减持: {selectedStock.beishang_decrease || 0}万</p>
                </div>
              </div>
              <div>
                <p className="text-slate-500 mb-1">公募基金</p>
                <div className="space-y-1">
                  <p className="text-emerald-400">新进: {selectedStock.gongmu_new || 0}万</p>
                  <p className="text-blue-400">增持: {selectedStock.gongmu_increase || 0}万</p>
                  <p className="text-red-400">减持: {selectedStock.gongmu_decrease || 0}万</p>
                </div>
              </div>
              <div>
                <p className="text-slate-500 mb-1">外资</p>
                <div className="space-y-1">
                  <p className="text-emerald-400">新进: {selectedStock.waizi_new || 0}万</p>
                  <p className="text-blue-400">增持: {selectedStock.waizi_increase || 0}万</p>
                  <p className="text-red-400">减持: {selectedStock.waizi_decrease || 0}万</p>
                </div>
              </div>
              <div>
                <p className="text-slate-500 mb-1">私募</p>
                <div className="space-y-1">
                  <p className="text-emerald-400">新进: {selectedStock.simu_new || 0}万</p>
                  <p className="text-blue-400">增持: {selectedStock.simu_increase || 0}万</p>
                  <p className="text-red-400">减持: {selectedStock.simu_decrease || 0}万</p>
                </div>
              </div>
              <div>
                <p className="text-slate-500 mb-1">社保</p>
                <div className="space-y-1">
                  <p className="text-emerald-400">新进: {selectedStock.shebao_new || 0}万</p>
                  <p className="text-blue-400">增持: {selectedStock.shebao_increase || 0}万</p>
                  <p className="text-red-400">减持: {selectedStock.shebao_decrease || 0}万</p>
                </div>
              </div>
              <div>
                <p className="text-slate-500 mb-1">养老基金</p>
                <div className="space-y-1">
                  <p className="text-emerald-400">新进: {selectedStock.yanglao_new || 0}万</p>
                  <p className="text-blue-400">增持: {selectedStock.yanglao_increase || 0}万</p>
                  <p className="text-red-400">减持: {selectedStock.yanglao_decrease || 0}万</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function RiskRadarTab({ selectedStock, onGenerate, generating }) {
  const [analysis, setAnalysis] = useState(null);

  const handleGenerate = async () => {
    const result = await onGenerate();
    setAnalysis(result);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-center">
        <Button onClick={handleGenerate} disabled={generating}>
          {generating ? (
            <>
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              扫描中...
            </>
          ) : (
            <>
              <Shield className="w-4 h-4 mr-2" />
              启动风险扫描
            </>
          )}
        </Button>
      </div>

      {analysis && (
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="flex items-center text-orange-400">
              <AlertTriangle className="w-5 h-5 mr-2" />
              风险雷达扫描结果
            </CardTitle>
          </CardHeader>
          <CardContent className="text-slate-300 whitespace-pre-wrap">
            {analysis}
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function FundamentalsTab({ selectedStock, onGenerate, generating }) {
  const [analysis, setAnalysis] = useState(null);

  const handleGenerate = async () => {
    const result = await onGenerate();
    setAnalysis(result);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-center">
        <Button onClick={handleGenerate} disabled={generating}>
          {generating ? (
            <>
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              分析中...
            </>
          ) : (
            <>
              <TrendingUp className="w-4 h-4 mr-2" />
              生成基本面分析
            </>
          )}
        </Button>
      </div>

      {analysis && (
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="flex items-center text-blue-400">
              <TrendingUp className="w-5 h-5 mr-2" />
              基本面趋势分析
            </CardTitle>
          </CardHeader>
          <CardContent className="text-slate-300 whitespace-pre-wrap">
            {analysis}
          </CardContent>
        </Card>
      )}

      {selectedStock && !analysis && (
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="py-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <p className="text-slate-500 mb-1">一季报</p>
                <p className="text-white">{selectedStock.q1_report || '-'}</p>
              </div>
              <div>
                <p className="text-slate-500 mb-1">二季报</p>
                <p className="text-white">{selectedStock.q2_report || '-'}</p>
              </div>
              <div>
                <p className="text-slate-500 mb-1">三季报</p>
                <p className="text-white">{selectedStock.q3_report || '-'}</p>
              </div>
              <div>
                <p className="text-slate-500 mb-1">年报</p>
                <p className="text-white">{selectedStock.annual_report || '-'}</p>
              </div>
              <div>
                <p className="text-slate-500 mb-1">毛利率</p>
                <p className="text-white">{selectedStock.gross_margin || '-'}</p>
              </div>
              <div>
                <p className="text-slate-500 mb-1">净利润增长</p>
                <p className="text-white">{selectedStock.profit_growth || '-'}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export default function AIAnalysis() {
  const [selectedStock, setSelectedStock] = useState(null);
  const [selectedIndustry, setSelectedIndustry] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [generatingAnalysis, setGeneratingAnalysis] = useState(false);
  const [generatingSummary, setGeneratingSummary] = useState(null);
  const [followUpQuestions, setFollowUpQuestions] = useState([]);
  const [generatingFollowUp, setGeneratingFollowUp] = useState(false);
  const [comparingPeers, setComparingPeers] = useState(false);
  const [analysisByStock, setAnalysisByStock] = useState({});
  const [profileByStock, setProfileByStock] = useState({});
  const [newsByStock, setNewsByStock] = useState({});

  const { data: stocks = [] } = useQuery({
    queryKey: ['stocks'],
    queryFn: () => stocksApi.list(),
  });

  const industries = useMemo(() => {
    const unique = [...new Set(stocks.map(s => s.industry_74))].filter(Boolean).sort();
    return unique.map(industry => ({
      name: industry,
      count: stocks.filter(s => s.industry_74 === industry).length
    }));
  }, [stocks]);

  const filteredStocks = useMemo(() => {
    let filtered = stocks;
    if (selectedIndustry !== 'all') {
      filtered = filtered.filter(s => s.industry_74 === selectedIndustry);
    }
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(s => 
        s.name?.toLowerCase().includes(query) || 
        s.code?.toLowerCase().includes(query)
      );
    }
    return filtered;
  }, [stocks, selectedIndustry, searchQuery]);

  const currentAnalysis = useMemo(() => {
    if (!selectedStock) return null;
    return analysisByStock[selectedStock.id] || null;
  }, [analysisByStock, selectedStock]);

  const currentProfile = useMemo(() => {
    if (!selectedStock) return null;
    return profileByStock[selectedStock.id] || null;
  }, [profileByStock, selectedStock]);

  const currentNews = useMemo(() => {
    if (!selectedStock) return [];
    const items = newsByStock[selectedStock.id] || [];
    return [...items].sort((a, b) => new Date(b.published_at) - new Date(a.published_at)).slice(0, 30);
  }, [newsByStock, selectedStock]);

  const generateAnalysis = async () => {
    if (!selectedStock) return;
    
    setGeneratingAnalysis(true);
    try {
      const prompt = `分析股票 ${selectedStock.code} ${selectedStock.name}，一级行业：${selectedStock.industry_74}。

机构数据：北上资金新进${selectedStock.beishang_new}万、增持${selectedStock.beishang_increase}万、减持${selectedStock.beishang_decrease}万
公募基金新进${selectedStock.gongmu_new}万、增持${selectedStock.gongmu_increase}万、减持${selectedStock.gongmu_decrease}万

请提供以下分析：
1. 一句话白话总结（20-30字，说人话，让普通人能看懂）
2. AI综合判断立场（偏积极/中性/偏谨慎）和信心度（低/中/高）
3. 分析基于的数据时间范围（如"基于最近30天公告与资金数据"）
4. 行业/赛道识别（100-200字）
5. 机构行为解读（100-200字）
6. 公告新闻摘要（100-200字）
7. 风险提示（100-200字）
8. 综合观察（100-200字）

重要：必须标注"AI辅助分析，仅供研究参考，不构成投资建议"。禁止使用"建议买入/卖出"、"目标价"、"必涨/必跌"等语言。

以JSON格式返回：
{
  "summary_one_line": "...",
  "ai_stance": "偏积极/中性/偏谨慎",
  "confidence_level": "低/中/高",
  "data_time_range": "...",
  "industry_analysis": "...",
  "institution_analysis": "...",
  "news_summary": "...",
  "risk_analysis": "...",
  "comprehensive_view": "..."
}`;

      const result = await aiApi.invoke({
        type: 'analysis',
        stockId: selectedStock.id,
        stock: selectedStock, // backend templates need stock fields
        params: { year: selectedStock?.year },
        prompt,
      });

      const record = {
        ...result,
        stock_id: selectedStock.id,
        snapshot_date: new Date().toISOString().split('T')[0],
        generated_at: new Date().toISOString(),
      };
      setAnalysisByStock((prev) => ({ ...prev, [selectedStock.id]: record }));
    } catch (error) {
      console.error('生成分析失败:', error);
    } finally {
      setGeneratingAnalysis(false);
    }
  };

  const generateCompanyProfile = async () => {
    if (!selectedStock) return;
    
    setGeneratingAnalysis(true);
    try {
      const searchQuery = `${selectedStock.code} ${selectedStock.name} 公司简介 主营业务 交易所`;
      
      const prompt = `搜索并总结 ${selectedStock.code} ${selectedStock.name} 的公司资料：
1. 主营业务简介（100-200字）
2. 所属交易所
3. 公司官网
4. 最近一期财务数据（营收、净利润、同比增长）

以JSON格式返回：
{
  "profile_text": "...",
  "exchange": "...",
  "website": "...",
  "revenue": "...",
  "net_profit": "...",
  "yoy_growth": "..."
}`;

      const result = await aiApi.invoke({
        type: 'company_profile',
        stockId: selectedStock.id,
        stock: selectedStock,
        prompt,
      });

      const record = {
        ...result,
        stock_id: selectedStock.id,
        industry_l1: selectedStock.industry_74,
        industry_l2: selectedStock.industry_level2,
        industry_l3: selectedStock.industry_level3,
        data_source: '网络搜索',
        last_updated_at: new Date().toISOString()
      };
      setProfileByStock((prev) => ({ ...prev, [selectedStock.id]: record }));
    } finally {
      setGeneratingAnalysis(false);
    }
  };

  const fetchLatestNews = async () => {
    if (!selectedStock) return;
    
    setGeneratingAnalysis(true);
    try {
      const prompt = `搜索 ${selectedStock.code} ${selectedStock.name} 最近30天的新闻，包括：
- 公司公告
- 行业新闻
- 财经媒体报道

请返回最近20条新闻，每条包含标题、来源、发布时间（YYYY-MM-DD格式）。

以JSON格式返回数组：
[{
  "title": "...",
  "source": "...",
  "published_at": "2025-12-20",
  "url": "..."
}]`;

      const result = await aiApi.invoke({
        type: 'news',
        stockId: selectedStock.id,
        stock: selectedStock,
        prompt,
      });

      const newsArray = result.news || [];
      setNewsByStock((prev) => ({ ...prev, [selectedStock.id]: newsArray }));
    } finally {
      setGeneratingAnalysis(false);
    }
  };

  const generateNewsSummary = async (newsItem) => {
    setGeneratingSummary(newsItem.id);
    try {
      const prompt = `请用2-3行简要概括以下新闻标题的核心内容：
标题：${newsItem.title}
来源：${newsItem.source}

要求：客观、简洁，避免主观判断。`;

      const result = await aiApi.invoke({
        type: 'news_summary',
        stockId: selectedStock?.id,
        stock: selectedStock,
        params: {
          title: newsItem.title,
          source: newsItem.source,
        },
        prompt,
      });

      setNewsByStock((prev) => {
        const current = prev[selectedStock?.id] || [];
        const updated = current.map((n) =>
          n.id === newsItem.id ? { ...n, summary: result } : n
        );
        return { ...prev, [selectedStock?.id]: updated };
      });
    } finally {
      setGeneratingSummary(null);
    }
  };

  const generateInstitutionalAnalysis = async () => {
    if (!selectedStock) return;
    
    setGeneratingAnalysis(true);
    try {
      const prompt = `基于 ${selectedStock.code} ${selectedStock.name} 的机构持仓数据分析：

北上资金：新进 ${selectedStock.beishang_new}万，增持 ${selectedStock.beishang_increase}万，减持 ${selectedStock.beishang_decrease}万
公募基金：新进 ${selectedStock.gongmu_new}万，增持 ${selectedStock.gongmu_increase}万，减持 ${selectedStock.gongmu_decrease}万
外资：新进 ${selectedStock.waizi_new}万，增持 ${selectedStock.waizi_increase}万，减持 ${selectedStock.waizi_decrease}万
私募：新进 ${selectedStock.simu_new}万，增持 ${selectedStock.simu_increase}万，减持 ${selectedStock.simu_decrease}万
社保：新进 ${selectedStock.shebao_new}万，增持 ${selectedStock.shebao_increase}万，减持 ${selectedStock.shebao_decrease}万
养老基金：新进 ${selectedStock.yanglao_new}万，增持 ${selectedStock.yanglao_increase}万，减持 ${selectedStock.yanglao_decrease}万

请从网上搜索该股票的最新机构研报和观点，结合持仓数据分析：
1. 主流机构的整体态度（看多/看空/中性）
2. 重点关注的投资逻辑
3. 机构持仓变化的可能原因
4. 行业内同类公司的机构配置对比

返回300-500字的分析，包含数据支撑。必须标注"AI辅助分析，仅供研究参考，不构成投资建议"。`;

      const result = await aiApi.invoke({
        type: 'institution_analysis',
        stockId: selectedStock.id,
        stock: selectedStock,
        prompt,
      });

      return result;
    } finally {
      setGeneratingAnalysis(false);
    }
  };

  const generateRiskRadar = async () => {
    if (!selectedStock) return;
    
    setGeneratingAnalysis(true);
    try {
      const prompt = `针对 ${selectedStock.code} ${selectedStock.name}（行业：${selectedStock.industry_74}）进行全面风险扫描：

从网上搜索并分析以下风险维度：
1. 行业风险：政策变化、市场竞争、技术迭代
2. 公司风险：财务健康度、经营风险、管理层变动
3. 市场风险：估值水平、流动性、市场情绪
4. 合规风险：诉讼、处罚、监管关注

每个维度给出风险等级（低/中/高）和具体说明。

返回结构化分析，400-600字。必须标注"AI辅助分析，仅供研究参考，不构成投资建议"。`;

      const result = await aiApi.invoke({
        type: 'risk_radar',
        stockId: selectedStock.id,
        stock: selectedStock,
        prompt,
      });

      return result;
    } finally {
      setGeneratingAnalysis(false);
    }
  };

  const generateFundamentals = async () => {
    if (!selectedStock) return;
    
    setGeneratingAnalysis(true);
    try {
      const prompt = `分析 ${selectedStock.code} ${selectedStock.name} 的基本面趋势：

从网上搜索最近3年的数据，分析：
1. 营收趋势及增长驱动力
2. 盈利能力变化（毛利率、净利率）
3. ROE/ROA等关键财务指标
4. 现金流状况
5. 负债率及偿债能力
6. 与同行业公司对比

以季报：${selectedStock.q1_report} / ${selectedStock.q2_report} / ${selectedStock.q3_report} / 年报：${selectedStock.annual_report}
毛利率：${selectedStock.gross_margin}
净利润增长：${selectedStock.profit_growth}

为基础，结合网络搜索补充完整数据，提供趋势图表说明和文字分析（500-800字）。

必须标注"AI辅助分析，仅供研究参考，不构成投资建议"。`;

      const result = await aiApi.invoke({
        type: 'fundamentals',
        stockId: selectedStock.id,
        stock: selectedStock,
        prompt,
      });

      return result;
    } finally {
      setGeneratingAnalysis(false);
    }
  };

  const handleFollowUpQuestion = async (question) => {
    if (!selectedStock || !currentAnalysis) return;
    
    setGeneratingFollowUp(true);
    try {
      const contextPrompt = `基于之前对 ${selectedStock.code} ${selectedStock.name} 的分析：

行业/赛道：${currentAnalysis.industry_analysis}
机构行为：${currentAnalysis.institution_analysis}
风险提示：${currentAnalysis.risk_analysis}
综合观察：${currentAnalysis.comprehensive_view}

用户追问：${question}

请简明扼要地回答（200字以内），基于已有分析上下文。必须标注"AI辅助分析，仅供研究参考，不构成投资建议"。`;

      const answer = await aiApi.invoke({
        type: 'follow_up',
        stockId: selectedStock.id,
        stock: selectedStock,
        params: {
          question,
          industry_analysis: currentAnalysis?.industry_analysis,
          institution_analysis: currentAnalysis?.institution_analysis,
          risk_analysis: currentAnalysis?.risk_analysis,
          comprehensive_view: currentAnalysis?.comprehensive_view,
        },
        prompt: contextPrompt,
      });

      setFollowUpQuestions(prev => [...prev, { question, answer }]);
    } finally {
      setGeneratingFollowUp(false);
    }
  };

  const comparePeers = async () => {
    if (!selectedStock) return;
    
    setComparingPeers(true);
    try {
      const prompt = `${selectedStock.code} ${selectedStock.name}（${selectedStock.industry_74}行业）的同业对比分析：

请搜索该行业的2-3家主要竞争对手，从以下维度对比：
1. 成长性（营收增长、利润增长）
2. 机构关注度（北上、公募等资金流向）
3. 关键风险差异
4. 行业内地位（龙头/中等偏上/中等/偏弱）

返回300-500字分析，必须标注"AI辅助分析，仅供研究参考，不构成投资建议"。`;

      const result = await aiApi.invoke({
        type: 'peer_compare',
        stockId: selectedStock.id,
        stock: selectedStock,
        prompt,
      });

      setFollowUpQuestions(prev => [...prev, { 
        question: '与同行对比', 
        answer: result 
      }]);
    } finally {
      setComparingPeers(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white">AI智能分析</h1>
        {selectedStock && (
          <Button
            onClick={generateAnalysis}
            disabled={generatingAnalysis}
            className="bg-emerald-600 hover:bg-emerald-700"
          >
            {generatingAnalysis ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                生成中...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 mr-2" />
                生成AI分析
              </>
            )}
          </Button>
        )}
      </div>

      <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4 space-y-4">
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
            <Input
              placeholder="搜索股票代码或名称..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-slate-900/50 border-slate-700 text-white"
            />
          </div>
          <IndustryCombobox
            value={selectedIndustry}
            onChange={setSelectedIndustry}
            industries={industries}
            totalCount={stocks.length}
          />
        </div>

        <div className="flex gap-2 flex-wrap">
          {filteredStocks.slice(0, 20).map((stock) => (
            <Button
              key={stock.id}
              variant={selectedStock?.id === stock.id ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedStock(stock)}
              className={selectedStock?.id === stock.id ? "bg-emerald-600" : ""}
            >
              {stock.code} {stock.name}
            </Button>
          ))}
        </div>
      </div>

      {!selectedStock ? (
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="py-12 text-center text-slate-400">
            请选择一只股票开始AI分析
          </CardContent>
        </Card>
      ) : (
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="bg-slate-800/50 border border-slate-700/50">
            <TabsTrigger value="overview" className="data-[state=active]:bg-emerald-600">
              AI概览
            </TabsTrigger>
            <TabsTrigger value="profile" className="data-[state=active]:bg-emerald-600">
              公司资料
            </TabsTrigger>
            <TabsTrigger value="news" className="data-[state=active]:bg-emerald-600">
              最新新闻
            </TabsTrigger>
            <TabsTrigger value="institutional" className="data-[state=active]:bg-emerald-600">
              机构解读
            </TabsTrigger>
            <TabsTrigger value="risk" className="data-[state=active]:bg-emerald-600">
              风险雷达
            </TabsTrigger>
            <TabsTrigger value="fundamentals" className="data-[state=active]:bg-emerald-600">
              基本面趋势
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            {currentAnalysis ? (
              <>
                {currentAnalysis.summary_one_line && (
                  <Card className="bg-gradient-to-r from-emerald-500/10 to-emerald-600/10 border-emerald-500/30">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-emerald-500/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                          <Sparkles className="w-4 h-4 text-emerald-400" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm text-slate-400 mb-1">一句话总结</p>
                          <p className="text-lg text-white font-medium leading-relaxed">
                            {currentAnalysis.summary_one_line}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {(currentAnalysis.ai_stance || currentAnalysis.confidence_level) && (
                  <Card className="bg-slate-800/50 border-slate-700">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div>
                            <p className="text-xs text-slate-500 mb-1">AI综合判断</p>
                            <div className="flex items-center gap-2">
                              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                                currentAnalysis.ai_stance?.includes('积极') ? 'bg-emerald-500/20 text-emerald-400' :
                                currentAnalysis.ai_stance?.includes('谨慎') ? 'bg-orange-500/20 text-orange-400' :
                                'bg-blue-500/20 text-blue-400'
                              }`}>
                                {currentAnalysis.ai_stance || '中性'}
                              </span>
                              <span className="text-slate-400">·</span>
                              <span className="text-sm text-slate-300">
                                信心度: <span className="font-medium">{currentAnalysis.confidence_level || '中'}</span>
                              </span>
                            </div>
                          </div>
                        </div>
                        {currentAnalysis.data_time_range && (
                          <div className="text-xs text-slate-500">
                            {currentAnalysis.data_time_range}
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )}

                <div className="flex items-center justify-between text-sm text-slate-400">
                  <div>
                    数据快照: {currentAnalysis.snapshot_date} | 
                    生成时间: {format(new Date(currentAnalysis.generated_at), 'yyyy-MM-dd HH:mm')}
                  </div>
                  <Button size="sm" variant="outline" onClick={generateAnalysis} disabled={generatingAnalysis}>
                    <RefreshCw className="w-3 h-3 mr-2" />
                    重新生成
                  </Button>
                </div>

                <Card className="bg-slate-800/50 border-slate-700">
                  <CardHeader>
                    <CardTitle className="text-emerald-400">行业/赛道识别</CardTitle>
                  </CardHeader>
                  <CardContent className="text-slate-300">
                    {currentAnalysis.industry_analysis}
                  </CardContent>
                </Card>

                <Card className="bg-slate-800/50 border-slate-700">
                  <CardHeader>
                    <CardTitle className="text-blue-400">机构行为解读</CardTitle>
                  </CardHeader>
                  <CardContent className="text-slate-300">
                    {currentAnalysis.institution_analysis}
                  </CardContent>
                </Card>

                <Card className="bg-slate-800/50 border-slate-700">
                  <CardHeader>
                    <CardTitle className="text-purple-400">公告新闻摘要</CardTitle>
                  </CardHeader>
                  <CardContent className="text-slate-300">
                    {currentAnalysis.news_summary}
                  </CardContent>
                </Card>

                <Card className="bg-slate-800/50 border-slate-700">
                  <CardHeader>
                    <CardTitle className="text-orange-400 flex items-center">
                      <AlertTriangle className="w-5 h-5 mr-2" />
                      风险提示
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-slate-300">
                    {currentAnalysis.risk_analysis}
                  </CardContent>
                </Card>

                <Card className="bg-slate-800/50 border-slate-700">
                  <CardHeader>
                    <CardTitle className="text-yellow-400">综合观察</CardTitle>
                  </CardHeader>
                  <CardContent className="text-slate-300">
                    {currentAnalysis.comprehensive_view}
                    <div className="mt-4 p-3 bg-slate-900/50 rounded-lg border border-slate-700 text-xs text-slate-500">
                      ⚠️ AI辅助分析，仅供研究参考，不构成投资建议
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-slate-800/50 border-slate-700">
                  <CardHeader>
                    <CardTitle className="text-blue-400 flex items-center justify-between">
                      <span>你还可以问 AI</span>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={comparePeers}
                        disabled={comparingPeers}
                      >
                        {comparingPeers ? (
                          <>
                            <RefreshCw className="w-3 h-3 mr-2 animate-spin" />
                            对比中...
                          </>
                        ) : (
                          '与同行对比'
                        )}
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="justify-start text-left h-auto py-3 px-4"
                        onClick={() => handleFollowUpQuestion('这家公司最大的风险是什么？')}
                        disabled={generatingFollowUp}
                      >
                        <span className="text-emerald-400 mr-2">👉</span>
                        这家公司最大的风险是什么？
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="justify-start text-left h-auto py-3 px-4"
                        onClick={() => handleFollowUpQuestion('和同行相比，它贵还是便宜？')}
                        disabled={generatingFollowUp}
                      >
                        <span className="text-emerald-400 mr-2">👉</span>
                        和同行相比，它贵还是便宜？
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="justify-start text-left h-auto py-3 px-4"
                        onClick={() => handleFollowUpQuestion('适不适合中长期持有？')}
                        disabled={generatingFollowUp}
                      >
                        <span className="text-emerald-400 mr-2">👉</span>
                        适不适合中长期持有？
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="justify-start text-left h-auto py-3 px-4"
                        onClick={() => handleFollowUpQuestion('如果宏观环境变差，会先受影响吗？')}
                        disabled={generatingFollowUp}
                      >
                        <span className="text-emerald-400 mr-2">👉</span>
                        如果宏观环境变差，会先受影响吗？
                      </Button>
                    </div>

                    {generatingFollowUp && (
                      <div className="flex items-center justify-center py-4 text-slate-400">
                        <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                        AI思考中...
                      </div>
                    )}

                    {followUpQuestions.length > 0 && (
                      <div className="mt-6 space-y-4 pt-4 border-t border-slate-700">
                        {followUpQuestions.map((qa, index) => (
                          <div key={index} className="space-y-2">
                            <div className="flex items-start gap-2">
                              <div className="w-6 h-6 bg-blue-500/20 rounded flex items-center justify-center flex-shrink-0 mt-0.5">
                                <span className="text-xs text-blue-400">Q</span>
                              </div>
                              <p className="text-white font-medium">{qa.question}</p>
                            </div>
                            <div className="flex items-start gap-2">
                              <div className="w-6 h-6 bg-emerald-500/20 rounded flex items-center justify-center flex-shrink-0 mt-0.5">
                                <Sparkles className="w-3 h-3 text-emerald-400" />
                              </div>
                              <div className="flex-1 text-slate-300 text-sm bg-slate-900/50 p-3 rounded-lg">
                                {qa.answer}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </>
            ) : (
              <Card className="bg-slate-800/50 border-slate-700">
                <CardContent className="py-12 text-center">
                  <p className="text-slate-400 mb-4">尚未生成AI分析</p>
                  <Button onClick={generateAnalysis} disabled={generatingAnalysis}>
                    <Sparkles className="w-4 h-4 mr-2" />
                    生成AI分析
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="profile" className="space-y-4">
            {!currentProfile && (
              <div className="flex justify-center mb-4">
                <Button onClick={generateCompanyProfile} disabled={generatingAnalysis}>
                  {generatingAnalysis ? (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      搜索中...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 mr-2" />
                      从网上获取公司资料
                    </>
                  )}
                </Button>
              </div>
            )}
            {currentProfile ? (
              <>
                <Card className="bg-slate-800/50 border-slate-700">
                  <CardHeader>
                    <CardTitle>基础信息</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 text-slate-300">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-slate-500">股票代码</p>
                        <p className="font-medium">{selectedStock.code}</p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-500">股票名称</p>
                        <p className="font-medium">{selectedStock.name}</p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-500">交易所</p>
                        <p className="font-medium">{currentProfile.exchange || '-'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-500">一级行业</p>
                        <p className="font-medium">{currentProfile.industry_l1 || selectedStock.industry_74}</p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-500">二级行业</p>
                        <p className="font-medium">{currentProfile.industry_l2 || selectedStock.industry_level2}</p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-500">三级行业</p>
                        <p className="font-medium">{currentProfile.industry_l3 || selectedStock.industry_level3}</p>
                      </div>
                    </div>
                    {currentProfile.website && (
                      <div>
                        <p className="text-sm text-slate-500 mb-1">公司官网</p>
                        <a href={currentProfile.website} target="_blank" rel="noopener noreferrer" className="text-emerald-400 hover:underline flex items-center">
                          {currentProfile.website}
                          <ExternalLink className="w-3 h-3 ml-1" />
                        </a>
                      </div>
                    )}
                    {currentProfile.profile_text && (
                      <div>
                        <p className="text-sm text-slate-500 mb-1">主营业务简介</p>
                        <p className="leading-relaxed">{currentProfile.profile_text}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card className="bg-slate-800/50 border-slate-700">
                  <CardHeader>
                    <CardTitle>股本结构</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-slate-300">
                    <div className="flex justify-between">
                      <span className="text-slate-500">总股本</span>
                      <span className="font-medium">{selectedStock.total_shares?.toLocaleString() || '-'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">流通股</span>
                      <span className="font-medium">{selectedStock.circulating_shares?.toLocaleString() || '-'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">限售股</span>
                      <span className="font-medium">{selectedStock.restricted_shares?.toLocaleString() || '-'}</span>
                    </div>
                  </CardContent>
                </Card>

                {(currentProfile.revenue || currentProfile.net_profit) && (
                  <Card className="bg-slate-800/50 border-slate-700">
                    <CardHeader>
                      <CardTitle>关键财务摘要</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2 text-slate-300">
                      <div className="flex justify-between">
                        <span className="text-slate-500">最近一期营收</span>
                        <span className="font-medium">{currentProfile.revenue || '-'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">最近一期净利润</span>
                        <span className="font-medium">{currentProfile.net_profit || '-'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">同比增长</span>
                        <span className="font-medium">{currentProfile.yoy_growth || '-'}</span>
                      </div>
                    </CardContent>
                  </Card>
                )}

                <div className="text-xs text-slate-500 text-right">
                  数据来源: {currentProfile.data_source || '系统'} | 
                  更新时间: {currentProfile.last_updated_at ? format(new Date(currentProfile.last_updated_at), 'yyyy-MM-dd HH:mm') : '-'}
                </div>
              </>
            ) : (
              <Card className="bg-slate-800/50 border-slate-700">
                <CardContent className="py-12 text-center text-slate-400">
                  暂无公司资料
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="news" className="space-y-4">
            <div className="flex gap-2 justify-between">
              <div className="flex gap-2">
                <Button size="sm" variant="outline">一键摘要（24h）</Button>
                <Button size="sm" variant="outline">一键摘要（72h）</Button>
              </div>
              <Button size="sm" onClick={fetchLatestNews} disabled={generatingAnalysis}>
                {generatingAnalysis ? (
                  <>
                    <RefreshCw className="w-3 h-3 mr-2 animate-spin" />
                    搜索中...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3 h-3 mr-2" />
                    获取最新新闻
                  </>
                )}
              </Button>
            </div>
            {currentNews.length > 0 ? (
              <>

                <div className="space-y-3">
                  {currentNews.map((newsItem) => (
                    <Card key={newsItem.id} className="bg-slate-800/50 border-slate-700">
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="text-white font-medium flex-1">{newsItem.title}</h4>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => generateNewsSummary(newsItem)}
                            disabled={generatingSummary === newsItem.id}
                          >
                            {generatingSummary === newsItem.id ? (
                              <RefreshCw className="w-3 h-3 animate-spin" />
                            ) : (
                              'AI摘要'
                            )}
                          </Button>
                        </div>
                        <div className="flex items-center gap-4 text-xs text-slate-500 mb-2">
                          <span>{newsItem.source}</span>
                          <span>{format(new Date(newsItem.published_at), 'yyyy-MM-dd HH:mm')}</span>
                          {newsItem.url && (
                            <a href={newsItem.url} target="_blank" rel="noopener noreferrer" className="text-emerald-400 hover:underline flex items-center">
                              原文链接
                              <ExternalLink className="w-3 h-3 ml-1" />
                            </a>
                          )}
                        </div>
                        {newsItem.summary && (
                          <p className="text-sm text-slate-300 bg-slate-900/50 p-3 rounded-lg">
                            {newsItem.summary}
                          </p>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </>
            ) : (
              <Card className="bg-slate-800/50 border-slate-700">
                <CardContent className="py-12 text-center text-slate-400">
                  暂无新闻数据
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="institutional">
            <InstitutionalAnalysisTab 
              selectedStock={selectedStock}
              onGenerate={generateInstitutionalAnalysis}
              generating={generatingAnalysis}
            />
          </TabsContent>

          <TabsContent value="risk">
            <RiskRadarTab 
              selectedStock={selectedStock}
              onGenerate={generateRiskRadar}
              generating={generatingAnalysis}
            />
          </TabsContent>

          <TabsContent value="fundamentals">
            <FundamentalsTab 
              selectedStock={selectedStock}
              onGenerate={generateFundamentals}
              generating={generatingAnalysis}
            />
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}
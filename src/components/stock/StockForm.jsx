import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { X, Trash2 } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { stocksApi } from '@/api/resources/stocks';

export default function StockForm({ stock, defaultYear, onSubmit, onCancel, existingIndustries = [] }) {
  const queryClient = useQueryClient();
  const currentYear = new Date().getFullYear();
  const [formData, setFormData] = useState(stock || {
    year: defaultYear || currentYear,
    code: '',
    name: '',
    total_shares: '',
    circulating_shares: '',
    restricted_shares: '',
    profit: '',
    industry_74: '',
    industry_level2: '',
    industry_level3: '',
    concept: '',
    product: '',
    percentage: '',
    comparable: '',
    export_ratio: '',
    domestic_ratio: '',
    notes: '',
    q1_report: '',
    q2_report: '',
    q3_report: '',
    annual_report: '',
    gross_margin: '',
    profit_growth: '',
    net_asset_ratio: '',
    undistributed_cash: '',
    bonus_shares: '',
    dividend: '',
    quarterly_comparison: '',
    beishang_new: '',
    beishang_increase: '',
    beishang_decrease: '',
    beishang_current: '',
    gongmu_new: '',
    gongmu_increase: '',
    gongmu_decrease: '',
    gongmu_current: '',
    waizi_new: '',
    waizi_increase: '',
    waizi_decrease: '',
    waizi_current: '',
    simu_new: '',
    simu_increase: '',
    simu_decrease: '',
    simu_current: '',
    shebao_new: '',
    shebao_increase: '',
    shebao_decrease: '',
    shebao_current: '',
    yanglao_new: '',
    yanglao_increase: '',
    yanglao_decrease: '',
    yanglao_current: ''
  });

  const toNum = (v) => {
    if (v === '' || v === undefined || v === null) return 0;
    const n = parseFloat(String(v).replace(/,/g, ''));
    return Number.isFinite(n) ? n : 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const submitData = {
      ...formData,
      year: formData.year ? parseInt(formData.year) : currentYear,
      total_shares: toNum(formData.total_shares),
      totalShares: toNum(formData.total_shares),
      circulating_shares: toNum(formData.circulating_shares),
      restricted_shares: toNum(formData.restricted_shares),
      profit: toNum(formData.profit),
      floatShares: toNum(formData.circulating_shares),
      beishang_new: toNum(formData.beishang_new),
      beishang_increase: toNum(formData.beishang_increase),
      beishang_decrease: toNum(formData.beishang_decrease),
      beishang_current: toNum(formData.beishang_current),
      gongmu_new: toNum(formData.gongmu_new),
      gongmu_increase: toNum(formData.gongmu_increase),
      gongmu_decrease: toNum(formData.gongmu_decrease),
      gongmu_current: toNum(formData.gongmu_current),
      waizi_new: toNum(formData.waizi_new),
      waizi_increase: toNum(formData.waizi_increase),
      waizi_decrease: toNum(formData.waizi_decrease),
      waizi_current: toNum(formData.waizi_current),
      simu_new: toNum(formData.simu_new),
      simu_increase: toNum(formData.simu_increase),
      simu_decrease: toNum(formData.simu_decrease),
      simu_current: toNum(formData.simu_current),
      shebao_new: toNum(formData.shebao_new),
      shebao_increase: toNum(formData.shebao_increase),
      shebao_decrease: toNum(formData.shebao_decrease),
      shebao_current: toNum(formData.shebao_current),
      yanglao_new: toNum(formData.yanglao_new),
      yanglao_increase: toNum(formData.yanglao_increase),
      yanglao_decrease: toNum(formData.yanglao_decrease),
      yanglao_current: toNum(formData.yanglao_current),
    };
    onSubmit(submitData);
  };

  const [industrySearch, setIndustrySearch] = useState('');
  const [newIndustries, setNewIndustries] = useState(() => {
    const saved = localStorage.getItem('customIndustries');
    return saved ? JSON.parse(saved) : [];
  });

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleAddIndustry = () => {
    if (formData.industry_74) {
      const currentIndustries = [...new Set([...existingIndustries, ...newIndustries])];
      if (!currentIndustries.includes(formData.industry_74)) {
        const updated = [...newIndustries, formData.industry_74];
        setNewIndustries(updated);
        localStorage.setItem('customIndustries', JSON.stringify(updated));
        toast.success(`新行业"${formData.industry_74}"已添加到列表`);
      } else {
        toast.info('该行业已存在');
      }
    } else {
      toast.error('请先输入行业名称');
    }
  };

  const handleDeleteIndustry = async (industryToDelete) => {
    try {
      // 获取所有使用该行业的股票
      const allStocks = await stocksApi.list();
      const stocksWithIndustry = allStocks.filter(s => s.industry_74 === industryToDelete);
      
      // 将这些股票的行业清空
      for (const stock of stocksWithIndustry) {
          await stocksApi.update(stock.id, { industry_74: '' });
      }
      
      // 如果是自定义行业，从localStorage中删除
      if (newIndustries.includes(industryToDelete)) {
        const updated = newIndustries.filter(ind => ind !== industryToDelete);
        setNewIndustries(updated);
        localStorage.setItem('customIndustries', JSON.stringify(updated));
      }
      
      // 如果当前表单的行业也是被删除的，清空它
      if (formData.industry_74 === industryToDelete) {
        handleChange('industry_74', '');
      }
      
      // 刷新数据
      queryClient.invalidateQueries({ queryKey: ['all-year-stocks'] });
      toast.success(`已删除行业"${industryToDelete}"及相关数据`);
    } catch (error) {
      toast.error('删除失败，请重试');
    }
  };

  const allIndustries = [...new Set([...existingIndustries, ...newIndustries])].sort();
  
  const filteredIndustries = allIndustries.filter(industry => 
    industry.toLowerCase().includes(industrySearch.toLowerCase())
  );

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 border border-slate-700 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-slate-800 border-b border-slate-700 p-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-white">
            {stock ? '编辑股票' : '添加股票'}
          </h2>
          <Button variant="ghost" size="icon" onClick={onCancel}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                数据年份 *
              </label>
              <Input
                type="number"
                required
                placeholder="例如: 2025"
                value={formData.year}
                onChange={(e) => handleChange('year', e.target.value)}
                className="bg-slate-900/50 border-slate-700 text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                股票代码 *
              </label>
              <Input
                required
                placeholder="例如: 000001"
                value={formData.code}
                onChange={(e) => handleChange('code', e.target.value)}
                className="bg-slate-900/50 border-slate-700 text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                股票名称 *
              </label>
              <Input
                required
                placeholder="例如: 平安银行"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                className="bg-slate-900/50 border-slate-700 text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                总股本
              </label>
              <Input
                type="number"
                placeholder="例如: 1940592"
                value={formData.total_shares}
                onChange={(e) => handleChange('total_shares', e.target.value)}
                className="bg-slate-900/50 border-slate-700 text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                流通股
              </label>
              <Input
                type="number"
                placeholder="例如: 1940555"
                value={formData.circulating_shares}
                onChange={(e) => handleChange('circulating_shares', e.target.value)}
                className="bg-slate-900/50 border-slate-700 text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                限售股
              </label>
              <Input
                type="number"
                placeholder="例如: 37"
                value={formData.restricted_shares}
                onChange={(e) => handleChange('restricted_shares', e.target.value)}
                className="bg-slate-900/50 border-slate-700 text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                股票利润
              </label>
              <Input
                type="number"
                placeholder="例如: 5000000"
                value={formData.profit}
                onChange={(e) => handleChange('profit', e.target.value)}
                className="bg-slate-900/50 border-slate-700 text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                一级行业
              </label>
              <div className="space-y-2">
                <Select 
                  value={allIndustries.includes(formData.industry_74) ? formData.industry_74 : ''} 
                  onValueChange={(value) => {
                    handleChange('industry_74', value === 'none' ? '' : value);
                    setIndustrySearch('');
                  }}
                >
                  <SelectTrigger className="bg-slate-900/50 border-slate-700 text-white">
                    <SelectValue placeholder="从列表快速选择" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-700 max-h-80">
                    <div className="sticky top-0 bg-slate-800 p-2 border-b border-slate-700">
                      <Input
                        placeholder="搜索行业..."
                        value={industrySearch}
                        onChange={(e) => setIndustrySearch(e.target.value)}
                        className="bg-slate-900/50 border-slate-700 text-white h-8"
                        onClick={(e) => e.stopPropagation()}
                      />
                    </div>
                    <SelectItem value="none" className="text-slate-400">
                      -- 清空 --
                    </SelectItem>
                    {filteredIndustries.length > 0 ? (
                      filteredIndustries.map((industry) => (
                        <div key={industry} className="flex items-center justify-between px-2 hover:bg-slate-700/50 group">
                          <SelectItem value={industry} className="text-white flex-1 border-0">
                            {industry}
                          </SelectItem>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              if (window.confirm(`确定要删除"${industry}"吗？`)) {
                                handleDeleteIndustry(industry);
                              }
                            }}
                            className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-500/20 rounded transition-opacity"
                            title="删除此行业"
                          >
                            <Trash2 className="w-3 h-3 text-red-400" />
                          </button>
                        </div>
                      ))
                    ) : (
                      <div className="px-3 py-2 text-sm text-slate-400">
                        未找到匹配的行业
                      </div>
                    )}
                  </SelectContent>
                </Select>
                <div className="flex gap-2 items-center">
                  <Input
                    placeholder="或直接输入新行业"
                    value={formData.industry_74 || ''}
                    onChange={(e) => handleChange('industry_74', e.target.value)}
                    className="bg-slate-900/50 border-slate-700 text-white flex-1"
                  />
                  <Button
                    type="button"
                    onClick={handleAddIndustry}
                    variant="outline"
                    className="whitespace-nowrap border-emerald-600 text-emerald-400 hover:bg-emerald-500/20"
                  >
                    + 添加
                  </Button>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                二级行业
              </label>
              <Input
                placeholder="输入二级行业"
                value={formData.industry_level2}
                onChange={(e) => handleChange('industry_level2', e.target.value)}
                className="bg-slate-900/50 border-slate-700 text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                年报行业
              </label>
              <Input
                placeholder="输入年报行业"
                value={formData.industry_level3}
                onChange={(e) => handleChange('industry_level3', e.target.value)}
                className="bg-slate-900/50 border-slate-700 text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                概念
              </label>
              <Input
                placeholder="例如: 金融科技"
                value={formData.concept}
                onChange={(e) => handleChange('concept', e.target.value)}
                className="bg-slate-900/50 border-slate-700 text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                产品
              </label>
              <Input
                placeholder="产品名称"
                value={formData.product}
                onChange={(e) => handleChange('product', e.target.value)}
                className="bg-slate-900/50 border-slate-700 text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                占比%
              </label>
              <Input
                placeholder="例如: 25%"
                value={formData.percentage}
                onChange={(e) => handleChange('percentage', e.target.value)}
                className="bg-slate-900/50 border-slate-700 text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                可比
              </label>
              <Input
                placeholder="可比公司"
                value={formData.comparable}
                onChange={(e) => handleChange('comparable', e.target.value)}
                className="bg-slate-900/50 border-slate-700 text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                外销占比
              </label>
              <Input
                placeholder="例如: 60%"
                value={formData.export_ratio}
                onChange={(e) => handleChange('export_ratio', e.target.value)}
                className="bg-slate-900/50 border-slate-700 text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                内销占比
              </label>
              <Input
                placeholder="例如: 40%"
                value={formData.domestic_ratio}
                onChange={(e) => handleChange('domestic_ratio', e.target.value)}
                className="bg-slate-900/50 border-slate-700 text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              备注
            </label>
            <Textarea
              placeholder="添加备注信息..."
              value={formData.notes}
              onChange={(e) => handleChange('notes', e.target.value)}
              className="bg-slate-900/50 border-slate-700 text-white h-24"
            />
          </div>

          <div className="border-t border-slate-700 pt-4">
            <h3 className="text-lg font-semibold text-white mb-4">利润数据</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  一季报
                </label>
                <Input
                  placeholder="一季报数据"
                  value={formData.q1_report}
                  onChange={(e) => handleChange('q1_report', e.target.value)}
                  className="bg-slate-900/50 border-slate-700 text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  二季报
                </label>
                <Input
                  placeholder="二季报数据"
                  value={formData.q2_report}
                  onChange={(e) => handleChange('q2_report', e.target.value)}
                  className="bg-slate-900/50 border-slate-700 text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  三季报
                </label>
                <Input
                  placeholder="三季报数据"
                  value={formData.q3_report}
                  onChange={(e) => handleChange('q3_report', e.target.value)}
                  className="bg-slate-900/50 border-slate-700 text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  年报
                </label>
                <Input
                  placeholder="年报数据"
                  value={formData.annual_report}
                  onChange={(e) => handleChange('annual_report', e.target.value)}
                  className="bg-slate-900/50 border-slate-700 text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  毛率
                </label>
                <Input
                  placeholder="例如: 35%"
                  value={formData.gross_margin}
                  onChange={(e) => handleChange('gross_margin', e.target.value)}
                  className="bg-slate-900/50 border-slate-700 text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  净利润增长
                </label>
                <Input
                  placeholder="例如: +15%"
                  value={formData.profit_growth}
                  onChange={(e) => handleChange('profit_growth', e.target.value)}
                  className="bg-slate-900/50 border-slate-700 text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  净资率
                </label>
                <Input
                  placeholder="例如: 12%"
                  value={formData.net_asset_ratio}
                  onChange={(e) => handleChange('net_asset_ratio', e.target.value)}
                  className="bg-slate-900/50 border-slate-700 text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  未分现金
                </label>
                <Input
                  placeholder="例如: 5000万"
                  value={formData.undistributed_cash}
                  onChange={(e) => handleChange('undistributed_cash', e.target.value)}
                  className="bg-slate-900/50 border-slate-700 text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  送股
                </label>
                <Input
                  placeholder="送股信息"
                  value={formData.bonus_shares}
                  onChange={(e) => handleChange('bonus_shares', e.target.value)}
                  className="bg-slate-900/50 border-slate-700 text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  派现
                </label>
                <Input
                  placeholder="派现信息"
                  value={formData.dividend}
                  onChange={(e) => handleChange('dividend', e.target.value)}
                  className="bg-slate-900/50 border-slate-700 text-white"
                />
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-slate-300 mb-2">
                季报比较
              </label>
              <Textarea
                placeholder="季报比较分析..."
                value={formData.quarterly_comparison}
                onChange={(e) => handleChange('quarterly_comparison', e.target.value)}
                className="bg-slate-900/50 border-slate-700 text-white h-24"
              />
            </div>
          </div>

          <div className="border-t border-slate-700 pt-4">
            <h3 className="text-lg font-semibold text-white mb-4">机构增减（单位：万）</h3>

            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-emerald-400 mb-3">北上</h4>
                <div className="grid grid-cols-4 gap-4">
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">现持有</label>
                    <Input
                      type="number"
                      placeholder="万"
                      value={formData.beishang_current}
                      onChange={(e) => handleChange('beishang_current', e.target.value)}
                      className="bg-slate-900/50 border-slate-700 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">新进</label>
                    <Input
                      type="number"
                      placeholder="万"
                      value={formData.beishang_new}
                      onChange={(e) => handleChange('beishang_new', e.target.value)}
                      className="bg-slate-900/50 border-slate-700 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">增持</label>
                    <Input
                      type="number"
                      placeholder="万"
                      value={formData.beishang_increase}
                      onChange={(e) => handleChange('beishang_increase', e.target.value)}
                      className="bg-slate-900/50 border-slate-700 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">减持</label>
                    <Input
                      type="number"
                      placeholder="万"
                      value={formData.beishang_decrease}
                      onChange={(e) => handleChange('beishang_decrease', e.target.value)}
                      className="bg-slate-900/50 border-slate-700 text-white"
                    />
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-blue-400 mb-3">公募</h4>
                <div className="grid grid-cols-4 gap-4">
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">现持有</label>
                    <Input
                      type="number"
                      placeholder="万"
                      value={formData.gongmu_current}
                      onChange={(e) => handleChange('gongmu_current', e.target.value)}
                      className="bg-slate-900/50 border-slate-700 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">新进</label>
                    <Input
                      type="number"
                      placeholder="万"
                      value={formData.gongmu_new}
                      onChange={(e) => handleChange('gongmu_new', e.target.value)}
                      className="bg-slate-900/50 border-slate-700 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">增持</label>
                    <Input
                      type="number"
                      placeholder="万"
                      value={formData.gongmu_increase}
                      onChange={(e) => handleChange('gongmu_increase', e.target.value)}
                      className="bg-slate-900/50 border-slate-700 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">减持</label>
                    <Input
                      type="number"
                      placeholder="万"
                      value={formData.gongmu_decrease}
                      onChange={(e) => handleChange('gongmu_decrease', e.target.value)}
                      className="bg-slate-900/50 border-slate-700 text-white"
                    />
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-purple-400 mb-3">外资</h4>
                <div className="grid grid-cols-4 gap-4">
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">现持有</label>
                    <Input
                      type="number"
                      placeholder="万"
                      value={formData.waizi_current}
                      onChange={(e) => handleChange('waizi_current', e.target.value)}
                      className="bg-slate-900/50 border-slate-700 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">新进</label>
                    <Input
                      type="number"
                      placeholder="万"
                      value={formData.waizi_new}
                      onChange={(e) => handleChange('waizi_new', e.target.value)}
                      className="bg-slate-900/50 border-slate-700 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">增持</label>
                    <Input
                      type="number"
                      placeholder="万"
                      value={formData.waizi_increase}
                      onChange={(e) => handleChange('waizi_increase', e.target.value)}
                      className="bg-slate-900/50 border-slate-700 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">减持</label>
                    <Input
                      type="number"
                      placeholder="万"
                      value={formData.waizi_decrease}
                      onChange={(e) => handleChange('waizi_decrease', e.target.value)}
                      className="bg-slate-900/50 border-slate-700 text-white"
                    />
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-orange-400 mb-3">私募</h4>
                <div className="grid grid-cols-4 gap-4">
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">现持有</label>
                    <Input
                      type="number"
                      placeholder="万"
                      value={formData.simu_current}
                      onChange={(e) => handleChange('simu_current', e.target.value)}
                      className="bg-slate-900/50 border-slate-700 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">新进</label>
                    <Input
                      type="number"
                      placeholder="万"
                      value={formData.simu_new}
                      onChange={(e) => handleChange('simu_new', e.target.value)}
                      className="bg-slate-900/50 border-slate-700 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">增持</label>
                    <Input
                      type="number"
                      placeholder="万"
                      value={formData.simu_increase}
                      onChange={(e) => handleChange('simu_increase', e.target.value)}
                      className="bg-slate-900/50 border-slate-700 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">减持</label>
                    <Input
                      type="number"
                      placeholder="万"
                      value={formData.simu_decrease}
                      onChange={(e) => handleChange('simu_decrease', e.target.value)}
                      className="bg-slate-900/50 border-slate-700 text-white"
                    />
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-yellow-400 mb-3">社保</h4>
                <div className="grid grid-cols-4 gap-4">
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">现持有</label>
                    <Input
                      type="number"
                      placeholder="万"
                      value={formData.shebao_current}
                      onChange={(e) => handleChange('shebao_current', e.target.value)}
                      className="bg-slate-900/50 border-slate-700 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">新进</label>
                    <Input
                      type="number"
                      placeholder="万"
                      value={formData.shebao_new}
                      onChange={(e) => handleChange('shebao_new', e.target.value)}
                      className="bg-slate-900/50 border-slate-700 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">增持</label>
                    <Input
                      type="number"
                      placeholder="万"
                      value={formData.shebao_increase}
                      onChange={(e) => handleChange('shebao_increase', e.target.value)}
                      className="bg-slate-900/50 border-slate-700 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">减持</label>
                    <Input
                      type="number"
                      placeholder="万"
                      value={formData.shebao_decrease}
                      onChange={(e) => handleChange('shebao_decrease', e.target.value)}
                      className="bg-slate-900/50 border-slate-700 text-white"
                    />
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-pink-400 mb-3">养老基金</h4>
                <div className="grid grid-cols-4 gap-4">
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">现持有</label>
                    <Input
                      type="number"
                      placeholder="万"
                      value={formData.yanglao_current}
                      onChange={(e) => handleChange('yanglao_current', e.target.value)}
                      className="bg-slate-900/50 border-slate-700 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">新进</label>
                    <Input
                      type="number"
                      placeholder="万"
                      value={formData.yanglao_new}
                      onChange={(e) => handleChange('yanglao_new', e.target.value)}
                      className="bg-slate-900/50 border-slate-700 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">增持</label>
                    <Input
                      type="number"
                      placeholder="万"
                      value={formData.yanglao_increase}
                      onChange={(e) => handleChange('yanglao_increase', e.target.value)}
                      className="bg-slate-900/50 border-slate-700 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">减持</label>
                    <Input
                      type="number"
                      placeholder="万"
                      value={formData.yanglao_decrease}
                      onChange={(e) => handleChange('yanglao_decrease', e.target.value)}
                      className="bg-slate-900/50 border-slate-700 text-white"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button type="button" variant="outline" onClick={onCancel}>
              取消
            </Button>
            <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700">
              {stock ? '保存' : '添加'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
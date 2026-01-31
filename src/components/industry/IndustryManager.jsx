import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Trash2, Plus } from 'lucide-react';
import { toast } from 'sonner';
import { stocksApi } from '@/api/resources/stocks';

export default function IndustryManager({ open, onClose, industries, onRefresh }) {
  const [newIndustryName, setNewIndustryName] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [customIndustries, setCustomIndustries] = useState(() => {
    const saved = localStorage.getItem('customIndustries');
    return saved ? JSON.parse(saved) : [];
  });

  const handleAddIndustry = () => {
    if (!newIndustryName.trim()) {
      toast.error('请输入行业名称');
      return;
    }

    const allIndustries = [...industries, ...customIndustries];
    if (allIndustries.includes(newIndustryName.trim())) {
      toast.info('该行业已存在');
      return;
    }

    const updated = [...customIndustries, newIndustryName.trim()];
    setCustomIndustries(updated);
    localStorage.setItem('customIndustries', JSON.stringify(updated));
    // 触发存储事件，通知其他组件更新
    window.dispatchEvent(new Event('storage'));
    toast.success(`行业"${newIndustryName}"已添加`);
    setNewIndustryName('');
  };

  const handleDeleteIndustry = async (industryToDelete) => {
    try {
      // 获取所有使用该行业的股票
      const allStocks = await stocksApi.list();
      const stocksWithIndustry = allStocks.filter(s => s.industry_74 === industryToDelete);
      
      if (stocksWithIndustry.length > 0) {
        if (!window.confirm(`该行业下有 ${stocksWithIndustry.length} 只股票，确定要删除吗？删除后这些股票的行业信息将被清空。`)) {
          return;
        }
        // 将这些股票的行业清空
        for (const stock of stocksWithIndustry) {
          await stocksApi.update(stock.id, { industry_74: '' });
        }
      }
      
      // 如果是自定义行业，从localStorage中删除
      if (customIndustries.includes(industryToDelete)) {
        const updated = customIndustries.filter(ind => ind !== industryToDelete);
        setCustomIndustries(updated);
        localStorage.setItem('customIndustries', JSON.stringify(updated));
      }
      
      toast.success(`已删除行业"${industryToDelete}"`);
      // 触发存储事件，通知其他组件更新
      window.dispatchEvent(new Event('storage'));
      onRefresh();
    } catch (error) {
      toast.error('删除失败，请重试');
    }
  };

  const allIndustries = [...new Set([...industries, ...customIndustries])].sort();
  
  const filteredIndustries = allIndustries.filter(industry =>
    industry.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-slate-800 border-slate-700 text-white max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">管理行业分类</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          <div className="space-y-3">
            <label className="text-sm font-medium text-slate-300">添加新行业</label>
            <div className="flex gap-2">
              <Input
                placeholder="输入行业名称"
                value={newIndustryName}
                onChange={(e) => setNewIndustryName(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddIndustry()}
                className="bg-slate-900/50 border-slate-700 text-white"
              />
              <Button
                onClick={handleAddIndustry}
                className="bg-emerald-600 hover:bg-emerald-700 whitespace-nowrap"
              >
                <Plus className="w-4 h-4 mr-2" />
                添加
              </Button>
            </div>
          </div>

          <div className="border-t border-slate-700 pt-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium text-slate-300">
                现有行业 ({filteredIndustries.length}/{allIndustries.length})
              </h3>
            </div>
            <Input
              placeholder="搜索行业..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-slate-900/50 border-slate-700 text-white mb-3"
            />
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {filteredIndustries.map((industry) => {
                const stockCount = industries.includes(industry) 
                  ? industries.filter(i => i === industry).length 
                  : 0;
                const isCustom = customIndustries.includes(industry) && !industries.includes(industry);
                
                return (
                  <div
                    key={industry}
                    className="flex items-center justify-between p-3 bg-slate-900/50 rounded-lg hover:bg-slate-900/70 transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-white font-medium">{industry}</span>
                      {isCustom && (
                        <span className="text-xs px-2 py-0.5 bg-emerald-500/20 text-emerald-400 rounded border border-emerald-500/30">
                          自定义
                        </span>
                      )}
                      {stockCount > 0 && (
                        <span className="text-xs text-slate-400">
                          ({stockCount} 只股票)
                        </span>
                      )}
                    </div>
                    <button
                      onClick={() => handleDeleteIndustry(industry)}
                      className="opacity-0 group-hover:opacity-100 p-2 hover:bg-red-500/20 rounded transition-all"
                      title="删除行业"
                    >
                      <Trash2 className="w-4 h-4 text-red-400" />
                    </button>
                  </div>
                );
              })}
              {filteredIndustries.length === 0 && (
                <div className="text-center py-8 text-slate-400">
                  未找到匹配的行业
                </div>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
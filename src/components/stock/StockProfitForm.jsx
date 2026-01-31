import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { X } from 'lucide-react';

export default function StockProfitForm({ stock, defaultYear, onSubmit, onCancel }) {
  const currentYear = new Date().getFullYear();
  const [formData, setFormData] = useState(stock || {
    year: defaultYear || currentYear,
    code: '',
    name: '',
    q1_report: '',
    q2_report: '',
    q3_report: '',
    annual_report: '',
    gross_margin: '',
    net_asset_ratio: '',
    undistributed_cash: '',
    bonus_shares: '',
    dividend: '',
    quarterly_comparison: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const submitData = {
      ...formData,
      year: formData.year ? parseInt(formData.year) : currentYear,
    };
    onSubmit(submitData);
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 border border-slate-700 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-slate-800 border-b border-slate-700 p-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-white">
            {stock ? '编辑股票利润' : '添加股票利润'}
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
                disabled
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
                disabled
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-300 mb-2">
                股票名称 *
              </label>
              <Input
                required
                placeholder="例如: 平安银行"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                className="bg-slate-900/50 border-slate-700 text-white"
                disabled
              />
            </div>
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
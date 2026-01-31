import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { X } from 'lucide-react';

export default function StockInstitutionForm({ stock, defaultYear, onSubmit, onCancel }) {
  const currentYear = new Date().getFullYear();
  const [formData, setFormData] = useState(stock || {
    year: defaultYear || currentYear,
    code: '',
    name: '',
    beishang_initial: '',
    beishang_new: '',
    beishang_increase: '',
    beishang_decrease: '',
    beishang_current: '',
    gongmu_initial: '',
    gongmu_new: '',
    gongmu_increase: '',
    gongmu_decrease: '',
    gongmu_current: '',
    waizi_initial: '',
    waizi_new: '',
    waizi_increase: '',
    waizi_decrease: '',
    waizi_current: '',
    simu_initial: '',
    simu_new: '',
    simu_increase: '',
    simu_decrease: '',
    simu_current: '',
    shebao_initial: '',
    shebao_new: '',
    shebao_increase: '',
    shebao_decrease: '',
    shebao_current: '',
    yanglao_initial: '',
    yanglao_new: '',
    yanglao_increase: '',
    yanglao_decrease: '',
    yanglao_current: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const submitData = {
      ...formData,
      year: formData.year ? parseInt(formData.year) : currentYear,
      beishang_initial: formData.beishang_initial ? Math.round(parseFloat(formData.beishang_initial)) : 0,
      beishang_new: formData.beishang_new ? Math.round(parseFloat(formData.beishang_new)) : 0,
      beishang_increase: formData.beishang_increase ? Math.round(parseFloat(formData.beishang_increase)) : 0,
      beishang_decrease: formData.beishang_decrease ? Math.round(parseFloat(formData.beishang_decrease)) : 0,
      beishang_current: formData.beishang_current ? Math.round(parseFloat(formData.beishang_current)) : 0,
      gongmu_initial: formData.gongmu_initial ? Math.round(parseFloat(formData.gongmu_initial)) : 0,
      gongmu_new: formData.gongmu_new ? Math.round(parseFloat(formData.gongmu_new)) : 0,
      gongmu_increase: formData.gongmu_increase ? Math.round(parseFloat(formData.gongmu_increase)) : 0,
      gongmu_decrease: formData.gongmu_decrease ? Math.round(parseFloat(formData.gongmu_decrease)) : 0,
      gongmu_current: formData.gongmu_current ? Math.round(parseFloat(formData.gongmu_current)) : 0,
      waizi_initial: formData.waizi_initial ? Math.round(parseFloat(formData.waizi_initial)) : 0,
      waizi_new: formData.waizi_new ? Math.round(parseFloat(formData.waizi_new)) : 0,
      waizi_increase: formData.waizi_increase ? Math.round(parseFloat(formData.waizi_increase)) : 0,
      waizi_decrease: formData.waizi_decrease ? Math.round(parseFloat(formData.waizi_decrease)) : 0,
      waizi_current: formData.waizi_current ? Math.round(parseFloat(formData.waizi_current)) : 0,
      simu_initial: formData.simu_initial ? Math.round(parseFloat(formData.simu_initial)) : 0,
      simu_new: formData.simu_new ? Math.round(parseFloat(formData.simu_new)) : 0,
      simu_increase: formData.simu_increase ? Math.round(parseFloat(formData.simu_increase)) : 0,
      simu_decrease: formData.simu_decrease ? Math.round(parseFloat(formData.simu_decrease)) : 0,
      simu_current: formData.simu_current ? Math.round(parseFloat(formData.simu_current)) : 0,
      shebao_initial: formData.shebao_initial ? Math.round(parseFloat(formData.shebao_initial)) : 0,
      shebao_new: formData.shebao_new ? Math.round(parseFloat(formData.shebao_new)) : 0,
      shebao_increase: formData.shebao_increase ? Math.round(parseFloat(formData.shebao_increase)) : 0,
      shebao_decrease: formData.shebao_decrease ? Math.round(parseFloat(formData.shebao_decrease)) : 0,
      shebao_current: formData.shebao_current ? Math.round(parseFloat(formData.shebao_current)) : 0,
      yanglao_initial: formData.yanglao_initial ? Math.round(parseFloat(formData.yanglao_initial)) : 0,
      yanglao_new: formData.yanglao_new ? Math.round(parseFloat(formData.yanglao_new)) : 0,
      yanglao_increase: formData.yanglao_increase ? Math.round(parseFloat(formData.yanglao_increase)) : 0,
      yanglao_decrease: formData.yanglao_decrease ? Math.round(parseFloat(formData.yanglao_decrease)) : 0,
      yanglao_current: formData.yanglao_current ? Math.round(parseFloat(formData.yanglao_current)) : 0,
    };
    onSubmit(submitData);
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleClearAll = () => {
    setFormData(prev => ({
      ...prev,
      beishang_initial: 0,
      beishang_new: 0,
      beishang_increase: 0,
      beishang_decrease: 0,
      beishang_current: 0,
      gongmu_initial: 0,
      gongmu_new: 0,
      gongmu_increase: 0,
      gongmu_decrease: 0,
      gongmu_current: 0,
      waizi_initial: 0,
      waizi_new: 0,
      waizi_increase: 0,
      waizi_decrease: 0,
      waizi_current: 0,
      simu_initial: 0,
      simu_new: 0,
      simu_increase: 0,
      simu_decrease: 0,
      simu_current: 0,
      shebao_initial: 0,
      shebao_new: 0,
      shebao_increase: 0,
      shebao_decrease: 0,
      shebao_current: 0,
      yanglao_initial: 0,
      yanglao_new: 0,
      yanglao_increase: 0,
      yanglao_decrease: 0,
      yanglao_current: 0,
    }));
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 border border-slate-700 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-slate-800 border-b border-slate-700 p-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-white">
            {stock ? '编辑机构增减' : '添加机构增减'}
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
            <h3 className="text-lg font-semibold text-white mb-4">机构增减（单位：万）</h3>
            
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-emerald-400 mb-3">北上</h4>
                <div className="grid grid-cols-4 gap-4">
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">总持</label>
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
                    <label className="block text-xs text-slate-400 mb-1">总持</label>
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
                    <label className="block text-xs text-slate-400 mb-1">总持</label>
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
                    <label className="block text-xs text-slate-400 mb-1">总持</label>
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
                    <label className="block text-xs text-slate-400 mb-1">总持</label>
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
                    <label className="block text-xs text-slate-400 mb-1">总持</label>
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

          <div className="flex justify-between items-center pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={handleClearAll}
              className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
            >
              一键清零
            </Button>
            <div className="flex space-x-3">
              <Button type="button" variant="outline" onClick={onCancel}>
                取消
              </Button>
              <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700">
                {stock ? '保存' : '添加'}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}